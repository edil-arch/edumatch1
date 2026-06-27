import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const [me, setMe] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [apps, setApps] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const fakeProjects = [
    {
      title: "AI Study Planner",
      stack: "React • Python • PostgreSQL",
      text: "Команда ищет frontend-разработчика для умного планировщика учебы.",
    },
    {
      title: "Hackathon Finder",
      stack: "Go • React • Redis",
      text: "Платформа для поиска хакатонов и участников команды.",
    },
    {
      title: "Student Portfolio",
      stack: "Next.js • Figma",
      text: "Сервис для создания красивого портфолио студента.",
    },
  ];

  useEffect(() => {
    api.get("/auth/me").then((res) => setMe(res.data)).catch(() => {});

    api.get("/my-projects").then((res) => {
      setMyProjects(res.data.created || res.data || []);
    }).catch(() => {});

    api.get("/my-applications").then((res) => {
      setApps(res.data || []);
    }).catch(() => {});

    api.get("/recommended-projects").then((res) => {
      setRecommended(res.data || []);
    }).catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const userInitial = me?.name ? me.name.charAt(0).toUpperCase() : "E";

  return (
    <div className="container">
      <div className="hero-card hero-dashboard">
        <div className="hero-user">
          <div className="dashboard-avatar">{userInitial}</div>

          <div>
            <p className="eyebrow">{today}</p>
            <h1>Welcome, {me?.name || "Student"} 👋</h1>
            <p>
              Управляй проектами, заявками и находи новых тиммейтов для учебы.
            </p>
          </div>
        </div>

        <Link to="/projects/create">
          <button>Create Project</button>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>{myProjects.length}</span>
          <p>My Projects</p>
        </div>

        <div className="stat-card">
          <span>{apps.length}</span>
          <p>Applications</p>
        </div>

        <div className="stat-card">
          <span>{recommended.length}</span>
          <p>Recommended</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>My Projects</h2>

          {myProjects.length === 0 && (
            <div className="empty-state">
              <b>No projects yet</b>
              <span>Create your first project and start building a team.</span>
            </div>
          )}

          {myProjects.map((p) => (
            <div className="mini-project" key={p.id}>
              <Link to={`/projects/${p.id}`}>
                <b>{p.title}</b>
              </Link>
              <span>{p.stack || "No stack specified"}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>My Applications</h2>

          {apps.length === 0 && (
            <div className="empty-state">
              <b>No applications yet</b>
              <span>Join interesting projects to see applications here.</span>
            </div>
          )}

          {apps.map((a) => (
            <div className="mini-project" key={a.id}>
              <b>{a.project?.title || "Project"}</b>
              <span>Status: {a.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Recent Activity</h2>

          <div className="activity-list">
            <p>✅ Profile is ready</p>
            <p>📁 Projects module connected</p>
            <p>👥 Join / Leave system enabled</p>
            <p>💬 Project chat available</p>
          </div>
        </div>
      </div>

      <h2 className="section-title">Recommended Projects</h2>

      <div className="grid">
        {recommended.length === 0 &&
          fakeProjects.map((p, index) => (
            <div className="card project-card fake-card" key={index}>
              <span className="fake-badge">Example</span>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
              <p>
                <b>Stack:</b> {p.stack}
              </p>
              <button disabled>Preview</button>
            </div>
          ))}

        {recommended.map((p) => (
          <div className="card project-card" key={p.id}>
            <span className="fake-badge">Recommended</span>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <p>
              <b>Stack:</b> {p.stack}
            </p>
            <Link to={`/projects/${p.id}`}>
              <button>Open</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;