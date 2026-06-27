import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/my-projects")
      .then((res) => setProjects(res.data.created || res.data || []))
      .catch(console.error);
  }, []);

  const renderTags = (stack) => {
    if (!stack) return null;

    return stack.split(/[,\s]+/).filter(Boolean).map((tag, index) => (
      <span className="tech-tag" key={index}>
        {tag}
      </span>
    ));
  };

  return (
    <div className="container my-projects">
      <div className="page-head">
        <div>
          <p className="eyebrow">OWNER SPACE</p>
          <h1>My Projects</h1>
        </div>

        <Link to="/projects/create">
          <button>Create Project</button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card empty-state">
          <b>No projects yet</b>
          <span>Create your first project and invite teammates.</span>
        </div>
      ) : (
        <div className="grid">
          {projects.map((project) => (
            <div className="card project-card" key={project.id}>
              <span className="badge owner">My Project</span>

              <h2>{project.title}</h2>

              <p>{project.description}</p>

              <div className="tags">
                {renderTags(project.stack)}
              </div>

              <p>
                <b>Deadline:</b> {project.deadline || "Not specified"}
              </p>

              <div className="actions">
                <Link to={`/projects/${project.id}`}>
                  <button>Open</button>
                </Link>

                <Link to={`/projects/${project.id}/edit`}>
                  <button>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;