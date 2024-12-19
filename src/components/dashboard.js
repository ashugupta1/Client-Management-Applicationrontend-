import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Dashboard() {
  const navigate = useNavigate();

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
            <p className="text-2xl">100</p>
          </div>
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h3 className="text-lg font-semibold">Total Clients</h3>
            <p className="text-2xl">50</p>
          </div>
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h3 className="text-lg font-semibold">Total Employees</h3>
            <p className="text-2xl">200</p>
          </div>
          <div className="bg-white shadow-md p-5 rounded-lg">
            <h3 className="text-lg font-semibold">Total Vehicles</h3>
            <p className="text-2xl">30</p>
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
