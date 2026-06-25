import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    stack: "",
    deadline: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/projects", form);

    navigate("/projects");
  };

  return (
    <div className="auth">
      <form className="card" onSubmit={submit}>
        <h2>Create Project</h2>

        <input
          placeholder="Title"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="React, Go..."
          onChange={e => setForm({ ...form, stack: e.target.value })}
        />

        <input
          type="date"
          onChange={e => setForm({ ...form, deadline: e.target.value })}
        />

        <button>Create</button>
      </form>
    </div>
  );
}

export default CreateProject;