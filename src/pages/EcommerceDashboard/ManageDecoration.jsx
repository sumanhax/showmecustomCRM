import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  decorationList,
  decorationStatusChange,
} from "../../Reducer/EcommerceSlice";
import Loader from "../../components/Loader";
import AddDecorationModal from "./AddDecorationModal";
import { FaSearch, FaTimes, FaEdit } from "react-icons/fa";

const ManageDecoration = () => {
  const dispatch = useDispatch();
  const { decorationListData, loading } = useSelector((state) => state.ecom);
  
  const [openAddDecorationModal, setOpenAddDecorationModal] = useState(false);
  const [openEditDecorationModal, setOpenEditDecorationModal] = useState(false);
  const [selectedDecorationData, setSelectedDecorationData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract and transform decoration list from response
  const decorationData = useMemo(() => {
    if (decorationListData?.data?.data && Array.isArray(decorationListData.data.data)) {
      return decorationListData.data.data.map((item) => {
        return {
          id: item.id,
          decoration: item.fields?.["Decoration Method"] || "",
          surcharge: item.fields?.["Per-Unit Surcharge"] || 0,
          lead_time: item.fields?.["Lead Time"] || 0,
          setup_fee: item.fields?.["Setup Fee"] || 0,
          active: item.fields?.["Active"] ?? false,
        };
      });
    }
    return [];
  }, [decorationListData]);

  // Fetch decorations using Redux
  const fetchDecorations = () => {
    console.log("fetchDecorations called - refreshing decorations data");
    dispatch(decorationList())
      .unwrap()
      .then((response) => {
        console.log("Decorations data refreshed:", response);
      })
      .catch((error) => {
        console.error("Error fetching decorations:", error);
        toast.error("Failed to fetch decorations");
      });
  };

  useEffect(() => {
    fetchDecorations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter decorations based on search term
  const filteredDecorationData = useMemo(() => {
    if (!searchTerm) return decorationData;
    
    const searchLower = searchTerm.toLowerCase();
    return decorationData.filter((decoration) => 
      (decoration.decoration && decoration.decoration.toLowerCase().includes(searchLower)) ||
      (decoration.surcharge && decoration.surcharge.toString().includes(searchLower)) ||
      (decoration.lead_time && decoration.lead_time.toString().includes(searchLower)) ||
      (decoration.setup_fee && decoration.setup_fee.toString().includes(searchLower))
    );
  }, [decorationData, searchTerm]);

  // Handle add new decoration
  const handleAddDecoration = () => {
    setSelectedDecorationData(null);
    setOpenAddDecorationModal(true);
  };

  // Handle edit decoration
  const handleEditDecoration = (decorationId) => {
    console.log("handleEditDecoration called with decorationId:", decorationId);
    const decoration = decorationData.find((d) => d.id === decorationId);
    console.log("Found decoration:", decoration);
    if (decoration) {
      setSelectedDecorationData(decoration);
      setOpenEditDecorationModal(true);
    } else {
      console.log("Decoration not found");
      toast.error("Decoration not found");
    }
  };

  // Handle active/inactive toggle
  const handleToggleActive = (decorationId, currentStatus) => {
    console.log("Toggle active for decoration:", decorationId, "Current status:", currentStatus);
    
    dispatch(decorationStatusChange(decorationId))
      .unwrap()
      .then((response) => {
        console.log("Decoration status changed successfully:", response);
        toast.success(`Decoration ${!currentStatus ? "activated" : "deactivated"} successfully!`);
        fetchDecorations();
      })
      .catch((error) => {
        console.error("Error changing decoration status:", error);
        toast.error("Failed to change decoration status. Please try again.");
      });
  };

  // Custom cell renderer for Actions
  const ActionsRenderer = (params) => {
    const decorationId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleEditDecoration(decorationId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>
      </div>
    );
  };

  // Custom cell renderer for isActive toggle
  const ActiveToggleRenderer = (params) => {
    const isActive = params.value;
    const decorationId = params.data.id;

    return (
      <button
        onClick={() => handleToggleActive(decorationId, isActive)}
        className={`px-4 py-1 rounded-full text-white text-xs font-semibold transition-colors ${
          isActive
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 hover:bg-gray-500"
        }`}
        style={{ fontSize: '12px' }}
      >
        {isActive ? "Active" : "Inactive"}
      </button>
    );
  };

  const columnDefs = [
    {
      field: "decoration",
      headerName: "Decoration",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "surcharge",
      headerName: "Surcharge",
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params) => {
        return `$${params.value?.toFixed(2) || "0.00"}`;
      },
    },
    {
      field: "lead_time",
      headerName: "Lead Time (days)",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "setup_fee",
      headerName: "Setup Fee",
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params) => {
        return `$${params.value?.toFixed(2) || "0.00"}`;
      },
    },
    {
      field: "active",
      headerName: "Active",
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: ActiveToggleRenderer,
    },
    {
      headerName: "Actions",
      cellRenderer: ActionsRenderer,
      width: 100,
      pinned: "right",
    },
  ];

  // Show loader while data is being fetched
  if (loading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading Decorations..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Manage Decorations</h1>

            {/* Search Bar in the middle */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search decorations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="w-4 h-4 text-gray-400" />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <FaTimes className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Add Button */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddDecoration}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Decoration
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredDecorationData.length} of {decorationData.length} decorations
              </p>
            </div>
          )}

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredDecorationData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              paginationPageSizeSelector={[10, 20, 50, 100]}
              getRowHeight={() => 50}
            />
          </div>
        </div>

        {/* Add Decoration Modal */}
        {openAddDecorationModal && (
          <AddDecorationModal
            openModal={openAddDecorationModal}
            setOpenModal={setOpenAddDecorationModal}
            onDecorationAdded={() => fetchDecorations()}
            decorationData={null}
            isEdit={false}
          />
        )}

        {/* Edit Decoration Modal */}
        {openEditDecorationModal && selectedDecorationData && (
          <AddDecorationModal
            openModal={openEditDecorationModal}
            setOpenModal={setOpenEditDecorationModal}
            onDecorationAdded={() => fetchDecorations()}
            decorationData={selectedDecorationData}
            isEdit={true}
          />
        )}
      </div>
    </>
  );
};

export default ManageDecoration;