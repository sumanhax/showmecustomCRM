import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  supplierList,
  supplierActiveToggle,
  supplierEdit,
  supplierDetails,
} from "../../Reducer/EcommerceSlice";
import Loader from "../../components/Loader";
import AddSupplierModal from "./AddSupplierModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { FaSearch, FaTimes, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ManageSupplier = () => {
  const dispatch = useDispatch();
  const { supplierListData, loading, error } = useSelector((state) => state.ecom);
  
  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
  const [openEditSupplierModal, setOpenEditSupplierModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSupplierData, setSelectedSupplierData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract and transform supplier list from response
  const supplierData = useMemo(() => {
    if (supplierListData?.data && Array.isArray(supplierListData.data)) {
      // Transform the nested structure to flat structure for AG Grid
      return supplierListData.data.map((item) => ({
        id: item.id, // Keep the record ID
        name: item.fields?.["Supplier Name"] || "",
        code: item.fields?.Code || "",
        isActive: item.fields?.["Is Active"] ?? false,
        fields: item.fields, // Keep original fields for reference
        createdTime: item.createdTime,
      }));
    }
    return [];
  }, [supplierListData]);

  // Fetch suppliers using Redux
  const fetchSuppliers = () => {
    console.log("fetchSuppliers called - refreshing suppliers data");
    dispatch(supplierList())
      .unwrap()
      .then((response) => {
        console.log("Suppliers data refreshed:", response);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to fetch suppliers");
      });
  };

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter suppliers based on search term
  const filteredSupplierData = useMemo(() => {
    if (!searchTerm) return supplierData;
    
    const searchLower = searchTerm.toLowerCase();
    return supplierData.filter((supplier) => 
      (supplier.name && supplier.name.toLowerCase().includes(searchLower)) ||
      (supplier.code && supplier.code.toLowerCase().includes(searchLower))
    );
  }, [supplierData, searchTerm]);

  // Handle add new supplier
  const handleAddSupplier = () => {
    setSelectedSupplierData(null);
    setOpenAddSupplierModal(true);
  };

  // Handle edit supplier
  const handleEditSupplier = (supplierId) => {
    console.log("handleEditSupplier called with supplierId:", supplierId);
    const supplier = supplierData.find((s) => s.id === supplierId);
    console.log("Found supplier:", supplier);
    if (supplier) {
      // Pass the supplier with flattened structure to modal
      setSelectedSupplierData({
        id: supplier.id,
        name: supplier.name,
        code: supplier.code,
        isActive: supplier.isActive,
        fields: supplier.fields, // Keep original fields for reference
      });
      setOpenEditSupplierModal(true);
    } else {
      console.log("Supplier not found");
      toast.error("Supplier not found");
    }
  };

  // Handle delete supplier
  const handleDeleteSupplier = (supplierId) => {
    const supplier = supplierData.find((s) => s.id === supplierId);
    if (supplier) {
      setSelectedSupplierData(supplier);
      setOpenDeleteModal(true);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!selectedSupplierData) return;

    const supplierId = selectedSupplierData.id;
    console.log("Deleting supplier:", supplierId);

    dispatch(supplierDelete(supplierId))
      .unwrap()
      .then((response) => {
        console.log("Supplier deleted successfully:", response);
        toast.success("Supplier deleted successfully!");
        fetchSuppliers();
        setOpenDeleteModal(false);
        setSelectedSupplierData(null);
      })
      .catch((error) => {
        console.error("Error deleting supplier:", error);
        toast.error("Failed to delete supplier. Please try again.");
      });
  };

  // Handle toggle active status
  const handleToggleActive = (supplierId, currentStatus) => {
    console.log("Toggling active status for supplier:", supplierId);
    const newStatus = !currentStatus;

    // Use edit action to update isActive status with proper field name
    dispatch(supplierActiveToggle(
      supplierId
    ))
      .unwrap()
      .then((response) => {
        console.log("Supplier status updated successfully:", response);
        toast.success(`Supplier ${newStatus ? "activated" : "deactivated"} successfully!`);
        fetchSuppliers();
      })
      .catch((error) => {
        console.error("Error updating supplier status:", error);
        toast.error("Failed to update supplier status. Please try again.");
      });
  };

  // Handle view supplier (sample handler)
  const handleViewSupplier = (supplierId) => {
    console.log("Viewing supplier:", supplierId);
    
    dispatch(supplierDetails(supplierId))
      .unwrap()
      .then((response) => {
        console.log("Supplier details:", response);
        const supplier = supplierData.find((s) => s.id === supplierId);
        if (supplier) {
          toast.info(`Viewing supplier: ${supplier.name} (${supplier.code})`);
          // Add navigation or modal to show full details
        }
      })
      .catch((error) => {
        console.error("Error fetching supplier details:", error);
        toast.error("Failed to fetch supplier details.");
      });
  };

  // Custom cell renderer for isActive toggle
  const ActiveToggleRenderer = (params) => {
    const isActive = params.value;
    const supplierId = params.data.id;

    return (
      <button
        onClick={() => handleToggleActive(supplierId, isActive)}
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
    const supplierId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleViewSupplier(supplierId)}
          className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded-full transition-colors"
          title="View"
        >
          <FaEye size={14} />
        </button>
        <button
          onClick={() => handleEditSupplier(supplierId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => handleDeleteSupplier(supplierId)}
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
      field: "name",
      headerName: "Name",
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
          <Loader size="large" text="Loading Suppliers..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Manage Suppliers</h1>

            {/* Search Bar in the middle */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search suppliers by name or code..."
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
                onClick={handleAddSupplier}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Supplier
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredSupplierData.length} of {supplierData.length} suppliers
              </p>
            </div>
          )}

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredSupplierData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              domLayout="autoHeight"
              getRowHeight={() => 50}
            />
          </div>
        </div>

        {/* Add Supplier Modal */}
        {openAddSupplierModal && (
          <AddSupplierModal
            openModal={openAddSupplierModal}
            setOpenModal={setOpenAddSupplierModal}
            onSupplierAdded={fetchSuppliers}
            supplierData={null}
            isEdit={false}
            
          />
        )}

        {/* Edit Supplier Modal */}
        {openEditSupplierModal && selectedSupplierData && (
          <AddSupplierModal
            openModal={openEditSupplierModal}
            setOpenModal={setOpenEditSupplierModal}
            onSupplierAdded={fetchSuppliers}
            supplierData={selectedSupplierData}
            isEdit={true}
          />
        )}

        {/* Delete Confirmation Modal */}
        {openDeleteModal && selectedSupplierData && (
          <DeleteConfirmModal
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
            onConfirm={handleConfirmDelete}
            supplierName={selectedSupplierData.name}
          />
        )}
      </div>
    </>
  );
};

export default ManageSupplier;
