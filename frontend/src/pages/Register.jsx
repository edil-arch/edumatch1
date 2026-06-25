import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/register", form);
    localStorage.setItem("token", res.data.token);
    navigate("/projects");
  };

  return (
    <div className="auth">
      <form onSubmit={submit} className="card">
        <h2>Register</h2>
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button>Create account</button>
        <p>Already have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;