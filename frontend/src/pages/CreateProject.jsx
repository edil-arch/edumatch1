import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    stack: "",
    deadline: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/projects", form);
      alert("Project created");
      navigate("/projects");
    } catch (err) {
      alert(err.response?.data?.error || "Create project error");
    }
  };

  return (
    <div className="auth">
      <form className="card create-card" onSubmit={submit}>
        <p className="eyebrow">NEW TEAM</p>
        <h2>Create Project</h2>
        <p className="muted">
          Describe your idea and find teammates with the right skills.
        </p>

        <label>Project title</label>
        <input
          value={form.title}
          placeholder="EduMatch Mobile App"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={form.description}
          placeholder="Tell students what your project is about..."
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label>Technology stack</label>
        <input
          value={form.stack}
          placeholder="React, Go, PostgreSQL"
          onChange={(e) => setForm({ ...form, stack: e.target.value })}
        />

        <label>Deadline</label>
        <input
          value={form.deadline}
          type="date"
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <button>Create Project</button>
      </form>
    </div>
  );
}

export default CreateProject;