import React, { useState, useEffect } from "react";
import axios from "axios";

const ClientSection = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    address: "",
    GSTIN: "",
  });
  const [message, setMessage] = useState("");

  // Fetch clients from the backend on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients");
        setClients(response.data); // Store the fetched data
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
      const response = await axios.post("http://localhost:3000/api/clients", formData);
      alert("Client added successfully!");
      setShowForm(false); // Close the form
      setFormData({
        clientName: "",
        phone: "",
        email: "",
        address: "",
        GSTIN: "",
      });
      // Re-fetch clients to update the list after adding a new client
      const updatedClients = await axios.get("http://localhost:3000/api/clients");
      setClients(updatedClients.data);
    } catch (error) {
      console.error("Error adding client:", error.message);
      setMessage("Failed to add client. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Clients</h2>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Add Client
      </button>

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
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
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
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
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
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Client Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Address</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">GSTIN</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-700">{client.clientName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{client.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{client.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{client.address}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{client.GSTIN}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientSection;
