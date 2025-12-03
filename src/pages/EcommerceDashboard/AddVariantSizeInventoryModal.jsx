import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { inventoryAdd, inventoryUpdate } from "../../Reducer/EcommerceSlice";

const AddVariantSizeInventoryModal = ({ openModal, setOpenModal, onInventoryAdded, inventoryData, isEdit, variantSizeId }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when inventoryData is provided (for edit mode)
  useEffect(() => {
    if (inventoryData && isEdit && openModal) {
      setValue("qty_available", inventoryData.qtyAvailable || inventoryData.qty_available || "");
      setValue("override_qty", inventoryData.overrideQty || inventoryData.override_qty || "");
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
    }
  }, [inventoryData, isEdit, openModal, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API payload structure
      const payload = {
        variant_size_id: variantSizeId || "",
        qty_available: parseInt(data.qty_available) || 0,
        override_qty: parseInt(data.override_qty) || 0,
      };

      if (isEdit && inventoryData) {
        // Update inventory - need to include inventory_id
        const updatePayload = {
          ...payload,
          inventory_id: inventoryData.inventoryId || inventoryData.inventory_id,
        };
        dispatch(inventoryUpdate(updatePayload))
          .unwrap()
          .then((response) => {
            console.log("Inventory updated successfully:", response);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Inventory updated successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to update inventory", {
                position: "top-right",
                autoClose: 3000,
              });
            }
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the inventory list
              if (onInventoryAdded) {
                onInventoryAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error updating inventory:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update inventory. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        // Add new inventory
        dispatch(inventoryAdd(payload))
          .unwrap()
          .then((response) => {
            console.log("Inventory added successfully:", response);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Inventory added successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to add inventory", {
                position: "top-right",
                autoClose: 3000,
              });
            }
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the inventory list
              if (onInventoryAdded) {
                onInventoryAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error adding inventory:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add inventory. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    } catch (error) {
      console.error("Error saving inventory:", error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "add"} inventory. Please try again.`;
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={openModal} onClose={() => {
      setOpenModal(false);
      reset();
    }} size="md">
      <Modal.Header>
        {isEdit ? "Edit Inventory" : "Add New Inventory"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Qty Available Field */}
          <div>
            <label
              htmlFor="qty_available"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Quantity Available *
            </label>
            <input
              type="number"
              id="qty_available"
              {...register("qty_available", { 
                required: "Quantity available is required",
                min: { value: 0, message: "Quantity must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.qty_available
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter quantity available"
            />
            {errors.qty_available && (
              <p className="text-red-500 text-xs mt-1">{errors.qty_available.message}</p>
            )}
          </div>

          {/* Override Qty Field */}
          <div>
            <label
              htmlFor="override_qty"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Override Quantity *
            </label>
            <input
              type="number"
              id="override_qty"
              {...register("override_qty", { 
                required: "Override quantity is required",
                min: { value: 0, message: "Override quantity must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.override_qty
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter override quantity"
            />
            {errors.override_qty && (
              <p className="text-red-500 text-xs mt-1">{errors.override_qty.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setOpenModal(false);
                reset();
              }}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? "Processing..."
                : isEdit
                ? "Update Inventory"
                : "Add Inventory"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddVariantSizeInventoryModal;

