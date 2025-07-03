import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const bgImageUrl =
    "https://images.pexels.com/photos/32829494/pexels-photo-32829494.jpeg";

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    status: "",
    deadline: "",
  });
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      if (editId) {
        await API.put(`/projects/${editId}`, data);
        setEditId(null);
      } else {
        await API.post("/projects", data);
      }
      setForm({
        title: "",
        description: "",
        tags: "",
        status: "",
        deadline: "",
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      tags: p.tags.join(", "),
      status: p.status || "",
      deadline: p.deadline ? p.deadline.slice(0, 10) : "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus ? p.status === filterStatus : true;
    const matchesDeadline = filterDeadline
      ? p.deadline?.slice(0, 10) === filterDeadline
      : true;
    return matchesStatus && matchesDeadline;
  });

  return (
    <div
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: 24,
        color: "white", // Optional for contrast
        backdropFilter: "brightness(0.7)", // Optional for readability
      }}
    >
      <Navbar />
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>📋 DevConnect Dashboard</h2>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="row g-3 mt-3">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Tags (comma-separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Status (e.g. In Progress)"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>
          <div className="col-12">
            <textarea
              className="form-control"
              placeholder="Description"
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button className="btn btn-primary w-100">
              {editId ? "Update Project" : "Add Project"}
            </button>
          </div>
        </form>

        <div className="row mt-5 mb-3">
          <div className="col-md-6">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={filterDeadline}
              onChange={(e) => setFilterDeadline(e.target.value)}
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="row">
            {filteredProjects.map((p) => (
              <div className="col-md-6 mb-4" key={p._id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{p.title}</h5>
                    <p className="card-text">{p.description}</p>
                    <p className="card-text">
                      <strong>Status:</strong> {p.status || "N/A"}
                      <br />
                      <strong>Deadline:</strong>{" "}
                      {p.deadline ? p.deadline.slice(0, 10) : "Not set"}
                      <br />
                      <strong>Tags:</strong>{" "}
                      {p.tags?.map((tag, idx) => (
                        <span key={idx} className="badge bg-secondary me-1">
                          {tag}
                        </span>
                      ))}
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
