import React, { useState } from "react";
import Modal from "../common/Modal";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  ticketSummary?: string; // e.g., subject
  ticketContent?: string; // e.g., description/body
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  ticketSummary,
  ticketContent,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reply to: ${ticketSummary}`}
    >
      <div className="space-y-4">
        {/* Ticket content block */}
        {ticketContent && (
          <div className="p-3 rounded-md bg-neutral-800 border border-neutral-700 text-sm text-neutral-300 whitespace-pre-wrap">
            {ticketContent}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Your Message</label>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-700 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary/80 text-sm"
          >
            Send Reply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReplyModal;
