import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../../components/Loader";
import AddHatModal from "./AddHatModal";
import DeleteConfirmModal from "../../EcommerceDashboard/DeleteConfirmModal";
import { FaSearch, FaTimes, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { hatList, hatAdd, hatSingle, brandList  } from "../../../Reducer/EcommerceNewSlice";
// import { hatAdd, hatList } from "../../../Reducer/EcommerceNewSlice";

const ManageHat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hatListData, loading, brandListData } = useSelector((state) => state.newecom);

  
  const [openAddHatModal, setOpenAddHatModal] = useState(false);
  const [openEditHatModal, setOpenEditHatModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedHatData, setSelectedHatData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);



  // Extract and transform hat list from response
  const hatData = useMemo(() => {
    if (hatListData?.data && Array.isArray(hatListData.data)) {
      return hatListData.data.map((item) => {
        // Find brand name from brandListData
        let brandName = "";
        if ( brandListData?.data) {
          const brandId = item.brand_id;
          const foundbrand = brandListData.data.find(
            (brand) => brand.id === brandId
          );
          if (foundbrand?.name) {
            brandName = foundbrand?.name;
          }
        }

        return {
          id: item.id,
          hatName: item.name || "",
          brandName: brandName,
          brandStyleCode: item.internal_style_code || "",
          basePrice: item.basePrice || "",
          minOrderQty: item.min_qty || "",
          active: item.is_active ?? false,
          brand: item.brand || [],
          images: item.images || "",
        };
      });
    }
    return [];
  }, [hatListData, brandListData]);

  // Fetch hats using Redux with pagination
  const fetchHats = (page = currentPage, limit = pageSize) => {
    console.log("fetchHats called - refreshing hats data", { page, limit });
    dispatch(hatList({ limit, page }))
      .unwrap()
      .then((response) => {
        console.log("Hats data refreshed:", response);
      })
      .catch((error) => {
        console.error("Error fetching hats:", error);
        toast.error("Failed to fetch hats");
      });
  };

  // Fetch brands for dropdown
  const fetchbrands = () => {
    dispatch(brandList())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  };

  useEffect(() => {
    fetchHats(currentPage, pageSize);
    fetchbrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  // Filter hats based on search term
  const filteredHatData = useMemo(() => {
    if (!searchTerm) return hatData;
    
    const searchLower = searchTerm.toLowerCase();
    return hatData.filter((hat) => 
      (hat.hatName && hat.hatName.toLowerCase().includes(searchLower)) ||
      (hat.brandStyleCode && hat.brandStyleCode.toLowerCase().includes(searchLower)) ||
      (hat.basePrice && hat.basePrice.toLowerCase().includes(searchLower))
    );
  }, [hatData, searchTerm]);

  // Handle pagination change
  const onPaginationChanged = (event) => {
    console.log("onPaginationChanged called", event); 
    const api = event.api;
    const currentPageNum = api.paginationGetCurrentPage();
    const pageSizeNum = api.paginationGetPageSize();
    
    if (pageSizeNum !== pageSize) {
      setPageSize(pageSizeNum);
      setCurrentPage(1);
    } else if (currentPageNum + 1 !== currentPage) {
      setCurrentPage(currentPageNum + 1);
    }
  };

  // Handle add new hat
  const handleAddHat = () => {
    setSelectedHatData(null);
    setOpenAddHatModal(true);
  };

  // Handle edit hat
  const handleEditHat = (hatId) => {
    console.log("handleEditHat called with hatId:", hatId);
    const hat = hatData.find((h) => h.id === hatId);
    console.log("Found hat:", hat);
    if (hat) {
      setSelectedHatData(hat);
      setOpenEditHatModal(true);
    } else {
      console.log("Hat not found");
      toast.error("Hat not found");
    }
  };

  // Handle delete hat
  const handleDeleteHat = (hatId) => {
    const hat = hatData.find((h) => h.id === hatId);
    if (hat) {
      setSelectedHatData(hat);
      setOpenDeleteModal(true);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!selectedHatData) return;

    const hatId = selectedHatData.id;
    console.log("Deleting hat:", hatId);

    dispatch(hatDelete(hatId))
      .unwrap()
      .then((response) => {
        console.log("Hat deleted successfully:", response);
        toast.success("Hat deleted successfully!");
        fetchHats(currentPage, pageSize);
        setOpenDeleteModal(false);
        setSelectedHatData(null);
      })
      .catch((error) => {
        console.error("Error deleting hat:", error);
        toast.error("Failed to delete hat. Please try again.");
      });
  };

  // Handle view hat - navigate to details page
  const handleViewHat = (hatId) => {
    navigate(`/hat-details/${hatId}`);
  };

  // Custom cell renderer for Actions
  const ActionsRenderer = (params) => {
    const hatId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleViewHat(hatId)}
          className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded-full transition-colors"
          title="View"
        >
          <FaEye size={14} />
        </button>
        <button
          onClick={() => handleEditHat(hatId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => handleDeleteHat(hatId)}
          className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-full transition-colors"
          title="Delete"
        >
          <FaTrash size={14} />
        </button>
      </div>
    );
  };

  const handleToggleActive=(hatId, currentStatus)=>{
    console.log("toggle")
  }
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

  const columnDefs = [
    // {
    //   field: "images",
    //   headerName: "Image",
    //   sortable: false,
    //   filter: false,
    //   width: 120,
    //   cellRenderer: (params) => {
    //     const imageUrl = params.value;
    //     if (!imageUrl) {
    //       return (
    //         <div className="flex items-center justify-center h-full">
    //           <span className="text-gray-400 text-xs">No image</span>
    //         </div>
    //       );
    //     }
    //     return (
    //       <div className="flex items-center justify-center h-full">
    //         <img
    //           src={imageUrl}
    //           alt="Hat"
    //           className="w-12 h-12 object-cover rounded"
    //           onError={(e) => {
    //             e.target.style.display = "none";
    //             if (e.target.nextSibling) {
    //               e.target.nextSibling.style.display = "block";
    //             }
    //           }}
    //         />
    //         <span className="text-gray-400 text-xs" style={{ display: "none" }}>
    //           Error
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "hatName",
      headerName: "Hat Name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "brandName",
      headerName: "Brand Name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "brandStyleCode",
      headerName: "Internal Style Code",
      sortable: true,
      filter: true,
      flex: 1,
    },
    // {
    //   field: "basePrice",
    //   headerName: "Base Price",
    //   sortable: true,
    //   filter: true,
    //   width: 150,
    // },
    {
      field: "minOrderQty",
      headerName: "Min Order Qty",
      sortable: true,
      filter: true,
      width: 150,
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
      width: 150,
      pinned: "right",
    },
  ];

  // Show loader while data is being fetched
  if (loading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading Hats..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Manage Hats</h1>

            {/* Search Bar in the middle */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search hats by name, style code, or price..."
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
                onClick={handleAddHat}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Hat
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredHatData.length} of {hatData.length} hats
              </p>
            </div>
          )}

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredHatData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={pageSize}
              domLayout="autoHeight"
              paginationPageSizeSelector={[10, 20, 50, 100]}
              onPaginationChanged={onPaginationChanged}
              getRowHeight={() => 50}
            />
          </div>
        </div>

        {/* Add Hat Modal */}
        {openAddHatModal && (
          <AddHatModal
            openModal={openAddHatModal}
            setOpenModal={setOpenAddHatModal}
            onHatAdded={() => fetchHats(currentPage, pageSize)}
            hatData={null}
            isEdit={false}
            brandListData={brandListData}
          />
        )}

        {/* Edit Hat Modal */}
        {openEditHatModal && selectedHatData && (
          <AddHatModal
            openModal={openEditHatModal}
            setOpenModal={setOpenEditHatModal}
            onHatAdded={() => fetchHats(currentPage, pageSize)}
            hatData={selectedHatData}
            isEdit={true}
            brandListData={brandListData}
          />
        )}

        {/* Delete Confirmation Modal */}
        {openDeleteModal && selectedHatData && (
          <DeleteConfirmModal
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
            onConfirm={handleConfirmDelete}
            brandName={selectedHatData.hatName}
            itemType="hat"
          />
        )}
      </div>
    </>
  );
};

export default ManageHat;
