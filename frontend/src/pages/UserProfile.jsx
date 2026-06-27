import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    api.get(`/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [id]);

  return (
    <div className="profile-page">
      <div className="card profile-card">
        <h1>{user.name}</h1>
        <p><b>Email:</b> {user.email}</p>
        <p><b>University:</b> {user.university}</p>
        <p><b>Course:</b> {user.course}</p>
        <p><b>Skills:</b> {user.skills}</p>
        <p><b>About:</b> {user.about}</p>
      </div>
    </div>
  );
}

export default UserProfile;