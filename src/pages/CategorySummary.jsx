import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/category-summary.css";

export default function CategorySummary() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8080/api/transactions/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        const result = {};

        data.forEach(t => {
          if (!result[t.category]) {
            result[t.category] = {
              amount: 0,
              type: t.type
            };
          }
          result[t.category].amount += t.amount;
        });

        setSummary(result);
      });
  }, [user.id]);

  return (
    <div className="category-summary">
      <h2>Category Summary</h2>

      <div className="category-grid">
        {Object.keys(summary).map(cat => (
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