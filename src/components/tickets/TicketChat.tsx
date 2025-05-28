import React, { useState, useEffect, useRef } from "react";
import { useTicketStore } from "../../store/ticketStore";
import { formatDistance } from "date-fns";
import { Send } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const TicketChat: React.FC = () => {
  const { selectedTicket, tickets, messages, fetchMessages, sendMessage } =
    useTicketStore();
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    await sendMessage(selectedTicket.id, newMessage);
    setNewMessage("");
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-8">
  //       <Loader className="animate-spin text-primary\" size={24} />
  //     </div>
  //   );
  // }
  if (!selectedTicket || tickets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        Select a ticket to view the conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === user?.id;

          return (
            <div
              key={message.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isCurrentUser
                    ? "bg-primary text-white"
                    : "bg-neutral-800 text-neutral-100"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs mt-1 opacity-75">
                  {formatDistance(new Date(message.created_at), new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800">
        <div className="flex space-x-2">
          <input
            type="text"
            className="input flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketChat;
