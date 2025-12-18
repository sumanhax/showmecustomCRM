import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaEdit, FaEye, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import { Button, Modal } from "flowbite-react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";

import AddDecorationAddonModal from "./AddDecorationAddonModal";

//  adjust path/action names as per your project
import {
  decorationaddonList,
  // decorationaddonDelete,
  // decorationaddonActiveToggle,
  // decorationaddonDetails,
} from "../../../Reducer/ManageDecorationNewSlice";
import { useNavigate } from "react-router-dom";

const ManageDecorationAddon = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()

  //  store: decaddon (as you said)
  const { decorationaddonListData, loading, error } = useSelector(
    (state) => state.decaddon
  );

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAddonData, setSelectedAddonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addonData = useMemo(() => {
    if (decorationaddonListData?.data && Array.isArray(decorationaddonListData.data)) {
      return decorationaddonListData.data.map((item) => ({
        id: item?.id,
        name: item?.name || "",
        code: item?.code || "",
        type: item?.type || "",
        description: item?.description || "",
        isActive: item?.is_active === 1 || item?.is_active === true,
        createdTime: item?.created_at,
      }));
    }
    return [];
  }, [decorationaddonListData]);

  const fetchDecorationAddons = () => {
    console.log("fetchDecorationAddons called");
    dispatch(decorationaddonList())
      .unwrap?.()
      .then((res) => console.log("decorationaddonList response:", res))
      .catch((err) => {
        console.error("decorationaddonList error:", err);
        toast.error("Failed to fetch decoration addons");
      });
  };

  useEffect(() => {
    fetchDecorationAddons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //  fixed filtering (uses correct keys)
  const filteredAddonData = useMemo(() => {
    if (!searchTerm) return addonData;
    const s = searchTerm.toLowerCase();
    return addonData.filter(
      (a) =>
        (a.name && a.name.toLowerCase().includes(s)) ||
        (a.code && a.code.toLowerCase().includes(s)) ||
        (a.type && a.type.toLowerCase().includes(s))
    );
  }, [addonData, searchTerm]);

  const handleAddAddon = () => {
    setSelectedAddonData(null);
    setOpenAddModal(true);
  };

  const handleEditAddon = (addonId) => {
    console.log("handleEditAddon addonId:", addonId);
    const addon = addonData.find((x) => x.id === addonId);
    console.log("Found addon:", addon);

    if (!addon) return toast.error("Addon not found");

    //  pass raw data for modal prefill (no isEdit flag)
    setSelectedAddonData({
      id: addon.id,
      name: addon.name,
      code: addon.code,
      type: addon.type,
      description: addon.description,
      is_active: addon.isActive ? 1 : 0,
    });
    setOpenEditModal(true);
  };

  const handleDeleteAddon = (addonId) => {
    const addon = addonData.find((x) => x.id === addonId);
    if (!addon) return toast.error("Addon not found");
    setSelectedAddonData(addon);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedAddonData?.id) return;

    const addonId = selectedAddonData.id;
    console.log("Deleting addon:", addonId);

    //  uncomment when you have this action in slice
    // dispatch(decorationaddonDelete(addonId))
    //   .unwrap()
    //   .then((res) => {
    //     console.log("delete response:", res);
    //     toast.success(res?.message || "Deleted successfully!");
    //     fetchDecorationAddons();
    //     setOpenDeleteModal(false);
    //     setSelectedAddonData(null);
    //   })
    //   .catch((err) => {
    //     console.error("delete error:", err);
    //     toast.error("Failed to delete. Please try again.");
    //   });

    // temporary fallback if delete action not wired yet
    toast.info("Hook up decorationaddonDelete() in slice to enable delete.");
  };

  const handleToggleActive = (addonId, currentStatus) => {
    console.log("Toggling active status for addon:", addonId);
    const newStatus = !currentStatus;

    //  uncomment when you have this action in slice
    // dispatch(decorationaddonActiveToggle(addonId))
    //   .unwrap()
    //   .then((res) => {
    //     console.log("toggle response:", res);
    //     toast.success(`Addon ${newStatus ? "activated" : "deactivated"} successfully!`);
    //     fetchDecorationAddons();
    //   })
    //   .catch((err) => {
    //     console.error("toggle error:", err);
    //     toast.error("Failed to update status. Please try again.");
    //   });

    toast.info("Hook up decorationaddonActiveToggle() in slice to enable status toggle.");
  };

  const handleViewAddon = (addonId) => {
    console.log("Viewing addon:", addonId);
    navigate(`/decoration-details/${addonId}`);

    //  uncomment when you have this action in slice
    // dispatch(decorationaddonDetails(addonId))
    //   .unwrap()
    //   .then((res) => {
    //     console.log("details response:", res);
    //     toast.info("Fetched addon details (check console).");
    //   })
    //   .catch((err) => {
    //     console.error("details error:", err);
    //     toast.error("Failed to fetch addon details.");
    //   });

    const addon = addonData.find((x) => x.id === addonId);
    if (addon) toast.info(`Viewing: ${addon.name} (${addon.code})`);
  };

  const ActiveToggleRenderer = (params) => {
    const isActive = params.value;
    const addonId = params.data.id;

    return (
      <button
        onClick={() => handleToggleActive(addonId, isActive)}
        className={`px-4 py-1 rounded-full text-white text-xs font-semibold transition-colors ${
          isActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
        }`}
        style={{ fontSize: "12px" }}
      >
        {isActive ? "Active" : "Inactive"}
      </button>
    );
  };

  const ActionsRenderer = (params) => {
    const addonId = params.data.id;

    return (
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => handleViewAddon(addonId)}
          className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded-full transition-colors"
          title="View"
        >
          <FaEye size={14} />
        </button>

        <button
          onClick={() => handleEditAddon(addonId)}
          className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded-full transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>

        <button
          onClick={() => handleDeleteAddon(addonId)}
          className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-full transition-colors"
          title="Delete"
        >
          <FaTrash size={14} />
        </button>
      </div>
    );
  };

  const columnDefs = [
    { field: "name", headerName: "Name", sortable: true, filter: true, flex: 1 },
    { field: "code", headerName: "Code", sortable: true, filter: true, flex: 1 },
    { field: "type", headerName: "Type", sortable: true, filter: true, flex: 1 },
    { field: "description", headerName: "Description", sortable: true, filter: true, flex: 2 },
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

  if (loading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading decoration addons..." />
        </div>
      </div>
    );
  }

  if (error) {
    console.error("decaddon error:", error);
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4 gap-4 relative">
            <h1 className="text-2xl font-semibold">Decoration Addon</h1>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search addons by name, code, type..."
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
                    type="button"
                  >
                    <FaTimes className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddAddon}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add Decoration Addon
              </Button>
            </div>
          </div>

          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredAddonData.length} of {addonData.length} addons
              </p>
            </div>
          )}

          <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            <AgGridReact
              rowData={filteredAddonData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              domLayout="autoHeight"
              getRowHeight={() => 50}
            />
          </div>
        </div>

        {/* Add Modal */}
        {openAddModal && (
          <AddDecorationAddonModal
            openModal={openAddModal}
            setOpenModal={setOpenAddModal}
            addonData={null}
            onSaved={fetchDecorationAddons}
          />
        )}

        {/* Edit Modal */}
        {openEditModal && selectedAddonData && (
          <AddDecorationAddonModal
            openModal={openEditModal}
            setOpenModal={setOpenEditModal}
            addonData={selectedAddonData}
            onSaved={fetchDecorationAddons}
          />
        )}

        {/* Delete Confirm Modal */}
        {openDeleteModal && selectedAddonData && (
          <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)} size="md">
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Body>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedAddonData?.name}</span>?
              </p>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setOpenDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ManageDecorationAddon;
