import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/category-summary.css";
import api from "../api/api";

export default function CategorySummary() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return;

    const loadSummary = async () => {
      try {
        const res = await api.get(`/transactions/user/${user.id}`);
        const data = res.data;

        const result = {};

        data.forEach((t) => {
          if (!result[t.category]) {
            result[t.category] = {
              amount: 0,
              type: t.type,
            };
          }
          result[t.category].amount += t.amount;
        });

        setSummary(result);
      } catch (err) {
        console.error("Category summary error:", err);
        alert("Failed to load category summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [user]);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading summary...</p>;
  }

  return (
    <div className="category-summary">
      <h2>Category Summary</h2>

      <div className="category-grid">
        {Object.keys(summary).length === 0 && (
          <p>No transactions yet</p>
        )}

        {Object.keys(summary).map((cat) => (
          <div
            key={cat}
            className={`category-card ${
              summary[cat].type === "INCOME" ? "income" : "expense"
            }`}
          >
            <h3>{cat}</h3>
            <p className="amount">₹{summary[cat].amount}</p>
            <span className="type">{summary[cat].type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}