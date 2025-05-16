import React from "react";

const BuyCryptoModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1e293b] text-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl border border-slate-700">
        <h2 className="text-xl font-semibold mb-2 text-white">Buy Crypto</h2>
        <p className="text-sm text-slate-300 mb-5">
          Choose a partner to purchase crypto securely.
        </p>

        <div className="space-y-3">
          <a
            href="https://www.moonpay.com/buy"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-center py-2 rounded-lg shadow hover:shadow-lg"
          >
            Buy with MoonPay
          </a>
          <a
            href="https://global.transak.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white text-center py-2 rounded-lg shadow hover:shadow-lg"
          >
            Buy with Transak
          </a>
          <a
            href="https://ramp.network/buy"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-700 transition-colors text-white text-center py-2 rounded-lg shadow hover:shadow-lg"
          >
            Buy with Ramp
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm text-slate-400 hover:text-white hover:underline transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuyCryptoModal;
