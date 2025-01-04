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
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  //bill data
  const [bills, setBills] = useState([]);
  // const [projects, setProjects] = useState([]);
  // const [showBillModal, setShowBillModal] = useState(false);
  // const [selectedProject, setSelectedProject] = useState("");
  const [editBillMode, setEditBillMode] = useState(false); // Track if we are editing
  const [selectedBill, setSelectedBill] = useState(null); // Store the bill to be edited
  const [formBillData, setFormBillData] = useState({
    date: "",
    billNumber: "",
    billedTo: "",
    projectName: "",
    description: "",
    quantity: "",
    rate: "",
    billedQuantity: "",
    cgst: "",
    sgst: "",
    igst: "",
    tds: "",
  });

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
    unbilledQuantity: 0,
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
      // price: formData.price,
      fileUpload: formData.fileUpload || null,
      unbilledQuantity: formData.quantity,
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
      unbilledQuantity: 0,
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
      setSelectedProjectId(null);

      setFormBillData({
        date: "",
        projectName: "",
        billNumber: "",
        billedTo: "",
        description: "",
        quantity: "",
        rate: "",
        billedQuantity: "",
        tds: "",
        cgst: "",
        sgst: "",
        igst: "",
      });
    } else {
      // Select the project and spread its data into form fields
      setSelectedProject(project);
      console.log("SET");

      setSelectedProjectId(project._id);
      setBillButtonEnabled(true);
      setFormBillData({
        date: project.date || "", // If the project has a date property
        projectName: project.projectName || "",
        billNumber: handleGenerateBillNo() || "", // You might need to generate this dynamically
        billedTo: project.billedTo.clientName || "",
        description: project.description || "",
        quantity: project.unbilledQuantity || "",
        rate: project.rate || "",
        billedQuantity: project.billedQuantity || "",
        tds: project.TDS || "",
        cgst: project.CGST || "",
        sgst: project.SGST || "",
        igst: project.IGST || "",
      });
    }
  };

  const generateUniqueBillNo = () =>
    `BILLNO-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const handleGenerateBillNo = () => {
    setFormBillData((prevData) => ({
      ...prevData,
      billNumber: generateUniqueBillNo(),
    }));
  };

  const handleBillChange = (e) => {
    const { name, value } = e.target;
    setFormBillData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBillSubmit = async (e) => {
    const billedQuantity = Number(formBillData.billedQuantity);
    console.log("Billed Quantity:", billedQuantity);
    console.log(" Unbilled Quantity:", formBillData.quantity);

    // console.log(project._id);

    e.preventDefault();
    try {
      // Create a new bill
      const response = await axios.post(
        "http://localhost:3000/api/bills",
        formBillData
      );

      // Add the new bill to the bills list
      setBills((prev) => [...prev, response.data.bill]);

      // Update the project with the new quantity
      const updatedQuantity = formBillData.quantity - billedQuantity;
      if (updatedQuantity < 0) {
        alert("Billed quantity cannot exceed the available quantity.");
        return;
      }

      if (selectedProjectId) {
        const projectUpdateResponse = await axios.put(
          `http://localhost:3000/api/projects/${selectedProjectId}`,
          { unbilledQuantity: updatedQuantity }
        );

        console.log("Updated Project:", projectUpdateResponse.data);
      }

      alert("Bill created and project updated successfully!");
      navigate("/bills");

      // Reset form data after successful submission
      setFormBillData({
        date: "",
        billNumber: "",
        billedTo: "",
        description: "",
        quantity: "",
        rate: "",
        billedQuantity: "",
      });

      // Close the modal
      setShowBillModal(false);
    } catch (error) {
      console.error("Error submitting bill or updating project:", error);
      alert("Failed to create the bill or update the project.");
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
            onClick={() => {
              if (isBillButtonEnabled) {
                openBillModal(); // Call openBillModal first
                handleGenerateBillNo(); // Then call handleGenerateBillNo
              }
            }}
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
                <td className="border p-2">{project.unbilledQuantity}</td>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">
                {editBillMode ? "Edit Bill" : "Add Bill"}
              </h2>
              <form onSubmit={handleBillSubmit}>
                {/* Date */}
                <div className="mb-4 mt-4">
                  <label htmlFor="date" className="block text-sm font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formBillData.date}
                    onChange={handleBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Project Name Display */}

                <div className="mb-4">
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium"
                  >
                    Project
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={formBillData.projectName || ""}
                    readOnly
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>

                {/* Bill Number */}
                <div className="mb-4">
                  <label
                    htmlFor="billNumber"
                    className="block text-sm font-medium"
                  >
                    Bill Number
                  </label>
                  <input
                    type="text"
                    id="billNumber"
                    name="billNumber"
                    value={formBillData.billNumber}
                    readOnly
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Billed To */}
                <div className="mb-4">
                  <label
                    htmlFor="billedTo"
                    className="block text-sm font-medium"
                  >
                    Billed To
                  </label>
                  <input
                    type="text"
                    id="billedTo"
                    name="billedTo"
                    value={formBillData.billedTo}
                    readOnly
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formBillData.description}
                    onChange={handleBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formBillData.quantity}
                    onChange={handleBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Rate */}
                <div className="mb-4">
                  <label htmlFor="rate" className="block text-sm font-medium">
                    Rate
                  </label>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    value={formBillData.rate}
                    onChange={handleBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Billed Quantity */}
                <div className="mb-4">
                  <label
                    htmlFor="billedQuantity"
                    className="block text-sm font-medium"
                  >
                    Billed Quantity
                  </label>
                  <input
                    type="number"
                    id="billedQuantity"
                    name="billedQuantity"
                    value={formBillData.billedQuantity}
                    onChange={(e) =>
                      setFormBillData({
                        ...formBillData,
                        billedQuantity: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded mr-2"
                    onClick={() => setShowBillModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {editBillMode ? "Update Bill" : "Add Bill"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProject;
