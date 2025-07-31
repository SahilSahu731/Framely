import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="/admin/dashboard" className="block py-2">Dashboard</Link></li>
            <li><Link to="/admin/users" className="block py-2">Manage Users</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet /> {/* Renders admin pages */}
      </main>
    </div>
  );
};

export default AdminLayout;