import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTransactionModal from "../components/AddTransactionModal";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="home">
      <div className="home-content">
        <h1>
          Take Control of <br />
          Your Money
        </h1>

        <p>
          Track expenses, manage income, and understand your spending
          with clear insights and smart analytics.
        </p>

        <div className="home-actions">
          {/* Dashboard still navigates */}
          <button
            className="primary"
            onClick={() => navigate("/app/dashboard")}
          >
            Go to Dashboard
          </button>

          {/* Add Transaction opens MODAL */}
          <button
            className="secondary"
            onClick={() => setOpenModal(true)}
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Decorative waves */}
      <div className="home-waves" />

      {/* MODAL */}
      {openModal && (
        <AddTransactionModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}