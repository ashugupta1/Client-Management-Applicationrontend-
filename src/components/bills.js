import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

const BillSection = () => {
  const [bills, setBills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    billNumber: "",
    billedTo: "",
    projectName: "",
    description: "",
    quantity: "",
    rate: "",
    total: "",
    billedQuantity: "",
  });

  // Fetch bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/bills");
        setBills(res.data.bills || res.data || []);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setBills([]);
      }
    };
    fetchBills();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/projects");
        setProjects(response.data); // Set the state with fetched data
        console.log("Fetched Projects:", response.data); // Log the fetched data
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  // Handle change in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle project selection
  const handleProjectSelect = (e) => {
    const selectedProjectId = e.target.value;
    setSelectedProject(selectedProjectId);

    // Find the selected project from the list and pre-fill the form
    const selected = projects.find(
      (project) => project._id === selectedProjectId
    );

    if (selected) {
      console.log("Selected Project Data:", selected); // Log the whole selected object
      setFormData((prevData) => ({
        ...prevData,
        projectName: selected.projectName, // Ensure this matches the field name in your data
        description: selected.description || "",
        quantity: selected.quantity || "",
        rate: selected.rate || "",
        total: selected.quantity * selected.rate || "", // Assuming total is quantity * rate
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add bill logic here
    console.log(formData);
    setShowModal(false); // Close modal after submission
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Bill Section</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Bill
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Add Bill</h2>
              <form onSubmit={handleSubmit}>
                {/* Date */}
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
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
                    value={formData.billNumber}
                    onChange={handleChange}
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
                    value={formData.billedTo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Project Name */}
                <select
                  id="projectName"
                  name="projectName"
                  value={selectedProject}
                  onChange={handleProjectSelect}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}{" "}
                      {/* Ensure this field matches the field name in your project */}
                    </option>
                  ))}
                </select>

                {/* Other fields */}
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
                    value={formData.description}
                    onChange={handleChange}
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
                    value={formData.quantity}
                    onChange={handleChange}
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
                    value={formData.rate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Total */}
                <div className="mb-4">
                  <label htmlFor="total" className="block text-sm font-medium">
                    Total
                  </label>
                  <input
                    type="number"
                    id="total"
                    name="total"
                    value={formData.total}
                    onChange={handleChange}
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
                    value={formData.billedQuantity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Date</th>
              <th>Project Name</th>
              <th>Bill Number</th>
              <th>Billed Quantity</th>
              <th>Billed Rate</th>
              <th>Balance Before Tax</th>
              <th>TDS</th>
              <th>Total Tax</th>
              <th>Balance After Tax</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bills) &&
              bills.map((bill, index) => (
                <tr key={bill._id}>
                  <td>{index + 1}</td>
                  <td>{bill.date}</td>
                  <td>{bill.projectName}</td>
                  <td>{bill.billNumber}</td>
                  <td>{bill.billedQuantity}</td>
                  <td>{bill.billedRate}</td>
                  <td>{bill.balanceBeforeTax}</td>
                  <td>{bill.tds}</td>
                  <td>{bill.totalTax}</td>
                  <td>{bill.balanceAfterTax}</td>
                  <td>
                    <button className="text-blue-500">Edit</button>
                    <button className="text-red-500 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillSection;
