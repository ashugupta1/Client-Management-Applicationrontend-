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
  const [billStatus, setBillStatus] = useState(false);
  const [unbilledQuantity, setUnbilledQuantity] = useState(0);
  const [mileStone, setMileStones] = useState([]);
  const [viewmileStone, setViewMileStones] = useState(false);
  // const [selectedTax, setSelectedTax] = useState(null);
  const [formBillData, setFormBillData] = useState({
    date: "",
    billNumber: "",
    orderNumber: "",
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
    unbilledQuantity: "",
  });

  //clear bill

  const [showBillStatus, setshowBillStatus] = useState(false);
  const [mapClearBills, setMapClearBills] = useState([]);
  const [viewClearBill, setViewClearBill] = useState(false);
  const [getClearBill, setGetClearBill] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [clearBillModal, setClearBillModal] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [renderMileStone, setRenderMileStone] = useState([]);
  const [clearBillForm, setClearBillForm] = useState({
    date: "",
    orderNumber: "",
    SelectTax: "",
    PandingAmount: "",
    PaidAmount: "",
    PaymentMode: "",
    ReferenceNumber: "",
    UploadFile: "",
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

        // Ensure data exists and is structured properly
        const billsData = billsRes.data.bills || [];
        const mileStonesData = billsRes.data.mileStones || [];

        // Update states with the fetched data
        setBills(billsData);
        setMileStones(mileStonesData);

        // Log the first milestone entry (if available)
        if (mileStonesData.length > 0) {
          console.log("First milestone:", mileStonesData[0]);
        }
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
    console.log(`Field Changed: ${name}, New Value: ${value}`);
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
        unbilledQuantity: project.unbilledQuantity || "",
        orderNumber: project.orderNumber,
      });
    }
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    console.log(formBillData);

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

        setUnbilledQuantity(updatedProject.unbilledQuantity);
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
        projectName: "",
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
        orderNumber: "",
      });
    } catch (error) {
      console.error("Error submitting bill:", error);
      alert("Failed to create or update the bill.");
    }
  };

  const handleViewMilestones = (orderNumber) => {
    console.log("Looking for milestones with order number:", orderNumber);
    console.log(mileStone);

    // Check if mileStone is defined and is an array
    if (Array.isArray(mileStone)) {
      const mileStoneData = mileStone.filter(
        (milestone) => milestone.orderNumber === orderNumber
      );

      setRenderMileStone(mileStoneData);

      if (mileStoneData.length > 0) {
        console.log("Found milestones:", mileStoneData);
        // Do something with mileStoneData, e.g., update state or trigger UI
      } else {
        console.log("No milestones found for this order number.");
      }
    } else {
      console.error("mileStone data is not an array or is undefined.");
    }
  };

  const closeModal = () => setViewMileStones(false);

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
      // orderNumber: bill.orderNumber
    });
    setEditBillMode(true);
    setShowBillModal(true);
  };

  //working with clear bill that sgst cgst and bbt

  useEffect(() => {
    const fetchClearBills = async () => {
      try {
        const clearbills = await axios.get(
          "http://localhost:3000/api/clearbill"
        );
        setGetClearBill(clearbills.data || []);
        // console.log(clearbills.data);
      } catch (err) {
        console.error("Error fetching clear bills:", err);
      }
    };
    fetchClearBills();
  }, []);

  const handleViewBill = (billNumber) => {
    // console.log(billNumber); // Logs the billNumber passed to the function

    // Find the specific bill by billNumber
    const selectedBill = getClearBill.filter(
      (bill) => bill.BillNumber === billNumber
    );

    // console.log(selectedBill);
    setMapClearBills(selectedBill);

    if (selectedBill) {
      setSelectedBillId(selectedBill.billNumber); // Set the selected bill ID
      setSelectedBill(selectedBill); // Set the selected bill's details
      setViewClearBill(true); // Show the modal
    } else {
      console.error("Bill not found!");
    }
  };

  const selectedMileStone = (orderNumber) => {
    const mileStone = mileStone.filter
  };

  //handle clear bill
  const handleClearBillChange = (e) => {
    const { name, value } = e.target;

    setClearBillForm((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
        orderNumber: selectedTax.orderNumber,
      };

      // Only update PandingAmount when SelectTax changes
      if (name === "SelectTax") {
        let taxAmount = 0;

        if (value === "CGST") {
          taxAmount = selectedTax?.cgst || 0;
        } else if (value === "SGST") {
          taxAmount = selectedTax?.sgst || 0;
        } else if (value === "IGST") {
          taxAmount = selectedTax?.igst || 0;
        } else if (value === "TDS") {
          taxAmount = selectedTax?.tds || 0;
        } else if (value === "balanceBeforeTax") {
          taxAmount = selectedTax?.balanceBeforeTax || 0;
        }
        updatedData.PandingAmount = taxAmount; // Update PandingAmount only for SelectTax
      }

      return updatedData;
    });

    console.log(`Field Changed: ${name}, New Value: ${value}`);
  };

  const handleClearBill = (id) => {
    console.log("Selected Bill ID:", id);

    // Assuming `id` contains the tax-related data (cgst, sgst, etc.)
    setSelectedTax(id);
  };

  const handleClearBillSubmit = (e) => {
    e.preventDefault();
    console.log(clearBillForm);

    try {
      axios.post("http://localhost:3000/api/clearbill", clearBillForm);
      alert("clear bill successfully added");
    } catch (err) {
      alert("getting error in sending clear bill form", err);
    }
    setClearBillModal(false);
    setClearBillForm({
      date: "",
      orderNumber: "",
      SelectTax: "",
      PandingAmount: "",
      PaidAmount: "",
      PaymentMode: "",
      ReferenceNumber: "",
      UploadFile: "",
    });
  };

  //delete bill modal
  const deleteClearBill = (bill) => {};

  //edit bill modal
  const editBillClearBill = (bill) => {};

  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100 w-5/6  h-screen">
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
        <div className="mt-6 ">
          <h3 className="text-lg font-semibold mb-4">Bill List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-max bg-white border border-gray-300 table-auto">
              <thead>
                <tr>
                  <th className="border px-4 py-2">S. No.</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Project Name</th>
                  <th className="border px-4 py-2">Order number</th>
                  <th className="border px-4 py-2">Billed Quantity</th>
                  <th className="border px-4 py-2">Balance Before Tax</th>
                  <th className="border px-4 py-2">TDS</th>
                  <th className="border px-4 py-2">Total Tax</th>
                  <th className="border px-4 py-2">Balance After Tax</th>
                  <th className="border px-4 py-2">Mile Stone</th>
                  <th className="border px-4 py-2">Bill Status</th>
                  <th className="border px-4 py-2">Clear Bill</th>
                  <th className="border px-4 py-2">View Bill</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr key={bill._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{bill.date}</td>
                    <td className="border px-4 py-2">{bill.projectName}</td>
                    <td className="border px-4 py-2">{bill.orderNumber}</td>
                    <td className="border px-4 py-2">{bill.billedQuantity}</td>
                    <td className="border px-4 py-2">
                      {bill.balanceBeforeTax}
                    </td>
                    <td className="border px-4 py-2">{bill.tds}</td>
                    <td className="border px-4 py-2">{bill.totalTax}</td>
                    <td className="border px-4 py-2">{bill.balanceAfterTax}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => {
                          setViewMileStones(true);
                          handleViewMilestones(bill.orderNumber);
                        }}
                        type="button"
                        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Mile Stone
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <button class="bg-yellow-500 text-white font-bold py-2 px-4 rounded">
                        Bill Status
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => {
                          setClearBillModal(true); // Opens the modal
                          handleClearBill(bill);
                          selectedMileStone(bill.orderNumber); // Calls your function with the provided id
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Clear Bill
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => {
                          handleViewBill(bill.billNumber); // Pass the billNumber to handleViewBill
                          setViewClearBill(true); // Set viewClearBill to true to show the modal
                        }}
                      >
                        <Icon
                          name="show"
                          tooltip="Show"
                          theme="light"
                          size="medium"
                        />
                      </button>
                    </td>

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
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showBillModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3 max-h-[80vh] overflow-y-auto">
              {" "}
              {/* Added scroll */}
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
                  {editBillMode === "Edit Bill" ? (
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
                  ) : (
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
                  )}
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
                    Unbilled Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formBillData.unbilledQuantity}
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

        {/* clear bill modal */}
        {clearBillModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setClearBillModal(false)} // Close modal when clicking outside
          >
            <div
              className="bg-white p-6 rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <form onSubmit={handleClearBillSubmit}>
                <div className="mb-4 mt-4">
                  <label htmlFor="date" className="block text-sm font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={clearBillForm.date}
                    onChange={handleClearBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>
                

                <div className="mb-4 mt-4">
                  <label
                    htmlFor="selectTax"
                    className="block text-sm font-medium"
                  >
                    Select Tax
                  </label>
                  <select
                    id="selectTax"
                    name="SelectTax"
                    value={clearBillForm.SelectTax} // Bind the selected tax value to the state
                    onChange={handleClearBillChange} // Handle change for updates
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  >
                    <option value="">Select a tax</option>
                    <option value="CGST">CGST</option>
                    <option value="SGST">SGST</option>
                    <option value="IGST">IGST</option>
                    <option value="TDS">TDS</option>
                    <option value="balanceBeforeTax">BBT</option>
                  </select>
                </div>

                <div className="mb-4 mt-4">
                  <label
                    htmlFor="PandingAmount"
                    className="block text-sm font-medium"
                  >
                    Panding Amount
                  </label>
                  <input
                    type="number"
                    id="PandingAmount"
                    name="PandingAmount"
                    value={clearBillForm.PandingAmount}
                    onChange={handleClearBillChange} // Handle change for PandingAmount
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>
                <div className="mb-4 mt-4">
                  <label
                    htmlFor="PaidAmount"
                    className="block text-sm font-medium"
                  >
                    Paid Amount
                  </label>
                  <input
                    type="Number"
                    id="PaidAmount"
                    name="PaidAmount"
                    value={clearBillForm.PaidAmount}
                    onChange={handleClearBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>
                {/* <div className="mb-4 mt-4">
                  <label
                    htmlFor="PaymentMode"
                    className="block text-sm font-medium"
                  >
                    Payment Mode
                  </label>
                  <input
                    type="text"
                    id="PaymentMode"
                    name="PaymentMode"
                    value={clearBillForm.PaymentMode}
                    onChange={handleClearBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div> */}

                <div className="mb-4 mt-4">
                  <select
                    id="PaymentMode" // Add an ID for accessibility and state reference
                    name="PaymentMode" // Ensure the name matches the state field
                    onChange={handleClearBillChange} // Handle state update on change
                    value={clearBillForm.PaymentMode} // Bind the selected value to the state
                    className="w-full border border-gray-300 p-2 rounded" // Add styling for consistency
                  >
                    <option value="">Select Payment Options</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="NEFT">NEFT</option>
                    <option value="BANK">Bank</option>
                  </select>
                </div>

                <div className="mb-4 mt-4">
                  <label
                    htmlFor="ReferenceNumber"
                    className="block text-sm font-medium"
                  >
                    Reference Number
                  </label>
                  <input
                    type="text"
                    id="ReferenceNumber"
                    name="ReferenceNumber"
                    value={clearBillForm.ReferenceNumber}
                    onChange={handleClearBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>
                <div className="mb-4 mt-4">
                  <label
                    htmlFor="UploadFile"
                    className="block text-sm font-medium"
                  >
                    File Upload
                  </label>
                  <input
                    type="file"
                    id="UploadFile"
                    name="UploadFile"
                    value={clearBillForm.UploadFile}
                    onChange={handleClearBillChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setClearBillModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* view bill section  */}
        {viewClearBill && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Bill List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-max bg-white border border-gray-300 table-auto">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">S. No.</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Select Tax</th>
                    <th className="border px-4 py-2">Pending Amount</th>
                    <th className="border px-4 py-2">Paid Amount</th>
                    <th className="border px-4 py-2">Payment Mode</th>
                    <th className="border px-4 py-2">Reference Number</th>
                    <th className="border px-4 py-2">Uploaded File</th>
                    <th className="border px-4 py-2">Bill Number</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Filter the bill based on selectedBillId (which holds the billNumber) */}
                  {mapClearBills.map((clearbill, index) => (
                    <tr key={clearbill.billId}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{clearbill.date}</td>
                      <td className="border px-4 py-2">
                        {clearbill.SelectTax}
                      </td>
                      <td className="border px-4 py-2">
                        {clearbill.PandingAmount}
                      </td>
                      <td className="border px-4 py-2">
                        {clearbill.PaidAmount}
                      </td>
                      <td className="border px-4 py-2">
                        {clearbill.PaymentMode}
                      </td>
                      <td className="border px-4 py-2">
                        {clearbill.ReferenceNumber}
                      </td>
                      <td className="border px-4 py-2">
                        {clearbill.UploadFile}
                      </td>
                      <td className="border px-4 py-2">
                        {clearbill.BillNumber}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => {}}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-500 ml-2"
                          onClick={() => {}}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewmileStone && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-5xl p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-semibold">Mile Stone Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              {renderMileStone && renderMileStone.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">
                          Mile Stone
                        </th>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">
                          Bill Number
                        </th>
                        <th className="border px-4 py-2 text-left">
                          Balance Before Tax
                        </th>
                        <th className="border px-4 py-2 text-left">CGST</th>
                        <th className="border px-4 py-2 text-left">SGST</th>
                        <th className="border px-4 py-2 text-left">IGST</th>
                        <th className="border px-4 py-2 text-left">TDS</th>
                        <th className="border px-4 py-2 text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderMileStone.map((bill, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{`M${
                            index + 1
                          }`}</td>
                          <td className="border px-4 py-2">{bill.date}</td>
                          <td className="border px-4 py-2">
                            {bill.billNumber}
                          </td>
                          <td className="border px-4 py-2">
                            {bill.balanceBeforeTax}
                          </td>
                          <td className="border px-4 py-2">{bill.cgst}</td>
                          <td className="border px-4 py-2">{bill.sgst}</td>
                          <td className="border px-4 py-2">{bill.igst}</td>
                          <td className="border px-4 py-2">{bill.tds}</td>
                          <td className="border px-4 py-2">
                            {bill.rate * bill.billedQuantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center mt-4">
                  <p className="text-gray-500">No Row Data Found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillSection;
