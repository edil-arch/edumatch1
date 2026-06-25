import { useEffect, useState } from "react";
import api from "../api/api";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    university: "",
    course: "",
    skills: "",
    about: "",
    avatar: ""
  });

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(console.error);
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const res = await api.put("/profile", user);
    setUser(res.data);
    alert("Profile saved");
  };

  return (
    <div className="container">
      <form className="card profile-card" onSubmit={save}>
        <h1>My Profile</h1>

        <input value={user.name || ""} placeholder="Name" onChange={e => setUser({ ...user, name: e.target.value })} />
        <input value={user.university || ""} placeholder="University" onChange={e => setUser({ ...user, university: e.target.value })} />
        <input value={user.course || ""} placeholder="Course" onChange={e => setUser({ ...user, course: Number(e.target.value) })} />
        <input value={user.skills || ""} placeholder="Skills: React, Go, PostgreSQL" onChange={e => setUser({ ...user, skills: e.target.value })} />
        <textarea value={user.about || ""} placeholder="About me" onChange={e => setUser({ ...user, about: e.target.value })} />

        <button>Save Profile</button>
      </form>
    </div>
  );
}

export default Profile;