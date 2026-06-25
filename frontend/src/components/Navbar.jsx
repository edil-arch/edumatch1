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
      <h2>EduMatch</h2>

      <div className="nav-links">

        <Link to="/projects">Projects</Link>

        {token && (
          <>
            <Link to="/projects/create">Create</Link>

            <Link to="/my-projects">
              My Projects
            </Link>

            <Link to="/applications">
              Applications
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <button onClick={logout}>
              Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;