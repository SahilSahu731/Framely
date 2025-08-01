import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { useState } from "react";
import CreatePostModal from "../post/CreatePostModal";

const MainLayout = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <Sidebar openCreateModal={() => setCreateModalOpen(true)} />
        <main className="ml-80 min-h-screen p-6 bg-gray-900">
          {" "}
          {/* Margin to avoid overlap */}
          <Outlet />
        </main>
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

export default MainLayout;
