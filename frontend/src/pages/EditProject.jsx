import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    stack: "",
    deadline: "",
  });

  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => {
      const p = res.data.project || res.data;

      setForm({
        title: p.title || "",
        description: p.description || "",
        stack: p.stack || "",
        deadline: p.deadline || "",
      });
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/projects/${id}`, form);
      navigate(`/projects/${id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Edit error");
    }
  };

  return (
    <div className="auth">
      <form className="card" onSubmit={submit}>
        <h2>Edit Project</h2>

        <input
          value={form.title}
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          value={form.description}
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          value={form.stack}
          placeholder="Stack"
          onChange={(e) => setForm({ ...form, stack: e.target.value })}
        />

        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <button>Save Changes</button>
      </form>
    </div>
  );
}

export default EditProject;