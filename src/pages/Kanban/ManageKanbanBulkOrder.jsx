import React from "react";
import { ToastContainer } from "react-toastify";
import { KanbanBoard } from "../../components/Kanban/kanban-board";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { KanbanBoardBulkOrder } from "../../components/Kanban/kanban-board-bulkOrder";

const ManageKanbanBulkOrder = () => {
  const sidebarOpen = useSelector((state) => state.sidebar.isOpen);
  console.log("sidebarOpen", sidebarOpen);
  return (
    <>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Leads</h2>
            {/* <Button
                onClick={() => setOpenMoodMasterModal(true)}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add Mood Master
              </Button> */}
          </div>
          <div
            className={`overflow-x-auto ${
              sidebarOpen ? "sidebarOpenWidth" : "sidebarCloseWidth"
            }`}
          >
            <KanbanBoardBulkOrder />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageKanbanBulkOrder;
