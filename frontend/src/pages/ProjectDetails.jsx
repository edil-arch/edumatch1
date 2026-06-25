import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function ProjectDetails() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadProject = () => {
    api.get(`/projects/${id}`)
      .then(res => setData(res.data))
      .catch(console.error);
  };

  const loadMessages = () => {
    api.get(`/projects/${id}/messages`)
      .then(res => setMessages(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadProject();
    loadMessages();
  }, [id]);

  const joinProject = async () => {
    try {
      await api.post(`/projects/${id}/join`);
      alert("Application sent");
    } catch (err) {
      alert(err.response?.data?.error || "Join error");
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post(`/projects/${id}/messages`, { text });
    setText("");
    loadMessages();
  };

  const project = data.project || data;
  const members = data.members || [];

  return (
    <div className="container">
      <div className="card">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <p><b>Stack:</b> {project.stack}</p>
        <p><b>Deadline:</b> {project.deadline}</p>
        <p><b>Creator:</b> {project.creator?.name}</p>

        <button onClick={joinProject}>Join Project</button>
      </div>

      <div className="card">
        <h2>Members</h2>
        {members.length === 0 && <p>No members yet</p>}
        {members.map(item => (
          <p key={item.id}>{item.user?.name} — {item.status}</p>
        ))}
      </div>

      <div className="card">
        <h2>Project Chat</h2>

        <div className="chat-box">
          {messages.map(msg => (
            <div className="message" key={msg.id}>
              <b>{msg.user?.name || "User"}:</b> {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-form">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;