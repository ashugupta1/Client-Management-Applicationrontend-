import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

const ClientSection = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    address: "",
    GSTIN: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients");
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error.message);
        setMessage("Failed to fetch clients.");
      }
    };
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/clients",
        formData
      );
      alert("Client added successfully!");
      setShowForm(false);
      setFormData({
        clientName: "",
        phone: "",
        email: "",
        address: "",
        GSTIN: "",
      });
      const updatedClients = await axios.get(
        "http://localhost:3000/api/clients"
      );
      setClients(updatedClients.data);
      setFilteredClients(updatedClients.data);
    } catch (error) {
      console.error("Error adding client:", error.message);
      setMessage("Failed to add client. Please try again.");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        (client) =>
          client.clientName.toLowerCase().includes(value.toLowerCase()) ||
          client.phone.includes(value) ||
          client.email.toLowerCase().includes(value.toLowerCase()) ||
          client.GSTIN.includes(value)
      );
      setFilteredClients(filtered);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        {/* Clients header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Clients</h1>
        </div>

        {/* Top-right buttons */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Add Client
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search clients by name, phone, email, or GSTIN"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add Client</h3>
              {message && (
                <div className="mb-4 text-red-600 bg-red-100 p-3 rounded border border-red-400">
                  {message}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="clientName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Client Name
                  </label>
                  <input
                    id="clientName"
                    name="clientName"
                    placeholder="Ashu Gupta"
                    type="text"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    placeholder="Enter the address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="GSTIN"
                    className="block text-sm font-medium text-gray-600"
                  >
                    GSTIN
                  </label>
                  <input
                    id="GSTIN"
                    name="GSTIN"
                    type="text"
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.GSTIN}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Clients Table */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Client List</h3>
          <table className="min-w-full bg-white border border-gray-300 shadow-sm">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  GSTIN
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client._id} className="border-b">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {client.clientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {client.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {client.GSTIN}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientSection;
