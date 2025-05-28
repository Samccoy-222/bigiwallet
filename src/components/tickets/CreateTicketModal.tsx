import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { useTicketStore } from "../../store/ticketStore";
import { supabase } from "../../store/authStore";

interface CreateTicketModalProps {
  onClose: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ onClose }) => {
  const { categories, createTicket, fetchCategories } = useTicketStore();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category_id: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    await createTicket({ ...formData, user_id: user?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-background-light rounded-xl p-6 w-full max-w-lg border border-neutral-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Support Ticket</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Category
            </label>
            <select
              className="input w-full"
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Priority
            </label>
            <select
              className="input w-full"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as any })
              }
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              className="input w-full"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              className="input w-full h-32"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detailed explanation of your issue..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
