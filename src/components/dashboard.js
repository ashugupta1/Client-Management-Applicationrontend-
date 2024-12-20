import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import axios from "axios";

export default function Dashboard() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);  // Assuming you have this data
  const [totalVehicles, setTotalVehicles] = useState(0);  // Assuming you have this data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectResponse = await axios.get("http://localhost:3000/api/projects");
        const clientResponse = await axios.get("http://localhost:3000/api/clients");
        
        setTotalProjects(projectResponse.data.length);
        setTotalClients(clientResponse.data.length);

        // Assuming you also have API endpoints for employees and vehicles
        const employeeResponse = await axios.get("http://localhost:3000/api/employees");
        const vehicleResponse = await axios.get("http://localhost:3000/api/vehicles");

        setTotalEmployees(employeeResponse.data.length);
        setTotalVehicles(vehicleResponse.data.length);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h3 className="text-lg font-semibold">Total Projects</h3>
            <p className="text-2xl">{totalProjects}</p>
          </div>
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h3 className="text-lg font-semibold">Total Clients</h3>
            <p className="text-2xl">{totalClients}</p>
          </div>
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h3 className="text-lg font-semibold">Total Employees</h3>
            <p className="text-2xl">{totalEmployees}</p>
          </div>
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h3 className="text-lg font-semibold">Total Vehicles</h3>
            <p className="text-2xl">{totalVehicles}</p>
          </div>
        </div>
        <button
          onClick={handleSignout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Signout
        </button>
      </main>
    </div>
  );
}
