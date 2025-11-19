import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { logoAdd, logoUpdate } from "../../Reducer/EcommerceSlice";

const AddLogoModal = ({ openModal, setOpenModal, onLogoAdded, logoData, isEdit }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when logoData is provided (for edit mode)
  useEffect(() => {
    if (logoData && isEdit && openModal) {
      setValue("placement", logoData.placement || "");
      setValue("sur_price", logoData.sur_price || "");
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
    }
  }, [logoData, isEdit, openModal, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API payload structure
      const payload = {
        placement: data.placement || "",
        sur_price: parseFloat(data.sur_price) || 0,
      };

      if (isEdit && logoData) {
        // Update logo
        dispatch(logoUpdate({ id: logoData.id, userInput: payload }))
          .unwrap()
          .then((response) => {
            console.log("Logo updated successfully:", response);
            toast.success("Logo updated successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the logos list
              if (onLogoAdded) {
                onLogoAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error updating logo:", error);
            toast.error("Failed to update logo. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        // Add new logo
        dispatch(logoAdd(payload))
          .unwrap()
          .then((response) => {
            console.log("Logo added successfully:", response);
            toast.success("Logo added successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the logos list
              if (onLogoAdded) {
                onLogoAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error adding logo:", error);
            toast.error("Failed to add logo. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    } catch (error) {
      console.error("Error saving logo:", error);
      toast.error(`Failed to ${isEdit ? "update" : "add"} logo. Please try again.`, {
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
        {isEdit ? "Edit Logo" : "Add New Logo"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Placement Field */}
          <div>
            <label
              htmlFor="placement"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Placement *
            </label>
            <input
              type="text"
              id="placement"
              {...register("placement", { required: "Placement is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.placement
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter placement (e.g., front, back)"
            />
            {errors.placement && (
              <p className="text-red-500 text-xs mt-1">{errors.placement.message}</p>
            )}
          </div>

          {/* Sur Price Field */}
          <div>
            <label
              htmlFor="sur_price"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Sur Price *
            </label>
            <input
              type="number"
              id="sur_price"
              step="0.01"
              {...register("sur_price", { 
                required: "Sur price is required",
                min: { value: 0, message: "Sur price must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.sur_price
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter sur price amount"
            />
            {errors.sur_price && (
              <p className="text-red-500 text-xs mt-1">{errors.sur_price.message}</p>
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
                ? "Update Logo"
                : "Add Logo"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddLogoModal;

