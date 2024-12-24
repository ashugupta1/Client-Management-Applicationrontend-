import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from ".//sidebar";

const ProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    billNumber: "",
    quantity: "",
    rate: "",
    total: "",
  });
  const [loading, setLoading] = useState(false);
  const [billId, setBillId] = useState();

  
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/bills");
        setBillId(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };
     fetchBills(); // Call the async function
  }, []);

   const handleProjectId = () => {
    
   } 

  // Fetch the list of projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle project selection and populate fields
  const handleProjectSelect = (event) => {
    const projectId = event.target.value;
    const project = projects.find((proj) => proj._id === projectId);
    if (project) {
      setSelectedProject(project);
      setFormData({
        projectName: project.projectName || "",
        description: project.description || "",
        billNumber: project.billNumber || "",
        quantity: project.quantity || "",
        rate: project.rate || "",
        total: project.total || "",
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Automatically calculate total when quantity or rate changes
  useEffect(() => {
    const total =
      parseFloat(formData.quantity) * parseFloat(formData.rate) || 0;
    setFormData((prevData) => ({ ...prevData, total }));
  }, [formData.quantity, formData.rate]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/projects",
        formData
      );
      console.log("Project submitted successfully:", response.data);
      alert("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 bg-gray-100 rounded-lg flex-1">
        <h2 className="text-xl font-bold mb-4">Project Form</h2>
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Project
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                onChange={handleProjectSelect}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bill Number
                </label>
                <input
                  type="text"
                  name="billNumber"
                  value={formData.billNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Rate
                </label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Total
                </label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
