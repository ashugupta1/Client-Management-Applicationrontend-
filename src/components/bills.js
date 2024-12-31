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

  // Generate unique Bill Number
  const generateUniqueBillNo = () => {
    const randomValue = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `BILLNO-${randomValue}`;
  };

  // Generate Bill Number on modal open
  const handleGenerateBillNo = () => {
    const uniqueBillNo = generateUniqueBillNo();
    setFormData((prevData) => ({
      ...prevData,
      billNumber: uniqueBillNo,
    }));
  };

  useEffect(() => {
    // Fetch bills
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

    // Fetch projects
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/projects");
        setProjects(response.data || []);
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
      setFormData((prevData) => ({
        ...prevData,
        projectName: selected.projectName || "",
        description: selected.description || "",
        quantity: selected.quantity || "",
        rate: selected.rate || "",
        total: (selected.quantity || 0) * (selected.rate || 0),
        billedTo: selected.billedTo?.clientName || "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/bills",
        formData
      );
      alert("Bill created successfully!");
      setBills((prevBills) => [...prevBills, response.data.bill]);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert("Failed to create the bill. Please try again.");
    }
    setShowModal(false); // Close modal after submission
    setFormData({
      date: "",
      billNumber: "",
      billedTo: "",
      description: "",
      quantity: "",
      rate: "",
      total: "",
      billedQuantity: "",
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Bill Section</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowModal(true);
            handleGenerateBillNo(); // Generate Bill Number when opening the modal
          }}
        >
          Add Bill
        </button>

        {/* Table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Bill List</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">S. No.</th>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Project Name</th>
                <th className="border px-4 py-2 text-left">Bill Number</th>
                <th className="border px-4 py-2 text-left">Billed Quantity</th>
                <th className="border px-4 py-2 text-left">Billed Rate</th>
                <th className="border px-4 py-2 text-left">
                  Balance Before Tax
                </th>
                <th className="border px-4 py-2 text-left">TDS</th>
                <th className="border px-4 py-2 text-left">Total Tax</th>
                <th className="border px-4 py-2 text-left">
                  Balance After Tax
                </th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(bills) &&
                bills.map((bill, index) => (
                  <tr key={bill._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{bill.date}</td>
                    <td className="border px-4 py-2">{bill.projectName}</td>
                    <td className="border px-4 py-2">{bill.billNumber}</td>
                    <td className="border px-4 py-2">{bill.billedQuantity}</td>
                    <td className="border px-4 py-2">{bill.billedRate}</td>
                    <td className="border px-4 py-2">
                      {bill.balanceBeforeTax}
                    </td>
                    <td className="border px-4 py-2">{bill.tds}</td>
                    <td className="border px-4 py-2">{bill.totalTax}</td>
                    <td className="border px-4 py-2">{bill.balanceAfterTax}</td>
                    <td className="border px-4 py-2">
                      <button className="text-blue-500">Edit</button>
                      <button className="text-red-500 ml-2">Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding Bill */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Add Bill</h2>
              <form onSubmit={handleSubmit}>
                {/* Date */}
                <div className="mb-4 mt-4">
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
                {/* Project Selection */}
                <select
                  id="projectName"
                  name="projectName"
                  value={selectedProject}
                  onChange={handleProjectSelect}
                  className="w-full border border-gray-300 p-2 rounded mt-4"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}
                    </option>
                  ))}
                </select>

                {/* Bill Number */}
                <div className="mb-4 mt-4">
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
                    value={formData.billedTo}
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
                    value={formData.description}
                    onChange={handleChange}
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
      </div>
    </div>
  );
};

export default BillSection;
