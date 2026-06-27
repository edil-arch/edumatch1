import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    university: "",
    course: "",
    skills: "",
    about: "",
    avatar: "",
  });

  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));

    api.get("/my-projects")
      .then((res) => setMyProjects(res.data.created || res.data || []))
      .catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/profile", user);
      setUser(res.data);
      alert("Profile saved");
    } catch {
      alert("Profile save error");
    }
  };

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const skills = user.skills
    ? user.skills.split(/[,\s]+/).filter(Boolean)
    : [];

  return (
    <div className="profile-page">
      <div className="profile-layout">
        <div className="card profile-side">
          <div className="big-avatar">{initial}</div>

          <h1>{user.name || "Student"}</h1>

          <p className="muted">{user.email}</p>

          <div className="profile-meta">
            <p><b>University:</b> {user.university || "Not specified"}</p>
            <p><b>Course:</b> {user.course || "Not specified"}</p>
          </div>

          <div className="tags">
            {skills.length === 0 && <span>No skills yet</span>}
            {skills.map((skill, index) => (
              <span className="tech-tag" key={index}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <form className="card profile-card" onSubmit={save}>
            <h2>Edit Profile</h2>

            <input
              value={user.name || ""}
              placeholder="Name"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />

            <input
              value={user.university || ""}
              placeholder="University"
              onChange={(e) =>
                setUser({ ...user, university: e.target.value })
              }
            />

            <input
              value={user.course || ""}
              placeholder="Course"
              onChange={(e) =>
                setUser({ ...user, course: Number(e.target.value) })
              }
            />

            <input
              value={user.skills || ""}
              placeholder="Skills: React, Go, PostgreSQL"
              onChange={(e) => setUser({ ...user, skills: e.target.value })}
            />

            <textarea
              value={user.about || ""}
              placeholder="About me"
              onChange={(e) => setUser({ ...user, about: e.target.value })}
            />

            <button>Save Profile</button>
          </form>

          <div className="card profile-card">
            <h2>My Projects</h2>

            {myProjects.length === 0 && (
              <div className="empty-state">
                <b>No projects yet</b>
                <span>Create your first project from the dashboard.</span>
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
        </div>
      </div>
    </div>
  );
}

export default Profile;