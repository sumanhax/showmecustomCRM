import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  inventoryList,
  inventoryShowHide,
  hatList,
  inventoryDelete,
} from "../../Reducer/EcommerceSlice";
import Loader from "../../components/Loader";
import AddInventoryModal from "./AddInventoryModal";
import { FaSearch, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const ManageInventory = () => {
  const dispatch = useDispatch();
  const { inventoryListData, loading, hatListData } = useSelector((state) => state.ecom);
  
  const [openAddInventoryModal, setOpenAddInventoryModal] = useState(false);
  const [openEditInventoryModal, setOpenEditInventoryModal] = useState(false);
  const [selectedInventoryData, setSelectedInventoryData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract and transform inventory list from response
  // Response structure: { data: [{ "neww": [...] }] } - need to flatten
  const inventoryData = useMemo(() => {
    if (inventoryListData?.data && Array.isArray(inventoryListData.data)) {
      const flattened = [];
      inventoryListData.data.forEach((group) => {
        // Each group has a key (like "neww") with an array of inventory items
        Object.keys(group).forEach((key) => {
          if (Array.isArray(group[key])) {
            group[key].forEach((item) => {
              flattened.push({
                inventory_id: item.inventory_id || "",
                variant_size_id: item.variant_size_id || "",
                variant_size: item.variant_size || "",
                qty_available: item.qty_available || 0,
                override_qty: item.override_qty || 0,
                effective_qty: item.effective_qty || 0,
                visibility: item.visibility || "No",
                status: item.status || "",
                hidden: item.hidden || false,
              });
            });
          }
        });
      });
      return flattened;
    }
    return [];
  }, [inventoryListData]);

  // Fetch inventory using Redux
  const fetchInventory = () => {
    console.log("fetchInventory called - refreshing inventory data");
    dispatch(inventoryList())
      .unwrap()
      .then((response) => {
        console.log("Inventory data refreshed:", response);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        toast.error("Failed to fetch inventory");
      });
  };

  // Fetch hats to populate variant size dropdown
  const fetchHats = () => {
    dispatch(hatList({ limit: 1000, page: 1 }))
      .unwrap()
      .catch((error) => {
        console.error("Error fetching hats:", error);
      });
  };

  useEffect(() => {
    fetchInventory();
    fetchHats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter inventory based on search term
  const filteredInventoryData = useMemo(() => {
    if (!searchTerm) return inventoryData;
    
    const searchLower = searchTerm.toLowerCase();
    return inventoryData.filter((inventory) => 
      (inventory.variant_size && inventory.variant_size.toLowerCase().includes(searchLower)) ||
      (inventory.status && inventory.status.toLowerCase().includes(searchLower)) ||
      (inventory.qty_available && inventory.qty_available.toString().includes(searchLower)) ||
      (inventory.override_qty && inventory.override_qty.toString().includes(searchLower))
    );
  }, [inventoryData, searchTerm]);

  // Handle add new inventory
  const handleAddInventory = () => {
    setSelectedInventoryData(null);
    setOpenAddInventoryModal(true);
  };

  const handleDeleteInventory = (inventoryId) => {
    console.log("handleDeleteInventory called with inventoryId:", inventoryId);
    if(!inventoryId) {
      toast.error("Inventory ID is required");
      return;
    }
    dispatch(inventoryDelete({ inventory_id: inventoryId }))
      .unwrap()
      .then((response) => {
        console.log("Inventory deleted successfully:", response);
        toast.success("Inventory deleted successfully!");
        fetchInventory();
      })
      .catch((error) => {
        console.error("Error deleting inventory:", error);
        toast.error("Failed to delete inventory. Please try again.");
      });
  }

  // Handle edit inventory
  const handleEditInventory = (inventoryId) => {
    console.log("handleEditInventory called with inventoryId:", inventoryId);
    const inventory = inventoryData.find((inv) => inv.inventory_id === inventoryId);
    console.log("Found inventory:", inventory);
    if (inventory) {
      setSelectedInventoryData(inventory);
      setOpenEditInventoryModal(true);
    } else {
      console.log("Inventory not found");
      toast.error("Inventory not found");
    }
  };

  // Handle visibility toggle
  const handleToggleVisibility = (inventoryId, currentVisibility, isVisible) => {
    console.log("Toggle visibility for inventory:", inventoryId, "Current visibility:", currentVisibility, "Is visible:", isVisible);
    
    const inventory = inventoryData.find((inv) => inv.inventory_id === inventoryId);
    if (!inventory) {
      toast.error("Inventory not found");
      return;
    }

    const payload = {
      inventory_id: inventoryId,
      // variant_size_id: inventory.variant_size_id,
      is_checked: isVisible ? 1 : 0,
    };

    dispatch(inventoryShowHide(payload))
      .unwrap()
      .then((response) => {
        console.log("Inventory visibility changed successfully:", response);
        toast.success(`Inventory ${currentVisibility === "Yes" ? "hidden" : "shown"} successfully!`);
        fetchInventory();
      })
      .catch((error) => {
        console.error("Error changing inventory visibility:", error);
        toast.error("Failed to change inventory visibility. Please try again.");
      });
  };

  // Custom cell renderer for Actions
  const ActionsRenderer = (params) => {
    const inventoryId = params.data.inventory_id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleEditInventory(inventoryId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => handleDeleteInventory(inventoryId)}
          className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-full transition-colors"
          title="Delete"
        >
          <FaTrash size={14} />
        </button>
      </div>
    );
  };

  // Custom cell renderer for visibility toggle
  const VisibilityToggleRenderer = (params) => {
    const visibility = params.value;
    const inventoryId = params.data.inventory_id;
    const isVisible = visibility === "Yes";

    return (
      <button
        onClick={() => handleToggleVisibility(inventoryId, visibility, isVisible)}
        className={`px-4 py-1 rounded-full text-white text-xs font-semibold transition-colors ${
          isVisible
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 hover:bg-gray-500"
        }`}
        style={{ fontSize: '12px' }}
      >
        {isVisible ? "Visible" : "Hidden"}
      </button>
    );
  };

  const columnDefs = [
    {
      field: "variant_size",
      headerName: "Variant Size",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "qty_available",
      headerName: "Qty Available",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "override_qty",
      headerName: "Override Qty",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "effective_qty",
      headerName: "Effective Qty",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "visibility",
      headerName: "Visible",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: VisibilityToggleRenderer,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      filter: true,
      width: 150,
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
          <Loader size="large" text="Loading Inventory..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Manage Inventory</h1>

            {/* Search Bar in the middle */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inventory..."
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
                onClick={handleAddInventory}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Inventory
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredInventoryData.length} of {inventoryData.length} inventory items
              </p>
            </div>
          )}

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredInventoryData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              paginationPageSizeSelector={[10, 20, 50, 100]}
              getRowHeight={() => 50}
            />
          </div>
        </div>

        {/* Add Inventory Modal */}
        {openAddInventoryModal && (
          <AddInventoryModal
            openModal={openAddInventoryModal}
            setOpenModal={setOpenAddInventoryModal}
            onInventoryAdded={() => fetchInventory()}
            inventoryData={null}
            isEdit={false}
          />
        )}

        {/* Edit Inventory Modal */}
        {openEditInventoryModal && selectedInventoryData && (
          <AddInventoryModal
            openModal={openEditInventoryModal}
            setOpenModal={setOpenEditInventoryModal}
            onInventoryAdded={() => fetchInventory()}
            inventoryData={selectedInventoryData}
            isEdit={true}
          />
        )}
      </div>
    </>
  );
};

export default ManageInventory;
