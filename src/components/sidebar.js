export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-5">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <ul className="space-y-4">
        <li>
          <a href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </a>
        </li>
        <li className="relative group">
          <button className="flex items-center justify-between w-full hover:text-gray-300">
            Projects
            <span className="ml-2 transform group-hover:rotate-180 transition-transform">
              ▼
            </span>
          </button>
          <ul className="hidden group-hover:block mt-2 bg-gray-700 rounded-md">
            <li>
              <a
                href="/clients"
                className="block px-4 py-2 hover:bg-gray-600 rounded-t-md"
              >
                Clients
              </a>
            </li>
            <li>
              <a href="/projects" className="block px-4 py-2 hover:bg-gray-600">
                Projects
              </a>
            </li>
            <li>
              <a
                href="/bills"
                className="block px-4 py-2 hover:bg-gray-600 rounded-b-md"
              >
                Bills
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}
