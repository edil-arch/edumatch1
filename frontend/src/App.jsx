import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Projects from "./pages/Projects.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import CreateProject from "./pages/CreateProject.jsx";

import Profile from "./pages/Profile.jsx";
import MyProjects from "./pages/MyProjects.jsx";
import Applications from "./pages/Applications.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/projects" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/create" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/applications" element={<Applications />} />
      </Routes>
    </>
  );
}

export default App;