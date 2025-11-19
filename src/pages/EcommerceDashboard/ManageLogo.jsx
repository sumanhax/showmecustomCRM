import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  logoList,
  logoStatusChange,
} from "../../Reducer/EcommerceSlice";
import Loader from "../../components/Loader";
import AddLogoModal from "./AddLogoModal";
import { FaSearch, FaTimes, FaEdit } from "react-icons/fa";

const ManageLogo = () => {
  const dispatch = useDispatch();
  const { logoListData, loading } = useSelector((state) => state.ecom);
  
  const [openAddLogoModal, setOpenAddLogoModal] = useState(false);
  const [openEditLogoModal, setOpenEditLogoModal] = useState(false);
  const [selectedLogoData, setSelectedLogoData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract and transform logo list from response
  const logoData = useMemo(() => {
    if (logoListData?.data?.data && Array.isArray(logoListData.data.data)) {
       
      return logoListData.data.data.map((item) => {
        return {
          id: item.id,
          placement: item.fields?.["Placement"] || "",
          sur_price: item.fields?.["Per-Unit Surcharge"] || 0,
          active: item.fields?.["Active"] ?? false,
        };
      });
    }
    return [];
  }, [logoListData]);

  console.log("logoListData====>", logoListData);
  // Fetch logos using Redux
  const fetchLogos = () => {
    console.log("fetchLogos called - refreshing logos data");
    dispatch(logoList())
      .unwrap()
      .then((response) => {
        console.log("Logos data refreshed:", response);
      })
      .catch((error) => {
        console.error("Error fetching logos:", error);
        toast.error("Failed to fetch logos");
      });
  };

  useEffect(() => {
    fetchLogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter logos based on search term
  const filteredLogoData = useMemo(() => {
    if (!searchTerm) return logoData;
    
    const searchLower = searchTerm.toLowerCase();
    return logoData.filter((logo) => 
      (logo.placement && logo.placement.toLowerCase().includes(searchLower)) ||
      (logo.sur_price && logo.sur_price.toString().includes(searchLower))
    );
  }, [logoData, searchTerm]);

  // Handle add new logo
  const handleAddLogo = () => {
    setSelectedLogoData(null);
    setOpenAddLogoModal(true);
  };

  // Handle edit logo
  const handleEditLogo = (logoId) => {
    console.log("handleEditLogo called with logoId:", logoId);
    const logo = logoData.find((l) => l.id === logoId);
    console.log("Found logo:", logo);
    if (logo) {
      setSelectedLogoData(logo);
      setOpenEditLogoModal(true);
    } else {
      console.log("Logo not found");
      toast.error("Logo not found");
    }
  };

  // Handle active/inactive toggle
  const handleToggleActive = (logoId, currentStatus) => {
    console.log("Toggle active for logo:", logoId, "Current status:", currentStatus);
    
    dispatch(logoStatusChange(logoId))
      .unwrap()
      .then((response) => {
        console.log("Logo status changed successfully:", response);
        toast.success(`Logo ${!currentStatus ? "activated" : "deactivated"} successfully!`);
        fetchLogos();
      })
      .catch((error) => {
        console.error("Error changing logo status:", error);
        toast.error("Failed to change logo status. Please try again.");
      });
  };

  // Custom cell renderer for Actions
  const ActionsRenderer = (params) => {
    const logoId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleEditLogo(logoId)}
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
    const logoId = params.data.id;

    return (
      <button
        onClick={() => handleToggleActive(logoId, isActive)}
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
      field: "placement",
      headerName: "Placement",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "sur_price",
      headerName: "Sur Price",
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
          <Loader size="large" text="Loading Logos..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Manage Logos</h1>

            {/* Search Bar in the middle */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search logos..."
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
                onClick={handleAddLogo}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Logo
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredLogoData.length} of {logoData.length} logos
              </p>
            </div>
          )}

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredLogoData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              paginationPageSizeSelector={[10, 20, 50, 100]}
              getRowHeight={() => 50}
            />
          </div>
        </div>

        {/* Add Logo Modal */}
        {openAddLogoModal && (
          <AddLogoModal
            openModal={openAddLogoModal}
            setOpenModal={setOpenAddLogoModal}
            onLogoAdded={() => fetchLogos()}
            logoData={null}
            isEdit={false}
          />
        )}

        {/* Edit Logo Modal */}
        {openEditLogoModal && selectedLogoData && (
          <AddLogoModal
            openModal={openEditLogoModal}
            setOpenModal={setOpenEditLogoModal}
            onLogoAdded={() => fetchLogos()}
            logoData={selectedLogoData}
            isEdit={true}
          />
        )}
      </div>
    </>
  );
};

export default ManageLogo;

