import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    orderNumber: "",
    projectAddress: "",
    TDS: 0,
    CGST: 0,
    SGST: 0,
    IGST: 0,
    fileUpload: null,
    billedBy: "",
    billedTo: "",
    description: "",
    quantity: 0,
    rate: 0,
    price: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients");
        setClients(response.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      price: prev.quantity * prev.rate,
    }));
  }, [formData.quantity, formData.rate]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    if (name === "IGST") {
      setFormData((prev) => ({
        ...prev,
        IGST: Number(value),
        CGST: value > 0 ? 0 : prev.CGST,
        SGST: value > 0 ? 0 : prev.SGST,
      }));
    } else if (name === "CGST" || name === "SGST") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
        IGST: prev.CGST > 0 || prev.SGST > 0 ? 0 : prev.IGST,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      fileUpload: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      ...formData,
      serialNumber: projects.length + 1,
      orderNumber: `ORD-${projects.length + 1}`,
    };
    console.log(projectData);

    if (isEditing) {
      try {
        await axios.put(
          `http://localhost:3000/api/projects/${currentProjectId}`,
          projectData
        );
        setProjects((prev) =>
          prev.map((project) =>
            project._id === currentProjectId
              ? { ...project, ...projectData }
              : project
          )
        );
        fetchProjects();
        setIsEditing(false);
      } catch (err) {
        console.error("Error updating project:", err);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/projects",
          projectData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProjects((prev) => [...prev, response.data]);
        fetchProjects();
      } catch (err) {
        console.error("Error adding project:", err);
      }
    }

    setShowForm(false);
    setFormData({
      projectName: "",
      orderNumber: "",
      projectAddress: "",
      TDS: 0,
      CGST: 0,
      SGST: 0,
      IGST: 0,
      fileUpload: null,
      billedBy: "",
      billedTo: "",
      description: "",
      quantity: 0,
      rate: 0,
      price: 0,
    });
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (project) => {
    setIsEditing(true);
    setCurrentProjectId(project._id);
    setFormData({ ...project });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Title and Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">Projects</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search Projects Input */}
      <input
        type="text"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg w-full mb-6 focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mb-6"
      >
        {showForm ? "Close Form" : "Add Project"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white shadow-lg rounded-lg p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="projectName"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="projectAddress"
              placeholder="Project Address"
              value={formData.projectAddress}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="TDS"
              value={formData.TDS}
              onChange={handleDropdownChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Select TDS</option>
              <option value={1}>1%</option>
              <option value={2}>2%</option>
              <option value={5}>5%</option>
            </select>
            <select
              name="CGST"
              value={formData.CGST}
              onChange={handleDropdownChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select CGST</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
            </select>
            <select
              name="SGST"
              value={formData.SGST}
              onChange={handleDropdownChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select SGST</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
            </select>
            <select
              name="IGST"
              value={formData.IGST}
              onChange={handleDropdownChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select IGST</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
            </select>
            <select
              name="billedTo"
              value={formData.billedTo}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.clientName} - {client.GSTIN}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="billedBy"
              placeholder="Billed By"
              value={formData.billedBy}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full h-24 focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="rate"
              placeholder="Rate"
              value={formData.rate}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Total Price"
              value={formData.price}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            {isEditing ? "Update Project" : "Add Project"}
          </button>
        </form>
      )}

      {/* Display Projects in Table */}
      <div className="mt-8 overflow-x-auto">
      <table className="mt-8 w-full border border-gray-300 bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 border">Serial</th>
            <th className="p-4 border">Order Number</th>
            <th className="p-4 border">Project Name</th>
            <th className="p-4 border">Address</th>
            <th className="p-4 border">IGST</th>
            <th className="p-4 border">CGST</th>
            <th className="p-4 border">SGST</th>
            <th className="p-4 border">TDS</th>
            <th className="p-4 border">Billed By</th>
            <th className="p-4 border">Billed To</th>
            <th className="p-4 border">Description</th>
            <th className="p-4 border">File</th>
            <th className="p-4 border">Quantity</th>
            <th className="p-4 border">Rate</th>
            <th className="p-4 border">Total</th>
            <th className="p-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project, index) => (
            <tr key={project._id}>
              <td className="p-4 border">{index + 1}</td>
              <td className="p-4 border">{project.orderNumber}</td>
              <td className="p-4 border">{project.projectName}</td>
              <td className="p-4 border">{project.projectAddress}</td>
              <td className="p-4 border">{project.IGST}</td>
              <td className="p-4 border">{project.CGST}</td>
              <td className="p-4 border">{project.SGST}</td>
              <td className="p-4 border">{project.TDS}</td>
              <td className="p-4 border">{project.billedBy}</td>
              <td className="p-4 border">
                {project.billedTo
                  ? `${project.billedTo.clientName} (${project.billedTo.phone})`
                  : "Not Assigned"}
              </td>
              <td className="p-4 border">{project.description}</td>
              <td className="p-4 border">
                {project.fileUpload ? "File Uploaded" : "No File"}
              </td>
              <td className="p-4 border">{project.quantity}</td>
              <td className="p-4 border">{project.rate}</td>
              <td className="p-4 border">{project.price}</td>
              <td className="p-4 border text-center space-x-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AddProject;
