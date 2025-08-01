import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { useState } from "react";
import CreatePostModal from "../post/CreatePostModal";
import CreateStoryModal from "../story/CreateStoryModal";
import { useDispatch, useSelector } from "react-redux";
import { closeCreatePostModal, closeCreateStoryModal } from "../../store/slices/uiSlice";
import StoryViewer from "../story/StoryViewer";

const MainLayout = () => {
  const dispatch  = useDispatch();
    const { isCreatePostModalOpen, isCreateStoryModalOpen } = useSelector((state) => state.ui);


  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <Sidebar/>
        <main className="ml-80 min-h-screen p-6 bg-gray-900">
          {" "}
          {/* Margin to avoid overlap */}
          <Outlet />
        </main>
      </div>
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => dispatch(closeCreatePostModal())}
      />
      <CreateStoryModal
        isOpen={isCreateStoryModalOpen}
        onClose={() => dispatch(closeCreateStoryModal())}
      />
      <StoryViewer />
    </>
  );
};

export default MainLayout;
