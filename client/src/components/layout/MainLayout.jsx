import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

const MainLayout = () => {
  return (
    <div className="bg-black min-h-screen">
      <Sidebar />
      <main className="ml-80 min-h-screen p-6 bg-gray-900"> {/* Margin to avoid overlap */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;