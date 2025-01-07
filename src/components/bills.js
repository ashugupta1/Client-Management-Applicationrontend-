import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import Icon from "react-crud-icons";

import "./react-crud-icons.css";

const BillSection = () => {
  const [bills, setBills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [editBillMode, setEditBillMode] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
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

  const generateUniqueBillNo = () =>
    `BILLNO-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const handleGenerateBillNo = () => {
    setFormBillData((prevData) => ({
      ...prevData,
      billNumber: generateUniqueBillNo(),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billsRes = await axios.get("http://localhost:3000/api/bills");
        setBills(billsRes.data || []);
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };
    fetchData();
  }, [bills]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await axios.get(
          "http://localhost:3000/api/projects"
        );
        setProjects(projectsRes.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleBillChange = (e) => {
    const { name, value } = e.target;
    setFormBillData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProjectSelect = (e) => {
    const selectedProjectId = e.target.value;
    setSelectedProject(selectedProjectId);

    const project = projects.find((p) => p._id === selectedProjectId);
    if (project) {
      console.log(project);

      setFormBillData({
        ...formBillData,
        projectName: project.projectName,
        description: project.description || "",
        quantity: project.quantity,
        rate: project.rate,
        billedTo: project.billedTo?.clientName || "",
        cgst: project.CGST,
        sgst: project.SGST,
        igst: project.IGST,
        tds: project.TDS,
      });
    }
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBillMode) {
        console.log(formBillData);

        await axios.put(
          `http://localhost:3000/api/bills/${selectedBill._id}`,
          formBillData
        );

        const updatedProject = {
          ...projects.find((p) => p._id === selectedProject),
          unbilledQuantity:
            projects.find((p) => p._id === selectedProject).unbilledQuantity -
            formBillData.billedQuantity,
        };

        if (updatedProject.unbilledQuantity < 0) {
          alert("Billed quantity cannot exceed the available quantity.");
          return;
        }

        await axios.put(
          `http://localhost:3000/api/projects/${selectedProject}`,
          {
            unbilledQuantity: updatedProject.unbilledQuantity,
          }
        );

        setBills((prevBills) =>
          prevBills.map((bill) =>
            bill._id === selectedBill._id ? { ...bill, ...formBillData } : bill
          )
        );
        alert("Bill updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/bills",
          formBillData
        );

        const updatedProject = {
          ...projects.find((p) => p._id === selectedProject),
          unbilledQuantity:
            projects.find((p) => p._id === selectedProject).unbilledQuantity -
            formBillData.billedQuantity,
        };

        if (updatedProject.unbilledQuantity < 0) {
          alert("Billed quantity cannot exceed the available quantity.");
          return;
        }

        await axios.put(
          `http://localhost:3000/api/projects/${selectedProject}`,
          {
            unbilledQuantity: updatedProject.unbilledQuantity,
          }
        );

        setBills((prev) => [...prev, response.data.bill]);
        alert("Bill created successfully!");
      }
      setShowBillModal(false);
      setFormBillData({
        date: "",
        billNumber: "",
        billedTo: "",
        description: "",
        quantity: "",
        rate: "",
        billedQuantity: "",
        cgst: "",
        sgst: "",
        igst: "",
        tds: "",
      });
    } catch (error) {
      console.error("Error submitting bill:", error);
      alert("Failed to create or update the bill.");
    }
  };

  const handleBillDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/bills/${id}`);
      setBills(bills.filter((bill) => bill._id !== id));
      alert("Bill deleted successfully!");
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("Failed to delete the bill.");
    }
  };

  const handleBillEdit = (bill) => {
    setSelectedBill(bill);
    setFormBillData({
      date: bill.date,
      billNumber: bill.billNumber,
      billedTo: bill.billedTo,
      projectName: bill.projectName,
      description: bill.description,
      quantity: bill.quantity,
      rate: bill.rate,
      billedQuantity: bill.billedQuantity,
      cgst: bill.cgst,
      sgst: bill.sgst,
      igst: bill.igst,
      tds: bill.tds,
    });
    setEditBillMode(true);
    setShowBillModal(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Bill Section</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowBillModal(true);
            handleGenerateBillNo();
            setEditBillMode(false);
          }}
        >
          Add Bill
        </button>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Bill List</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">S. No.</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Project Name</th>
                <th className="border px-4 py-2">Bill Number</th>
                <th className="border px-4 py-2">Billed Quantity</th>
                <th className="border px-4 py-2">Balance Before Tax</th>
                <th className="border px-4 py-2">TDS</th>
                <th className="border px-4 py-2">Total Tax</th>
                <th className="border px-4 py-2">Balance After Tax</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={bill._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{bill.date}</td>
                  <td className="border px-4 py-2">{bill.projectName}</td>
                  <td className="border px-4 py-2">{bill.billNumber}</td>
                  <td className="border px-4 py-2">{bill.billedQuantity}</td>
                  <td className="border px-4 py-2">{bill.balanceBeforeTax}</td>
                  <td className="border px-4 py-2">{bill.tds}</td>
                  <td className="border px-4 py-2">{bill.totalTax}</td>
                  <td className="border px-4 py-2">{bill.balanceAfterTax}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500"
                      onClick={() => handleBillEdit(bill)}
                    >
                      <Icon
                        name="edit"
                        tooltip="Edit"
                        theme="light"
                        size="medium"
                        // onClick={doSomething}
                      />
                    </button>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => handleBillDelete(bill._id)}
                    >
                      <Icon
                        name="delete"
                        tooltip="Delete"
                        theme="light"
                        size="medium"
                        // onClick={doSomething}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

                {/* Project Selection */}
                <div className="mb-4">
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium"
                  >
                    Project
                  </label>
                  {editBillMode === "Edit Bill"
                    ? (console.log("if true ", editBillMode),
                      (
                        // Render a text field when in edit mode
                        <div className="mb-4">
                          <label
                            htmlFor="billNumber"
                            className="block text-sm font-medium"
                          >
                            Bill Number
                          </label>
                          <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={formBillData.projectName}
                            readOnly
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                          />
                        </div>
                      ))
                    : // Render a dropdown when in create mode
                      (console.log("if false ", editBillMode),
                      (
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
                              {project.projectName}
                            </option>
                          ))}
                        </select>
                      ))}
                </div>

                {/* <div className="mb-4">
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium"
                  >
                    Project
                  </label>
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
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                </div> */}

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

export default BillSection;
