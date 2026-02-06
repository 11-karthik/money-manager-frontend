import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EditTransactionModal from "../components/EditTransactionModal";
import "../styles/history.css";

export default function History() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);

  // 🔍 FILTER STATES
  const [category, setCategory] = useState("");
  const [division, setDivision] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = () => {
    fetch(`http://localhost:8080/api/transactions/user/${user.id}`)
      .then(res => res.json())
      .then(setTransactions);
  };

  useEffect(() => {
    loadData();
  }, []);

  const canEdit = (createdAt) => {
    const diffHours =
      (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    return diffHours <= 12;
  };

  // ✅ APPLY FILTERS (SAFE)
  const filteredTransactions = transactions.filter(t => {
    const txDate = new Date(t.transactionDate);

    if (category && t.category !== category) return false;
    if (division && t.division !== division) return false;
    if (fromDate && txDate < new Date(fromDate)) return false;
    if (toDate && txDate > new Date(toDate)) return false;

    return true;
  });

  return (
    <div className="history">
      <h2>Transaction History</h2>

      {/* 🔍 FILTER BAR */}
      <div className="filters">
        <input type="date" onChange={e => setFromDate(e.target.value)} />
        <input type="date" onChange={e => setToDate(e.target.value)} />

        <select onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="fuel">Fuel</option>
          <option value="salary">Salary</option>
        </select>

        <select onChange={e => setDivision(e.target.value)}>
          <option value="">All Divisions</option>
          <option value="PERSONAL">Personal</option>
          <option value="OFFICE">Office</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Division</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map(t => {
              const editable = canEdit(t.createdAt);

              return (
                <tr key={t.id}>
                  <td>{new Date(t.transactionDate).toLocaleString()}</td>
                  <td>{t.description || "-"}</td>
                  <td>{t.category}</td>
                  <td>{t.division}</td>
                  <td className={t.type === "INCOME" ? "income" : "expense"}>
                    {t.type}
                  </td>
                  <td className="amount">₹{t.amount}</td>
                  <td>
                    {editable ? (
                      <button
                        className="edit-btn"
                        onClick={() => setSelected(t)}
                      >
                        Edit
                      </button>
                    ) : (
                      <span className="locked">Locked</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <EditTransactionModal
          transaction={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}