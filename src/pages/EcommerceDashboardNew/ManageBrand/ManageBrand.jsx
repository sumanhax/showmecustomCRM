import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AddbrandModal from "./AddbrandModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { FaSearch, FaTimes, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { brandDelete, brandList } from "../../../Reducer/EcommerceNewSlice";

const Managebrand = () => {
  const dispatch = useDispatch();
  const { brandListData, loading, error } = useSelector((state) => state.newecom);
  
  const [openAddbrandModal, setOpenAddbrandModal] = useState(false);
  const [openEditbrandModal, setOpenEditbrandModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedbrandData, setSelectedbrandData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract and transform brand list from response
  const brandData = useMemo(() => {
    if (brandListData?.data && Array.isArray(brandListData.data)) {
      // Transform the nested structure to flat structure for AG Grid
      return brandListData.data.map((item) => ({
        id: item.id, // Keep the record ID
        name: item?.name || "",
        code: item?.code || "",
        isActive: item?.is_active ?? false,
        // fields: item.fields, 
        createdTime: item.created_at,
        websiteURL:item.website_url,
        imageURL:item.image_url,
      }));
    }
    return [];
  }, [brandListData]);

  // Fetch brands using Redux
  const fechBrands = () => {
    console.log("fechBrands called - refreshing brands data");
    dispatch(brandList())
      .unwrap()
      .then((response) => {
        console.log("brands data refreshed:", response);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        toast.error("Failed to fetch brands");
      });
  };

  useEffect(() => {
    fechBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter brands based on search term
  const filteredbrandData = useMemo(() => {
    if (!searchTerm) return brandData;
    
    const searchLower = searchTerm.toLowerCase();
    return brandData.filter((brand) => 
      (brand.name && brand.name.toLowerCase().includes(searchLower)) ||
      (brand.code && brand.code.toLowerCase().includes(searchLower)) ||
      (brand.websiteURL && brand.websiteURL.toLowerCase().includes(searchLower)) 
    );
  }, [brandData, searchTerm]);

  // Handle add new brand
  const handleAddbrand = () => {
    setSelectedbrandData(null);
    setOpenAddbrandModal(true);
  };

  // Handle edit brand
  const handleEditbrand = (brandId) => {
    console.log("handleEditbrand called with brandId:", brandId);
    const brand = brandData.find((s) => s.id === brandId);
    console.log("Found brand:", brand);
    if (brand) {
      // Pass the brand with flattened structure to modal
      setSelectedbrandData({
        id: brand.id,
        name: brand.name,
        code: brand.code,
        isActive: brand.isActive,
        website_url:brand.websiteURL,
        image_url:brand.imageURL
      });
      setOpenEditbrandModal(true);
    } else {
      console.log("brand not found");
      toast.error("brand not found");
    }
  };

  // Handle delete brand
  const handleDeletebrand = (brandId) => {
    const brand = brandData.find((s) => s.id === brandId);
    if (brand) {
      setSelectedbrandData(brand);
      setOpenDeleteModal(true);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!selectedbrandData) return;

    const brandId = selectedbrandData.id;
    console.log("Deleting brand:", brandId);

    dispatch(brandDelete(brandId))
      .unwrap()
      .then((response) => {
        console.log("brand deleted successfully:", response);
        toast.success("brand deleted successfully!");
        fechBrands();
        setOpenDeleteModal(false);
        setSelectedbrandData(null);
      })
      .catch((error) => {
        console.error("Error deleting brand:", error);
        toast.error("Failed to delete brand. Please try again.");
      });
  };

  // Handle toggle active status
  const handleToggleActive = (brandId, currentStatus) => {
    console.log("Toggling active status for brand:", brandId);
    const newStatus = !currentStatus;

    // Use edit action to update isActive status with proper field name
    dispatch(brandActiveToggle(
      brandId
    ))
      .unwrap()
      .then((response) => {
        console.log("brand status updated successfully:", response);
        toast.success(`brand ${newStatus ? "activated" : "deactivated"} successfully!`);
        fechBrands();
      })
      .catch((error) => {
        console.error("Error updating brand status:", error);
        toast.error("Failed to update brand status. Please try again.");
      });
  };

  // Handle view brand (sample handler)
  const handleViewbrand = (brandId) => {
    console.log("Viewing brand:", brandId);
    
    dispatch(brandDetails(brandId))
      .unwrap()
      .then((response) => {
        console.log("brand details:", response);
        const brand = brandData.find((s) => s.id === brandId);
        if (brand) {
          toast.info(`Viewing brand: ${brand.name} (${brand.code})`);
          // Add navigation or modal to show full details
        }
      })
      .catch((error) => {
        console.error("Error fetching brand details:", error);
        toast.error("Failed to fetch brand details.");
      });
  };

  // Custom cell renderer for isActive toggle
  const ActiveToggleRenderer = (params) => {
    const isActive = params.value;
    const brandId = params.data.id;

    return (
      <button
        onClick={() => handleToggleActive(brandId, isActive)}
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
    const brandId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleViewbrand(brandId)}
          className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded-full transition-colors"
          title="View"
        >
          <FaEye size={14} />
        </button>
        <button
          onClick={() => handleEditbrand(brandId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => handleDeletebrand(brandId)}
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
      field: "websiteURL",
      headerName: "Website",
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
          <Loader size="large" text="Loading brands..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Manage brands</h1>

            {/* Search Bar in the middle */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search brands by name or code..."
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
                onClick={handleAddbrand}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New brand
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredbrandData.length} of {brandData.length} brands
              </p>
            </div>
          )}

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredbrandData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              domLayout="autoHeight"
              getRowHeight={() => 50}
            />
          </div>
        </div>

        {/* Add brand Modal */}
        {openAddbrandModal && (
          <AddbrandModal
            openModal={openAddbrandModal}
            setOpenModal={setOpenAddbrandModal}
            onbrandAdded={fechBrands}
            brandData={null}
            isEdit={false}
            
          />
        )}

        {/* Edit brand Modal */}
        {openEditbrandModal && selectedbrandData && (
          <AddbrandModal
            openModal={openEditbrandModal}
            setOpenModal={setOpenEditbrandModal}
            onbrandAdded={fechBrands}
            brandData={selectedbrandData}
            isEdit={true}
          />
        )}

        {/* Delete Confirmation Modal */}
        {openDeleteModal && selectedbrandData && (
          <DeleteConfirmModal
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
            onConfirm={handleConfirmDelete}
            brandName={selectedbrandData.name}
          />
        )}
      </div>
    </>
  );
};

export default Managebrand;
