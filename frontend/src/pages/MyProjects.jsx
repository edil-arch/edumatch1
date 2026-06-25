import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/my-projects")
      .then(res => setProjects(res.data.created || res.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h1>My Projects</h1>

      {projects.length === 0 && <p>No projects yet</p>}

      {projects.map(project => (
        <div className="card" key={project.id}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p><b>Stack:</b> {project.stack}</p>
          <Link to={`/projects/${project.id}`}>
            <button>Open</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default MyProjects;