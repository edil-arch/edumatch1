import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    navigate("/projects");
  };

  return (
    <div className="auth">
      <form onSubmit={submit} className="card">
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button>Login</button>
        <p>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default Login;