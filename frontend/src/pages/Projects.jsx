import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get(`/projects?search=${search}`)
      .then((res) => setProjects(res.data))
      .catch(console.error);
  }, [search]);

  const deleteProject = async (id) => {
    if (!localStorage.getItem("token")) {
      alert("Login required");
      return;
    }

    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Only creator can delete");
    }
  };

  const renderTags = (stack) => {
    if (!stack) return null;

    return stack.split(/[,\s]+/).filter(Boolean).map((tag, i) => (
      <span className="tech-tag" key={i}>
        {tag}
      </span>
    ));
  };

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <p className="eyebrow">DISCOVER</p>
          <h1>Projects</h1>
        </div>

        <Link to="/projects/create">
          <button>Create Project</button>
        </Link>
      </div>

      <div className="search-box">
        <input
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {projects.length === 0 ? (
        <div className="card empty-state">
          <b>No projects found</b>
          <span>Try another search or create your own project.</span>
        </div>
      ) : (
        <div className="grid">
          {projects.map((project) => (
            <div className="card project-card" key={project.id}>
              <div className="project-top">
                <h2>{project.title}</h2>

                <span className="status-badge">Open</span>
              </div>

              <p>{project.description}</p>

              <div className="tags">
                {renderTags(project.stack)}
              </div>

              <div className="project-info">
                <p>
                  <b>Creator:</b>{" "}
                  {project.creator?.name || "Unknown"}
                </p>

                <p>
                  <b>Deadline:</b>{" "}
                  {project.deadline || "Not specified"}
                </p>
              </div>

              <div className="actions">
                <Link to={`/projects/${project.id}`}>
                  <button>Open</button>
                </Link>

                {localStorage.getItem("token") && (
                  <button
                    className="danger"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;