import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/dashboard">
        <strong>DevConnect</strong> 🔗
      </Link>
      <div className="ms-auto">
        <Link className="btn btn-outline-light" to="/login">
          Logout
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
