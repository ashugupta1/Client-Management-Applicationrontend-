import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

const AddProject = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBillButtonEnabled, setBillButtonEnabled] = useState(false);

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
    // price: 0,
    total: 0,
  });
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
      total: prev.quantity * prev.rate,
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

    const dataToSubmit = {
      projectName: formData.projectName,
      projectAddress: formData.projectAddress,
      TDS: formData.TDS,
      CGST: formData.CGST,
      SGST: formData.SGST,
      IGST: formData.IGST,
      billedBy: formData.billedBy,
      billedTo: formData.billedTo,
      description: formData.description,
      quantity: formData.quantity,
      rate: formData.rate,
<<<<<<< HEAD
      // price: formData.price,
      fileUpload: formData.fileUpload || null,
=======
      price: formData.price,
      fileUpload: formData.fileUpload || null, // Include fileUpload field, set to null if no file
>>>>>>> 369b485f29d2c2e95baf317b897bd956a5b1d737
    };

    console.log("Data to Submit:", dataToSubmit);

    try {
      if (isEditing) {
        console.log("Updating project...");
        const res = await axios.put(
          `http://localhost:3000/api/projects/${currentProjectId}`,
          dataToSubmit,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Updated Project:", res.data);
        fetchProjects();

        setProjects((prev) =>
          prev.map((project) =>
            project._id === currentProjectId
              ? { ...project, ...dataToSubmit }
              : project
          )
        );
      } else {
        console.log("Adding new project...");
        const response = await axios.post(
          "http://localhost:3000/api/projects",
          dataToSubmit,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fetchProjects();
        console.log("Project added:", response.data);
        setProjects((prev) => [...prev, response.data]);
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
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
      // price: 0,
      total: 0,
    });
  };

  const openBillModal = (project) => {
    setSelectedProject(project);
    setShowBillModal(true);
  };

  const closeBillModal = () => {
    setSelectedProject(null);
    setShowBillModal(false);
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setCurrentProjectId(project._id);
    console.log(project._id);

    setFormData({ ...project }); // This will update the form data with the selected project's details
    setShowForm(true);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName &&
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleProjectCheckbox = (project) => {
    if (selectedProject && selectedProject._id === project._id) {
      // Deselect if already selected
      setSelectedProject(null);
      setBillButtonEnabled(false);
    } else {
      // Select the project
      console.log(project);

      setSelectedProject(project);
      setBillButtonEnabled(true);
    }
  };
  const handleBillSubmit = async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.target);
    const billData = Object.fromEntries(formData.entries());

    // Add the project ID to the bill data
    billData.projectId = selectedProject?._id;

    try {
      // Send POST request to the API
      const response = await axios.post(
        "http://localhost:3000/api/bills",
        billData
      );

      if (response.status === 201) {
        // Show success message
        console.log("Bill added successfully:", response.data);
        alert("Bill added successfully!");

        // Close modal and reset form if needed
        closeBillModal();
      } else {
        // Handle unexpected responses
        console.error("Unexpected response:", response);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      // Handle errors during the API call
      console.error("Error adding bill:", error);
      alert("Failed to add bill. Please check your inputs and try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold">Projects</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full mb-6 focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Add Project
          </button>
          <button
            onClick={openBillModal}
            className={`px-6 py-3 rounded-lg shadow-md ${
              isBillButtonEnabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!isBillButtonEnabled}
          >
            Add Bill
          </button>
        </div>

<<<<<<< HEAD
        {showForm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
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
                  {/* <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  /> */}
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
                  {/* <input
                    type="number"
                    name="price"
                    placeholder="Total Price"
                    value={formData.price}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    disabled
                  /> */}
                </div>
=======
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
>>>>>>> 369b485f29d2c2e95baf317b897bd956a5b1d737

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  {isEditing ? "Update Project" : "Add Project"}
                </button>
              </form>
              <button
                onClick={() => setShowForm(false)}
                className="mt-4 py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-4 border">Checkbox</th>
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
              <th className="p-4 border">Unbilled Quantity</th>
              <th className="p-4 border">Rate</th>
              <th className="p-4 border">Total</th>
              <th className="p-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr key={project._id}>
                <td className="border p-2">
                  <input
                    type="checkbox"
                    onChange={() => handleProjectCheckbox(project)}
                    checked={selectedProject?._id === project._id}
                  />
                </td>

                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{project.orderNumber}</td>
                <td className="border p-2">{project.projectName}</td>
                <td className="border p-2">{project.projectAddress}</td>
                <td className="border p-2">{project.IGST}</td>
                <td className="border p-2">{project.CGST}</td>
                <td className="border p-2">{project.SGST}</td>
                <td className="border p-2">{project.TDS}</td>
                <td className="border p-2">{project.billedBy}</td>
                <td className="border p-2">
                  {project.billedTo
                    ? `${project.billedTo.clientName} (${project.billedTo.phone})`
                    : "Not Assigned"}
                </td>
                <td className="border p-2">{project.description}</td>
                <td className="border p-2">
                  {project.fileUpload ? "File Uploaded" : "No File"}
                </td>
                <td className="border p-2">{project.quantity}</td>
                <td className="border p-2">{project.quantity}</td>
                <td className="border p-2">{project.rate}</td>
                <td className="border p-2">
                  {project.rate * project.quantity}
                </td>
                <td className="border p-2 text-center space-x-4">
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

        {showBillModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Add Bill for {selectedProject?.projectName}
              </h2>
              <form onSubmit={handleBillSubmit}>
                {/* Project Name */}
                <div className="mb-4">
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium mb-1"
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={selectedProject?.projectName || ""}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    disabled
                  />
                </div>

                {/* Order Number */}
                <div className="mb-4">
                  <label
                    htmlFor="orderNumber"
                    className="block text-sm font-medium mb-1"
                  >
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={selectedProject?.orderNumber || ""}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    disabled
                  />
                </div>

                {/* Billed By */}
                <div className="mb-4">
                  <label
                    htmlFor="billedBy"
                    className="block text-sm font-medium mb-1"
                  >
                    Billed By
                  </label>
                  <input
                    type="text"
                    id="billedBy"
                    name="billedBy"
                    placeholder="Enter Biller Name"
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    required
                  />
                </div>

                {/* Billed To */}
                <div className="mb-4">
                  <label
                    htmlFor="billedTo"
                    className="block text-sm font-medium mb-1"
                  >
                    Billed To
                  </label>
                  <input
                    type="text"
                    id="billedTo"
                    name="billedTo"
                    placeholder="Enter Receiver Name"
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter Bill Description"
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    rows="3"
                  />
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium mb-1"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Enter Amount"
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mt-4"
                >
                  Submit Bill
                </button>
              </form>

              {/* Close Button */}
              <button
                onClick={closeBillModal}
                className="mt-4 py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProject;
