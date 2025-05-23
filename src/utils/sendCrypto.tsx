import { ethers } from "ethers";
import axios from "axios";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import ECPairFactory from "ecpair";
import toast from "react-hot-toast";

const ECPair = ECPairFactory(ecc);
const NETWORK = bitcoin.networks.bitcoin;

export const sendErc20Token = async (
  recipient: string,
  amount: string,
  tokenAddress: string,
  privateKey: string,
  fees: string
) => {
  // 2. Connect to provider (e.g., Ethereum mainnet or testnet)
  const provider = new ethers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_SECRET}`
  );

  // 3. Create wallet from private key
  const wallet = new ethers.Wallet(privateKey, provider);

  // 4. Define ERC20 ABI (just `transfer` needed)
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() view returns (uint8)",
  ];

  // 5. Create token contract instance
  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

  // 6. Get decimals and calculate amount in smallest unit
  const decimals = await tokenContract.decimals();
  const amountInWei = ethers.parseUnits(amount, decimals);

  // 7. Send the transfer transaction
  const tx = await tokenContract.transfer(recipient, amountInWei, {
    gasPrice: BigInt(fees),
    maxPriorityFeePerGas: BigInt("1500000000"),
  });
  toast.success(`Transaction sent! Hash: ${tx.hash}`, {
    style: {
      border: "1px solid #1e293b",
      padding: "16px",
      color: "#1e293b",
    },
    iconTheme: {
      primary: "#713200",
      secondary: "#FFFAEE",
    },
  });

  // 8. Optionally wait for confirmation
  await tx.wait();
  toast.success(`Transaction confirmed!`, {
    style: {
      border: "1px solid #1e293b",
      padding: "16px",
      color: "#1e293b",
    },
    iconTheme: {
      primary: "#713200",
      secondary: "#FFFAEE",
    },
  });
};

export const sendEth = async (
  recipient: string,
  amount: string,
  privateKey: string,
  fees: string
) => {
  // 1. Set your private key and provider
  const provider = new ethers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_SECRET}`
  );
  const wallet = new ethers.Wallet(privateKey, provider);

  // 3. Define transaction details

  // 4. Define manual gas settings
  const gasPrice = ethers.parseUnits(fees, "wei"); // customize as needed
  const gasLimit = 21000; // fixed for simple ETH transfer

  // 5. Build and send the transaction
  const tx = await wallet.sendTransaction({
    to: recipient,
    value: ethers.parseEther(amount),
    gasPrice,
    gasLimit,
  });

  toast.success(`Transaction sent! Hash: ${tx.hash}`, {
    style: {
      border: "1px solid #1e293b",
      padding: "16px",
      color: "#1e293b",
    },
    iconTheme: {
      primary: "#713200",
      secondary: "#FFFAEE",
    },
  });
  // 6. Optionally wait for confirmation
  await tx.wait();
  toast.success(`Transaction confirmed!`, {
    style: {
      border: "1px solid #1e293b",
      padding: "16px",
      color: "#1e293b",
    },
    iconTheme: {
      primary: "#713200",
      secondary: "#FFFAEE",
    },
  });
};

interface SendBTCParams {
  privateKeyWIF: string;
  senderAddress: string;
  recipientAddress: string;
  amountSats: number;
  feeSats: number;
}

export async function sendBTC({
  privateKeyWIF,
  senderAddress,
  recipientAddress,
  amountSats,
  feeSats,
}: SendBTCParams): Promise<string> {
  // Fetch UTXOs
  const utxosRes = await axios.get(
    `https://blockstream.info/api/address/${senderAddress}/utxo`
  );
  const utxos: { txid: string; vout: number; value: number }[] = utxosRes.data;

  if (!utxos.length) throw new Error("No UTXOs available");

  const keyPair = ECPair.fromWIF(privateKeyWIF, NETWORK);
  const psbt = new bitcoin.Psbt({ network: NETWORK });

  let inputSum = 0;

  for (const utxo of utxos) {
    if (inputSum >= amountSats + feeSats) break;

    const txHex = (
      await axios.get(`https://blockstream.info/api/tx/${utxo.txid}/hex`)
    ).data;
    const rawTx = bitcoin.Transaction.fromHex(txHex);
    const output = rawTx.outs[utxo.vout];

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: output.script,
        value: output.value,
      },
    });

    inputSum += output.value;
  }

  if (inputSum < amountSats + feeSats) throw new Error("Insufficient funds");

  psbt.addOutput({
    address: recipientAddress,
    value: amountSats,
  });

  const change = inputSum - amountSats - feeSats;
  if (change > 0) {
    psbt.addOutput({
      address: senderAddress,
      value: change,
    });
  }

  psbt.signAllInputs({
    publicKey: Buffer.from(keyPair.publicKey),
    sign: (hash: Buffer) => {
      return Buffer.from(keyPair.sign(hash));
    },
  });
  psbt.validateSignaturesOfAllInputs((pubkey, msghash, signature) => {
    return ECPair.fromPublicKey(pubkey).verify(msghash, signature);
  });
  psbt.finalizeAllInputs();

  const txHex = psbt.extractTransaction().toHex();

  const broadcastRes = await axios.post(
    "https://blockstream.info/api/tx",
    txHex,
    {
      headers: { "Content-Type": "text/plain" },
    }
  );
  toast.success(`Transaction confirmed`, {
    style: {
      border: "1px solid #1e293b",
      padding: "16px",
      color: "#1e293b",
    },
    iconTheme: {
      primary: "#713200",
      secondary: "#FFFAEE",
    },
  });

  return broadcastRes.data; // txid
}
