import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { addVarientSize } from "../../Reducer/EcommerceSlice";

const AddVariantSizeModal = ({ openModal, setOpenModal, onSizeAdded, variantId }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Size options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (openModal) {
      reset();
    }
  }, [openModal, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("variant_id", variantId || "");
      formData.append("size", data.size || "");
      formData.append("supplier_sku", data.supplier_sku || "");
      formData.append("upc", data.upc || "");

      // Dispatch add variant size action
      dispatch(addVarientSize(formData))
        .unwrap()
          .then((response) => {
            console.log("Variant size added successfully:", response);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Variant size added successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to add variant size", {
                position: "top-right",
                autoClose: 3000,
              });
            }
            reset();
          // Close modal after a short delay to ensure toast is visible
          setTimeout(() => {
            setOpenModal(false);
            // Call the callback to refresh the hat details
            if (onSizeAdded) {
              onSizeAdded();
            }
          }, 100);
        })
          .catch((error) => {
            console.error("Error adding variant size:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add variant size. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error("Error saving variant size:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add variant size. Please try again.";
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
        Add Variant Size
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Size Dropdown */}
          <div>
            <label
              htmlFor="size"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Size *
            </label>
            <select
              id="size"
              {...register("size", { required: "Size is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.size
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Select Size</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.size && (
              <p className="text-red-500 text-xs mt-1">{errors.size.message}</p>
            )}
          </div>

          {/* Supplier SKU Field */}
          <div>
            <label
              htmlFor="supplier_sku"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Supplier SKU *
            </label>
            <input
              type="text"
              id="supplier_sku"
              {...register("supplier_sku", { required: "Supplier SKU is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.supplier_sku
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter supplier SKU"
            />
            {errors.supplier_sku && (
              <p className="text-red-500 text-xs mt-1">{errors.supplier_sku.message}</p>
            )}
          </div>

          {/* UPC Field */}
          <div>
            <label
              htmlFor="upc"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              UPC *
            </label>
            <input
              type="text"
              id="upc"
              {...register("upc", { required: "UPC is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.upc
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter UPC"
            />
            {errors.upc && (
              <p className="text-red-500 text-xs mt-1">{errors.upc.message}</p>
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
              {isSubmitting ? "Adding..." : "Add Size"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddVariantSizeModal;

