import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import axios from "axios";
import Icon from "react-crud-icons";

import "./react-crud-icons.css";

const SiteExpense = () => {
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectExpense, setSelectExpense] = useState(null);
  const [editExpense, setEditExpense] = useState(false);

  const [formData, setFormData] = useState({
    User: "",
    Date: "",
    ProjectName: "",
    Expenses: "",
    Ammount: 0,
    MOP: "",
    ReferenceId: "",
    File: "",
    Remark: "",
  });

  // Fetch Projects
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

  // Fetch Expenses

  const fetchExpenses = async () => {
    try {
      const expensesRes = await axios.get("http://localhost:3000/api/expense");
      setExpenses(expensesRes.data || []);
      console.log(expensesRes.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const expenseOptions = [
    "Wages",
    "Food",
    "Dozing",
    "Unloading",
    "Point",
    "Water",
    "Backhander",
    "Other",
  ];

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (editExpense) {
      console.log("in edit mode ", formData);
      try {
        axios.put(
          `http://localhost:3000/api/expense/${selectExpense._id}`,
          formData
        );
        fetchExpenses();
      } catch (error) {
        console.log("getting error while update data", error);
      }
    } else {
      console.log("in post mode ", formData);
      try {
        axios.post("http://localhost:3000/api/expense", formData);
        fetchExpenses();
        alert("expense successfully added...");
      } catch (error) {
        console.log("getting error while send data", error);
      }
    }
    // console.log(formData);
    setShowForm(false);

    setFormData({
      User: "",
      Date: "",
      ProjectName: "",
      Expenses: "",
      Ammount: 0,
      MOP: "",
      ReferenceId: "",
      File: "",
      Remark: "",
    });
  };

  //expense edit
  const handleEditExpense = async (expense) => {
    console.log("handle edit function ", expense);
    setSelectExpense(expense);
    setFormData({
      User: expense.User || "",
      Date: expense.Date || "",
      ProjectName: expense.ProjectName || "",
      Expenses: expense.Expense || "",
      Ammount: expense.Ammount || 0,
      MOP: expense.MOP || "",
      ReferenceId: expense.ReferenceId || "",
      File: expense.File || null,
      Remark: expense.Remark || "",
    });

    setShowForm(true);
    setEditExpense(true);
  };

  //expense delete
  const handleDeleteExpense = async (id) => {
    try {
      console.log(id);

      await axios.delete(`http://localhost:3000/api/expense/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      alert("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete the expense.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 w-full">
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4"
          >
            Add Expense
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
              <h3 className="text-2xl font-semibold mb-6">Add Expense</h3>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Form Section for the fields in two rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* User Name */}
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-gray-600"
                    >
                      User Name
                    </label>
                    <input
                      id="userName"
                      name="User"
                      type="text"
                      value={formData.User}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      name="Date"
                      type="date"
                      value={formData.Date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Project */}
                  <div>
                    <label
                      htmlFor="ProjectName"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Project
                    </label>
                    <select
                      id="ProjectName"
                      name="ProjectName"
                      value={formData.ProjectName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project.projectName}>
                          {project.projectName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expense */}
                  <div>
                    <label
                      htmlFor="Expenses"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Expense
                    </label>
                    <select
                      id="expense"
                      name="Expenses"
                      value={formData.Expenses}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Please choose one Expense</option>
                      {expenseOptions.map((expense, index) => (
                        <option key={index} value={expense}>
                          {expense}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label
                      htmlFor="Ammount"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Amount
                    </label>
                    <input
                      id="ammount"
                      name="Ammount"
                      type="number"
                      value={formData.Ammount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Mode of Payment */}
                  <div>
                    <label
                      htmlFor="MOP"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Mode of Payment
                    </label>
                    <input
                      id="mop"
                      name="MOP"
                      value={formData.MOP}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Reference Id */}
                  <div>
                    <label
                      htmlFor="ReferenceId"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Reference Id
                    </label>
                    <input
                      id="ReferenceId"
                      name="ReferenceId"
                      type="text"
                      value={formData.ReferenceId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* File input and Remark input in the second row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* File input */}
                  <div>
                    <label
                      htmlFor="file"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Upload File
                    </label>
                    <input
                      id="file"
                      name="File"
                      type="file"
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Remark input */}
                  <div>
                    <label
                      htmlFor="remark"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Remark
                    </label>
                    <textarea
                      id="remark"
                      name="Remark"
                      value={formData.Remark}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Add your remarks here"
                    />
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-end space-x-6 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table Section */}
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">S. No.</th>
              <th className="border px-4 py-2 text-left">User</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Project Name</th>
              <th className="border px-4 py-2 text-left">Expenses</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">MOP</th>
              <th className="border px-4 py-2 text-left">Reference Id</th>
              <th className="border px-4 py-2 text-left">File</th>
              <th className="border px-4 py-2 text-left">Remark</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{expense.User}</td>
                  <td className="border px-4 py-2">{expense.Date}</td>
                  <td className="border px-4 py-2">{expense.ProjectName}</td>
                  <td className="border px-4 py-2">{expense.Expenses}</td>
                  <td className="border px-4 py-2">{expense.Ammount}</td>
                  <td className="border px-4 py-2">{expense.MOP}</td>
                  <td className="border px-4 py-2">{expense.ReferenceId}</td>
                  <td className="border px-4 py-2">{expense.File}</td>
                  <td className="border px-4 py-2">{expense.Remark}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEditExpense(expense)}>
                      <Icon
                        name="edit"
                        tooltip="Edit"
                        theme="light"
                        size="medium"
                        // onClick={doSomething}
                      />
                    </button>
                    <button onClick={() => handleDeleteExpense(expense._id)}>
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="border px-4 py-2 text-center text-gray-500"
                >
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiteExpense;
