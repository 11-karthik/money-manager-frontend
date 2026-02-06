import { useState } from "react";
import "../styles/editTransactionModal.css";
import api from "../api/api";

export default function EditTransactionModal({
  transaction,
  onClose,
  onSuccess,
}) {
  const [amount, setAmount] = useState(transaction.amount);
  const [category, setCategory] = useState(transaction.category);
  const [description, setDescription] = useState(transaction.description || "");
  const [division, setDivision] = useState(transaction.division);
  const [type, setType] = useState(transaction.type);
  const [loading, setLoading] = useState(false);

  const updateTransaction = async () => {
    setLoading(true);

    // ✅ handle Mongo `_id` or `id`
    const transactionId = transaction.id || transaction._id;

    const payload = {
      amount: Number(amount),
      category,
      description,
      division,
      type,
    };

    try {
      await api.put(`/transactions/${transactionId}`, payload);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update error:", err);

      if (err.response) {
        alert(err.response.data.message || "Failed to update transaction");
      } else {
        alert("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Transaction</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <select value={division} onChange={(e) => setDivision(e.target.value)}>
          <option value="PERSONAL">Personal</option>
          <option value="OFFICE">Office</option>
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={updateTransaction}
            disabled={loading}
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}