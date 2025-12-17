import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { FaEdit, FaEye, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import { Button } from "flowbite-react";
import { AgGridReact } from "ag-grid-react";
import Loader from "../../../components/Loader";
import AddWareHouseModal from "./AddWareHouseModal";
import { warehouseList } from "../../../Reducer/ManageWareHouseNewSlice";
import { toast } from "react-toastify";

const ManageWareHouse=()=>{

  const dispatch = useDispatch();
  const { warehouseListData, loading, error } = useSelector((state) => state.warehouse);
  const [openAddWareHouseModal, setOpenAddWareHouseModal] = useState(false);
  const [openEditwarehouseModal, setOpenEditwarehouseModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedwarehouseData, setSelectedwarehouseData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const warehouseData = useMemo(() => {
    if (warehouseListData?.data && Array.isArray(warehouseListData.data)) {
      // Transform the nested structure to flat structure for AG Grid
      return warehouseListData.data.map((item) => ({
        id: item.id,
        warehouseName: item?.name || "",
        code: item?.code || "",
        address: item?.address || "",
        isActive: item?.is_active ?? false,
        createdTime: item.created_at,
      }));
    }
    return [];
  }, [warehouseListData]);
  // Fetch warehouse using
  const fetchWareHouse = () => {
    console.log("fetchWareHouse called - refreshing warehouse data");
    dispatch(warehouseList())
      .unwrap()
      .then((response) => {
        console.log("warehouse data refreshed:", response);
      })
      .catch((error) => {
        console.error("Error fetching warehouse:", error);
        toast.error("Failed to fetch warehouse");
      });
  };

  useEffect(() => {
    fetchWareHouse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 // Filter warehouses based on search term
 const filteredWarehouseData = useMemo(() => {
  if (!searchTerm) return warehouseData;
  
  const searchLower = searchTerm.toLowerCase();
  return warehouseData.filter((warehouse) => 
    (warehouse.name && warehouse.name.toLowerCase().includes(searchLower)) ||
    (warehouse.code && warehouse.code.toLowerCase().includes(searchLower)) ||
    (warehouse.websiteURL && warehouse.websiteURL.toLowerCase().includes(searchLower)) 
  );
}, [warehouseData, searchTerm]);

  // Handle add new warehouse
  const handleAddWarehouse = () => {
    setSelectedwarehouseData(null);
    setOpenAddWareHouseModal(true);
  };

  // Handle edit warehouse
  const handleEditwarehouse = (warehouseId) => {
    console.log("handleEditwarehouse called with warehouseId:", warehouseId);
    const warehouse = warehouseData.find((s) => s.id === warehouseId);
    console.log("Found warehouse:", warehouse);
    if (warehouse) {
      console.log("wareHouse",warehouse)
      // Pass the warehouse with flattened structure to modal
      setSelectedwarehouseData({
        id: warehouse.id,
        name: warehouse?.warehouseName,
        code: warehouse?.code,
        address:warehouse?.address,
        is_active: warehouse.isActive ? 1 : 0,
      });
      setOpenEditwarehouseModal(true);
    } else {
      console.log("warehouse not found");
    }
  };

  // Handle delete warehouse
  const handleDeletewarehouse = (warehouseId) => {
    const warehouse = warehouseData.find((s) => s.id === warehouseId);
    if (warehouse) {
      setSelectedwarehouseData(warehouse);
      setOpenDeleteModal(true);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!selectedwarehouseData) return;

    const warehouseId = selectedwarehouseData.id;
    console.log("Deleting warehouse:", warehouseId);

    dispatch(warehouseDelete(warehouseId))
      .unwrap()
      .then((response) => {
        console.log("warehouse deleted successfully:", response);
        toast.success("warehouse deleted successfully!");
        fetchWareHouse();
        setOpenDeleteModal(false);
        setSelectedwarehouseData(null);
      })
      .catch((error) => {
        console.error("Error deleting warehouse:", error);
        toast.error("Failed to delete warehouse. Please try again.");
      });
  };

  // Handle toggle active status
  const handleToggleActive = (warehouseId, currentStatus) => {
    console.log("Toggling active status for warehouse:", warehouseId);
    const newStatus = !currentStatus;

    // Use edit action to update isActive status with proper field name
    dispatch(warehouseActiveToggle(
      warehouseId
    ))
      .unwrap()
      .then((response) => {
        console.log("warehouse status updated successfully:", response);
        toast.success(`warehouse ${newStatus ? "activated" : "deactivated"} successfully!`);
        fetchWareHouse();
      })
      .catch((error) => {
        console.error("Error updating warehouse status:", error);
        toast.error("Failed to update warehouse status. Please try again.");
      });
  };

  // Handle view warehouse (sample handler)
  const handleViewwarehouse = (warehouseId) => {
    console.log("Viewing warehouse:", warehouseId);
    
    dispatch(warehouseDetails(warehouseId))
      .unwrap()
      .then((response) => {
        console.log("warehouse details:", response);
        const warehouse = warehouseData.find((s) => s.id === warehouseId);
        if (warehouse) {
          toast.info(`Viewing warehouse: ${warehouse.name} (${warehouse.code})`);
          // Add navigation or modal to show full details
        }
      })
      .catch((error) => {
        console.error("Error fetching warehouse details:", error);
        toast.error("Failed to fetch warehouse details.");
      });
  };

  // Custom cell renderer for isActive toggle
  const ActiveToggleRenderer = (params) => {
    const isActive = params.value;
    const warehouseId = params.data.id;

    return (
      <button
        onClick={() => handleToggleActive(warehouseId, isActive)}
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

  // Custom cell renderer for Actions
  const ActionsRenderer = (params) => {
    const warehouseId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleViewwarehouse(warehouseId)}
          className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded-full transition-colors"
          title="View"
        >
          <FaEye size={14} />
        </button>
        <button
          onClick={() => handleEditwarehouse(warehouseId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => handleDeletewarehouse(warehouseId)}
          className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-full transition-colors"
          title="Delete"
        >
          <FaTrash size={14} />
        </button>
      </div>
    );
  };

  const columnDefs = [
    {
      field: "warehouseName",
      headerName: "Warehouse Name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "code",
      headerName: "Code",
      sortable: true,
      filter: true,
      flex: 1,
    },
    
     {
      field: "address",
      headerName: "Address",
      sortable: true,
      filter: true,
      flex: 2,
    },
    
    {
      field: "isActive",
      headerName: "Status",
      sortable: true,
      filter: true,
      cellRenderer: ActiveToggleRenderer,
      width: 120,
    },
    {
      headerName: "Actions",
      cellRenderer: ActionsRenderer,
      width: 150,
      pinned: "right",
    },
  ];

  // Show loader while data is being fetched
  if (loading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading warehouses..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Manage Warehouse</h1>

            {/* Search Bar in the middle */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search warehouses by name or code..."
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
                onClick={handleAddWarehouse}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Warehouse
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredWarehouseData.length} of {warehouseData.length} warehouses
              </p>
            </div>
          )}

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredWarehouseData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              domLayout="autoHeight"
              getRowHeight={() => 50}
            />
          </div>
        </div>

         {openAddWareHouseModal && (
          <AddWareHouseModal
            openModal={openAddWareHouseModal}
            setOpenModal={setOpenAddWareHouseModal}
           // onwarehouseAdded={fetchWareHouse}
            warehouseData={warehouseData}
            isEdit={false}
            // hatListData={hatListData}
            // decoList={decoList}
            
          />
        )}

     
        {openEditwarehouseModal && selectedwarehouseData && (
          <AddWareHouseModal
            openModal={openEditwarehouseModal}
            setOpenModal={setOpenEditwarehouseModal}
            // onwarehouseAdded={fetchWareHouse}
            warehouseData={selectedwarehouseData}
            isEdit={true}
          />
        )}
{/*  
        
        {openDeleteModal && selectedwarehouseData && (
          <DeleteConfirmModal
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
            onConfirm={handleConfirmDelete}
            warehouseName={selectedwarehouseData.name}
          />
        )} */}
      </div>
    </>
  );
}
export default ManageWareHouse