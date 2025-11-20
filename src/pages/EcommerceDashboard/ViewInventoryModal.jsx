import { useEffect } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { inventorySingle, inventoryShowHide } from "../../Reducer/EcommerceSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../../components/Loader";

const ViewInventoryModal = ({ openModal, setOpenModal, variantSizeId, onInventoryUpdated }) => {
  const dispatch = useDispatch();
  const { inventorySingleData, inventorySingleloading } = useSelector((state) => state.ecom);

  useEffect(() => {
    if (openModal && variantSizeId) {
      dispatch(inventorySingle(variantSizeId))
        .unwrap()
        .catch((error) => {
          console.error("Error fetching inventory:", error);
          toast.error("Failed to fetch inventory details.");
        });
    }
  }, [openModal, variantSizeId, dispatch]);

  const handleToggleVisibility = (inventoryId, currentVisibility) => {
    const payload = {
      inventory_id: inventoryId,
      is_checked: currentVisibility === "Yes" ? 1 : 0,
    };

    dispatch(inventoryShowHide(payload))
      .unwrap()
      .then((response) => {
        console.log("Inventory visibility changed successfully:", response);
        toast.success(`Inventory ${currentVisibility === "Yes" ? "hidden" : "shown"} successfully!`);
        // Refresh inventory data
        if (variantSizeId) {
          dispatch(inventorySingle(variantSizeId));
        }
        if (onInventoryUpdated) {
          onInventoryUpdated();
        }
      })
      .catch((error) => {
        console.error("Error changing inventory visibility:", error);
        toast.error("Failed to change inventory visibility. Please try again.");
      });
  };

  const inventoryData = inventorySingleData?.data && Array.isArray(inventorySingleData.data) && inventorySingleData.data.length > 0
    ? inventorySingleData.data[0]
    : null;

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
      <Modal.Header>Inventory Details</Modal.Header>
      <Modal.Body>
        {inventorySingleloading ? (
          <div className="flex justify-center items-center py-8">
            <Loader size="medium" text="Loading..." />
          </div>
        ) : inventoryData ? (
          <div className="space-y-4">
            {/* Inventory ID */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Inventory ID</label>
              <p className="text-lg text-gray-800 mt-1">{inventoryData.id || inventoryData.inventoryId || "N/A"}</p>
            </div>

            {/* Quantity Available */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Quantity Available</label>
              <p className="text-lg text-gray-800 mt-1">{inventoryData.qtyAvailable || inventoryData.qty_available || 0}</p>
            </div>

            {/* Override Quantity */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Override Quantity</label>
              <p className="text-lg text-gray-800 mt-1">{inventoryData.overrideQty || inventoryData.override_qty || 0}</p>
            </div>

            {/* Effective Quantity */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Effective Quantity</label>
              <p className="text-lg text-gray-800 mt-1">{inventoryData.effectiveQty || inventoryData.effective_qty || 0}</p>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <p className="text-lg text-gray-800 mt-1">{inventoryData.status || "N/A"}</p>
            </div>

            {/* Source */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Source</label>
              <p className="text-lg text-gray-800 mt-1">{inventoryData.source || "N/A"}</p>
            </div>

            {/* Visibility Toggle */}
            {/* <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Visibility</label>
              <button
                onClick={() => handleToggleVisibility(inventoryData.id || inventoryData.inventoryId, inventoryData.visible)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  inventoryData.visible === "Yes"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {inventoryData.visible === "Yes" ? (
                  <>
                    <FaEye className="w-4 h-4" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <FaEyeSlash className="w-4 h-4" />
                    <span>Hidden</span>
                  </>
                )}
              </button>
            </div> */}

            {/* Created At */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Created At</label>
              <p className="text-sm text-gray-700 mt-1">
                {inventoryData.createdAt
                  ? new Date(inventoryData.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>

            {/* Updated At */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Updated At</label>
              <p className="text-sm text-gray-700 mt-1">
                {inventoryData.updatedAt
                  ? new Date(inventoryData.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No inventory data available</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewInventoryModal;

