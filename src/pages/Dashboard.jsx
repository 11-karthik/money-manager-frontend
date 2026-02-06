import "../styles/dashboard.css";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState("MONTH"); // WEEK | MONTH | YEAR
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!user || !user.id) return;

    const loadTransactions = async () => {
      try {
        const res = await api.get(`/transactions/user/${user.id}`);
        setTransactions(res.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading dashboard...</p>;
  }

  /* ---------------- TOTALS ---------------- */
  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  const savings = income - expense;

  /* ---------------- CATEGORY SUMMARY ---------------- */
  const categoryMap = {};
  transactions.forEach((t) => {
    if (t.type === "EXPENSE") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    }
  });

  /* ---------------- TIME BASED AGGREGATION ---------------- */
  const labels = [];
  const incomeData = [];
  const expenseData = [];
  const now = new Date();

  if (view === "WEEK") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach((d) => {
      labels.push(d);
      incomeData.push(0);
      expenseData.push(0);
    });

    transactions.forEach((t) => {
      const d = new Date(t.transactionDate);
      if (d >= new Date(now - 7 * 24 * 60 * 60 * 1000)) {
        const idx = d.getDay();
        t.type === "INCOME"
          ? (incomeData[idx] += t.amount)
          : (expenseData[idx] += t.amount);
      }
    });
  }

  if (view === "MONTH") {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    weeks.forEach((w) => {
      labels.push(w);
      incomeData.push(0);
      expenseData.push(0);
    });

    transactions.forEach((t) => {
      const d = new Date(t.transactionDate);
      if (d.getMonth() === now.getMonth()) {
        const week = Math.min(3, Math.floor(d.getDate() / 7));
        t.type === "INCOME"
          ? (incomeData[week] += t.amount)
          : (expenseData[week] += t.amount);
      }
    });
  }

  if (view === "YEAR") {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    months.forEach((m) => {
      labels.push(m);
      incomeData.push(0);
      expenseData.push(0);
    });

    transactions.forEach((t) => {
      const d = new Date(t.transactionDate);
      if (d.getFullYear() === now.getFullYear()) {
        const m = d.getMonth();
        t.type === "INCOME"
          ? (incomeData[m] += t.amount)
          : (expenseData[m] += t.amount);
      }
    });
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="date">{new Date().toDateString()}</p>
        </div>

        <select
          className="view-select"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="WEEK">Weekly</option>
          <option value="MONTH">Monthly</option>
          <option value="YEAR">Yearly</option>
        </select>
      </div>

      {/* STATS */}
      <div className="stats">
        <Stat title="Total Income" value={`₹${income}`} green />
        <Stat title="Total Expense" value={`₹${expense}`} red />
        <Stat title="Savings" value={`₹${savings}`} />
      </div>

      {/* CHARTS */}
      <div className="grid">
        <div className="card">
          <h3>Expenses by Category</h3>
          <Doughnut
            data={{
              labels: Object.keys(categoryMap),
              datasets: [
                {
                  data: Object.values(categoryMap),
                  backgroundColor: [
                    "#22c55e",
                    "#5eead4",
                    "#ef4444",
                    "#facc15",
                  ],
                },
              ],
            }}
          />
        </div>

        <div className="card wide">
          <h3>{view} Income vs Expense</h3>
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "Income",
                  data: incomeData,
                  backgroundColor: "#22c55e",
                },
                {
                  label: "Expense",
                  data: expenseData,
                  backgroundColor: "#ef4444",
                },
              ],
            }}
          />
        </div>

        <div className="card wide">
          <h3>Expense Trend</h3>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Expense",
                  data: expenseData,
                  borderColor: "#5eead4",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
function Stat({ title, value, green, red }) {
  return (
    <div className={`stat ${green ? "green" : ""} ${red ? "red" : ""}`}>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}