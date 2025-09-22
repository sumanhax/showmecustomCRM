import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { getTopics } from "../../Reducer/TopicSlice";
import { useSelector } from "react-redux";
import userRoles from "../utils/userRoles";
import AddTopicModal from "./AddTopicModal";
import UpdateTopicModal from "./UpdateTopicModal";

const TopicList = () => {
  const dispatch = useDispatch();
  const { allTopics } = useSelector((state) => state?.topicsData);
  console.log("allTopics", allTopics);
  const currentUserRole = userRoles();
  const [openAddTopicModal, setOpenAddTopicModal] = useState(false);
  const [openUpdateTopicModal, setOpenUpdateTopicModal] = useState(false);
  const [topicId, setTopicId] = useState("");

  useEffect(() => {
    dispatch(getTopics());
  }, [dispatch]);

  const handleEditTopic = (id) => {
    setTopicId(id);
    setOpenUpdateTopicModal(true);
  };

  const StatusCellRenderer = (props) => {
    const isActive = props.value === 1;
    const statusText = isActive ? "Active" : "Inactive";
    const statusColor = isActive ? "#52b69a" : "#EF4444"; // Green for active, Red for inactive

    return (
      <div className="flex items-center h-full">
        <span
          className="px-3 py-1 rounded-md text-white text-sm font-medium"
          style={{ backgroundColor: statusColor }}
        >
          {statusText}
        </span>
      </div>
    );
  };

  // Edit Button Cell Renderer Component
  const EditButtonRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleEditTopic(props.data.id)}
          className="bg-black hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </button>
      </div>
    );
  };

  // Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Topics",
        field: "topic_name",
        flex: 1,
        minWidth: 200,
        cellClass: "flex items-center",
      },
      {
        headerName: "Short Name",
        field: "topic_short_name",
        flex: 1,
        minWidth: 200,
        cellClass: "flex items-center",
      },
      {
        headerName: "Description",
        field: "topic_description",
        flex: 1,
        minWidth: 200,
        cellClass: "flex items-center",
      },
      {
        headerName: "Status",
        field: "status",
        width: 120,
        cellRenderer: StatusCellRenderer,
        cellClass: "flex items-center",
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 100,
        cellRenderer: EditButtonRenderer,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
      },
    ],
    []
  );

  // Default Column Definition
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Grid Options
  const gridOptions = {
    domLayout: "autoHeight",
    suppressHorizontalScroll: false,
    rowHeight: 60,
  };

  const handleAddTopic = () => {
    setOpenAddTopicModal(true);
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
          <div className="h-full lg:h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Topic</h2>
              {currentUserRole === "SA" && (
                <>
                  <Button
                    onClick={() => handleAddTopic()}
                    className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
                  >
                    Add Topic
                  </Button>
                </>
              )}
            </div>

            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              <AgGridReact
                rowData={allTopics?.data || []}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                gridOptions={gridOptions}
                animateRows={true}
                rowSelection="single"
                suppressMenuHide={true}
                pagination={true}
                paginationPageSize={5}
              />
            </div>
          </div>
        </div>
      </div>

      {openAddTopicModal && (
        <AddTopicModal
          openAddTopicModal={openAddTopicModal}
          setOpenAddTopicModal={setOpenAddTopicModal}
        />
      )}

      {openUpdateTopicModal && (
        <UpdateTopicModal
          openUpdateTopicModal={openUpdateTopicModal}
          setOpenUpdateTopicModal={setOpenUpdateTopicModal}
          topicId={topicId}
        />
      )}
    </>
  );
};

export default TopicList;
