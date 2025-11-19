import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { inventoryAdd, inventoryUpdate } from "../../Reducer/EcommerceSlice";

const AddInventoryModal = ({ openModal, setOpenModal, onInventoryAdded, inventoryData, isEdit }) => {
  const dispatch = useDispatch();
  const { hatListData } = useSelector((state) => state.ecom);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract all variant sizes from hatListData
  const variantSizeOptions = useMemo(() => {
    const options = [];
    if (hatListData?.data && Array.isArray(hatListData.data)) {
      hatListData.data.forEach((hat) => {
        if (hat.productVariants && Array.isArray(hat.productVariants)) {
          hat.productVariants.forEach((variant) => {
            if (variant.variantSizes && Array.isArray(variant.variantSizes)) {
              variant.variantSizes.forEach((variantSize) => {
                options.push({
                  id: variantSize.id,
                  label: variantSize.variantSize || `${variant.color || ""}-${variantSize.size || ""}`,
                });
              });
            }
          });
        }
      });
    }
    return options;
  }, [hatListData]);

  // Pre-fill form when inventoryData is provided (for edit mode)
  useEffect(() => {
    if (inventoryData && isEdit && openModal) {
      setValue("variant_size_id", inventoryData.variant_size_id || "");
      setValue("qty_available", inventoryData.qty_available || "");
      setValue("override_qty", inventoryData.override_qty || "");
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
        variant_size_id: data.variant_size_id || "",
        qty_available: parseInt(data.qty_available) || 0,
        override_qty: parseInt(data.override_qty) || 0,
      };

      if (isEdit && inventoryData) {
        // Update inventory - need to include inventory_id
        const updatePayload = {
          ...payload,
          inventory_id: inventoryData.inventory_id,
        };
        dispatch(inventoryUpdate(updatePayload))
          .unwrap()
          .then((response) => {
            console.log("Inventory updated successfully:", response);
            toast.success("Inventory updated successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
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
            toast.error("Failed to update inventory. Please try again.", {
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
            toast.success("Inventory added successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
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
            toast.error("Failed to add inventory. Please try again.", {
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
      toast.error(`Failed to ${isEdit ? "update" : "add"} inventory. Please try again.`, {
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
          {/* Variant Size ID Dropdown */}
          <div>
            <label
              htmlFor="variant_size_id"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Variant Size *
            </label>
            <select
              id="variant_size_id"
              {...register("variant_size_id", { required: "Variant size is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.variant_size_id
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={isEdit}
            >
              <option value="">Select Variant Size</option>
              {variantSizeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.variant_size_id && (
              <p className="text-red-500 text-xs mt-1">{errors.variant_size_id.message}</p>
            )}
            {variantSizeOptions.length === 0 && (
              <p className="text-yellow-500 text-xs mt-1">No variant sizes available. Please ensure hats are loaded.</p>
            )}
          </div>

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

export default AddInventoryModal;

