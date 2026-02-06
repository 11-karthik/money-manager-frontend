import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/addTransactionModal.css";
import api from "../api/api";

export default function AddTransactionModal({ onClose, onSuccess }) {
  const { user } = useContext(AuthContext);

  const [tab, setTab] = useState("EXPENSE"); // EXPENSE | INCOME
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [division, setDivision] = useState("PERSONAL");

  const save = async () => {
    if (!amount || !category) {
      alert("Amount & Category required");
      return;
    }

    // ✅ FORMAT DATE FOR LocalDateTime (NO Z, NO MS)
    const now = new Date();
    const transactionDate = now.toISOString().slice(0, 19);

    const payload = {
      userId: user.id,
      amount: Number(amount),
      category,
      description,
      type: tab,
      division,
      transactionDate,
    };

    try {
      await api.post("/transactions", payload);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Transaction error:", err);

      if (err.response) {
        alert(err.response.data.message || "Failed to add transaction");
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Transaction</h2>

        {/* TABS */}
        <div className="tabs">
          <button
            className={tab === "EXPENSE" ? "active" : ""}
            onClick={() => setTab("EXPENSE")}
          >
            Expense
          </button>
          <button
            className={tab === "INCOME" ? "active" : ""}
            onClick={() => setTab("INCOME")}
          >
            Income
          </button>
        </div>

        {/* FORM */}
        <div className="form">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            placeholder="Category (food, salary...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="PERSONAL">Personal</option>
            <option value="OFFICE">Office</option>
          </select>

          <div className="actions">
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="save" onClick={save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}