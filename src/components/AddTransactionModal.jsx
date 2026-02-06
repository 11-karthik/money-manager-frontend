import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/addTransactionModal.css";

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

    const payload = {
      userId: user.id,
      amount: Number(amount),
      category,
      description,
      type: tab,
      division,
      transactionDate: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:8080/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to add transaction");
        return;
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Server error");
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