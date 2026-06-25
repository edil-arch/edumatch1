import { useEffect, useState } from "react";
import api from "../api/api";

function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/my-applications")
      .then(res => setApps(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h1>My Applications</h1>

      {apps.length === 0 && <p>No applications yet</p>}

      {apps.map(app => (
        <div className="card" key={app.id}>
          <h2>{app.project?.title}</h2>
          <p>{app.project?.description}</p>
          <h3>Status: {app.status}</h3>
        </div>
      ))}
    </div>
  );
}

export default Applications;