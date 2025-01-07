import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import axios from "axios";
import "./react-crud-icons.css";


const SiteExpense = () => {
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    User: "",
    Date: "",
    ProjectName: "",
    Expenses: "",
    Ammount: 0,
    MOP: ",",
    ReferenceId: "",
    File: "",
    Remark: "",
  });

  useEffect(() => {
    // Fetch Projects
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

  useEffect(() => {
    // Fetch Expenses
    const fetchExpenses = async () => {
      try {
        const expensesRes = await axios.get(
          "http://localhost:3000/api/expense"
        );
        setExpenses(expensesRes.data || []);
        console.log(expensesRes.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 w-full">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mb-4"></form>

        {/* Table Section */}
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">S. No.</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Project Name</th>
              <th className="border px-4 py-2">Expenses</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">MOP</th>
              <th className="border px-4 py-2">Reference Id</th>
              <th className="border px-4 py-2">File</th>
              <th className="border px-4 py-2">Remark</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <tr key={expense._id}>
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
                    {/* Action Buttons */}
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
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
