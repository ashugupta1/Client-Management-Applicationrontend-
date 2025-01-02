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
    // total: "",
    billedQuantity: "",
    cgst: "",
    sgst: "",
    igst: "",
    tds: "",
  });

  const generateUniqueBillNo = () =>
    `BILLNO-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const handleGenerateBillNo = () => {
    setFormData((prevData) => ({
      ...prevData,
      billNumber: generateUniqueBillNo(),
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const billsRes = await axios.get("http://localhost:3000/api/bills");
        // console.log("Fetched Bills:", billsRes.data);
        setBills(billsRes.data || []); // Ensure the response structure matches
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await axios.get(
          "http://localhost:3000/api/projects"
        );
        console.log("Fetched Projects:", projectsRes.data);
        setProjects(projectsRes.data || []); // Ensure the correct structure
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  //   const fetchData = async () => {
  //     try {
  //       const [billsRes, projectsRes] = await Promise.all([
  //         axios.get("http://localhost:3000/api/bills"),
  //         axios.get("http://localhost:3000/api/projects"),
  //       ]);
  //       setBills(billsRes.data.bills || []);
  //       setProjects(projectsRes.data || []);
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProjectSelect = (e) => {
    const selectedProjectId = e.target.value;
    setSelectedProject(selectedProjectId);

    const project = projects.find((p) => p._id === selectedProjectId);
    if (project) {
      console.log(project);

      // const tdsRate = project / 100;

      // const balanceBeforeTax = project.quantity * project.rate;
      // const tdsInRupees = (balanceBeforeTax * tdsRate) / 100;
      // const totalTax =
      //   (totalAmount * cgst) / 100 +
      //   (totalAmount * sgst) / 100 +
      //   (totalAmount * igst) / 100;
      // const balanceAfterTax = balanceBeforeTax + totalTax;

      setFormData({
        ...formData,
        projectName: project.projectName,
        description: project.description || "",
        quantity: project.quantity,
        rate: project.rate,
        // total: balanceBeforeTax,
        billedTo: project.billedTo?.clientName || "",
        billedQuantity: "",
        cgst: project.CGST,
        sgst: project.SGST,
        igst: project.IGST,
        tds: project.TDS,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/bills",
        formData
      );

      const updatedProject = {
        ...projects.find((p) => p._id === selectedProject),
        quantity:
          projects.find((p) => p._id === selectedProject).quantity -
          formData.billedQuantity,
      };

      await axios.put(`http://localhost:3000/api/projects/${selectedProject}`, {
        quantity: updatedProject.quantity,
      });

      setProjects((prev) =>
        prev.map((p) => (p._id === selectedProject ? updatedProject : p))
      );
      setBills((prev) => [...prev, response.data.bill]);

      alert("Bill created successfully!");
      setShowModal(false);
      setFormData({
        date: "",
        billNumber: "",
        billedTo: "",
        description: "",
        quantity: "",
        rate: "",
        // total: "",
        billedQuantity: "",
      });
    } catch (error) {
      console.error("Error submitting bill:", error);
      alert("Failed to create the bill.");
    }
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
            handleGenerateBillNo();
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
                    <button className="text-blue-500">Edit</button>
                    <button className="text-red-500 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                {/* <div className="mb-4">
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
                </div> */}

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
