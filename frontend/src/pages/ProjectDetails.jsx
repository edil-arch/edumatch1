import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const project = data.project || data;
  const members = data.members || [];
  const isOwner = me && project.creator_id === me.id;

  const loadProject = () => {
    api.get(`/projects/${id}`).then((res) => setData(res.data));
  };

  const loadMessages = () => {
    api.get(`/projects/${id}/messages`).then((res) => setMessages(res.data));
  };

  useEffect(() => {
    loadProject();
    loadMessages();

    if (localStorage.getItem("token")) {
      api.get("/auth/me").then((res) => setMe(res.data)).catch(() => {});
    }
  }, [id]);

  const joinProject = async () => {
    try {
      await api.post(`/projects/${id}/join`);
      alert("Application sent");
      loadProject();
    } catch (err) {
      alert(err.response?.data?.error || "Join error");
    }
  };

  const leaveProject = async () => {
    try {
      await api.delete(`/projects/${id}/leave`);
      alert("You left project");
      loadProject();
    } catch (err) {
      alert(err.response?.data?.error || "Leave error");
    }
  };

  const deleteProject = async () => {
    if (!confirm("Delete project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (err) {
      alert(err.response?.data?.error || "Only creator can delete");
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post(`/projects/${id}/messages`, { text });
    setText("");
    loadMessages();
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-head">
          <h1>{project.title}</h1>
          <span className={isOwner ? "badge owner" : "badge"}>
            {isOwner ? "My Project" : "Other Project"}
          </span>
        </div>

        <p>{project.description}</p>
        <p><b>Stack:</b> {project.stack}</p>
        <p><b>Deadline:</b> {project.deadline}</p>

        <p>
          <b>Creator:</b>{" "}
          {project.creator?.id ? (
            <Link to={`/users/${project.creator.id}`}>
              {project.creator.name}
            </Link>
          ) : (
            "Unknown"
          )}
        </p>

        <div className="actions">
          {isOwner ? (
            <>
              <Link to={`/projects/${id}/edit`}>
                <button>Edit Project</button>
              </Link>
              <button className="danger" onClick={deleteProject}>
                Delete Project
              </button>
            </>
          ) : (
            <>
              <button onClick={joinProject}>Join Project</button>
              <button className="danger" onClick={leaveProject}>
                Leave Project
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Members</h2>

        {members.length === 0 && <p>No members yet</p>}

{members.map((item) => (
  <div className="mini-project" key={item.id}>
    <b>{item.user?.name || "User"}</b>

    <span>
      {item.status === "accepted"
        ? "🟢 Member"
        : "🟡 Pending"}
    </span>
  </div>
))}
        
      </div>

      <div className="card">
        <h2>Project Chat</h2>
        <p className="muted">
  Chat is available for project participants.
</p>

        <div className="chat-box">
          {messages.map((msg) => (
            <div className="message" key={msg.id}>
              <b>{msg.user?.name || "User"}:</b> {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-form">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="tags">
  {project.stack &&
    project.stack
      .split(/[,\s]+/)
      .filter(Boolean)
      .map((tag, i) => (
        <span className="tech-tag" key={i}>
          {tag}
        </span>
      ))}
</div>
      </div>
    </div>
  );
}

export default ProjectDetails;