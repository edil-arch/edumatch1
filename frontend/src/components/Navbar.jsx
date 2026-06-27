import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to={token ? "/dashboard" : "/projects"} className="brand">
        <span className="brand-icon">E</span>
        <span>EduMatch</span>
      </Link>

      <div className="nav-links">
        {token && <Link to="/dashboard">Dashboard</Link>}

        <Link to="/projects">Projects</Link>

        {token ? (
          <>
            <Link to="/projects/create">Create</Link>
            <Link to="/my-projects">My Projects</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;