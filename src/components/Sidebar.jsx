import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h1 className="brand">Money-Manager</h1>

      <nav>
        <NavLink to="/app/home">Home</NavLink>
        <NavLink to="/app/dashboard">Dashboard</NavLink>
        <NavLink to="/app/categories">Categories</NavLink>
        <NavLink to="/app/history">History</NavLink>
        <NavLink to="/app/add">Add Transaction</NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="logout-wrapper">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}