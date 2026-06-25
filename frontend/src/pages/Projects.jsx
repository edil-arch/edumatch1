import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const loadProjects = () => {
    api.get(`/projects?search=${search}`)
      .then(res => setProjects(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container">
      <div className="page-head">
        <h1>Projects</h1>
        <Link to="/projects/create"><button>Create Project</button></Link>
      </div>

      <div className="search-box">
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={loadProjects}>Search</button>
      </div>

      <div className="grid">
        {projects.map(project => (
          <div className="card project-card" key={project.id}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p><b>Stack:</b> {project.stack}</p>
            <p><b>Deadline:</b> {project.deadline}</p>
            <Link to={`/projects/${project.id}`}><button>Open</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;