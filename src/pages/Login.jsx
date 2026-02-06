import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/users/login", {
        email,
        password,
      });

      const data = res.data; // ✅ axios data

      login({
        id: data.id || data._id,
        name: data.name,
        email: data.email,
      });

      navigate("/app/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        <input
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

        <button onClick={handleLogin}>Login</button>

        <Link to="/signup">Create account</Link>
      </div>
    </div>
  );
}