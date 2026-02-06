import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import api from "../api/api";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      // ✅ request body
      const payload = {
        name,
        email,
        password,
      };

      // ✅ axios POST
      await api.post("/users/signup", payload);

      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);

      if (err.response) {
        alert(err.response.data.message || "Signup failed");
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Signup</h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Register</button>

        <Link to="/login">Already have an account?</Link>
      </div>
    </div>
  );
}