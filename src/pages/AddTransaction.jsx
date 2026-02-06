import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/add-transaction.css";
import api from "../api/api";

export default function AddTransaction() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [division, setDivision] = useState("PERSONAL");

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  const save = async () => {
    if (!amount || !category) {
      alert("Amount & category required");
      return;
    }

    const payload = {
      userId: user.id,
      amount: Number(amount),
      category,
      description,
      type,
      division,
      // ✅ BACKEND-COMPATIBLE DATE FORMAT
      transactionDate: new Date().toISOString().slice(0, 19),
    };

    try {
      await api.post("/transactions", payload);

      navigate("/app/dashboard");
    } catch (err) {
      console.error("Add transaction error:", err);

      if (err.response) {
        alert(err.response.data.message || "Failed to add transaction");
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>

      <div className="form-card">
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            placeholder="₹ Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            placeholder="Food, Rent, Salary..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            placeholder="Optional note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            >
              <option value="PERSONAL">Personal</option>
              <option value="OFFICE">Office</option>
            </select>
          </div>
        </div>

        <button className="save-btn" onClick={save}>
          Save Transaction
        </button>
      </div>
    </div>
  );
}