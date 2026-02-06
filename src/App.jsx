import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CategorySummary from "./pages/CategorySummary";
import History from "./pages/History";
import AddTransaction from "./pages/AddTransaction";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* APP WITH SIDEBAR */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <Sidebar />
              <div className="app-content">
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="categories" element={<CategorySummary />} />
                  <Route path="history" element={<History />} />
                  <Route path="add" element={<AddTransaction />} />
                  <Route path="*" element={<Navigate to="home" />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}