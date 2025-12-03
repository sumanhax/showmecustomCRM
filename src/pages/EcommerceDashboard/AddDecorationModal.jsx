import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { decorationAdd, decorationUpdate } from "../../Reducer/EcommerceSlice";

const AddDecorationModal = ({ openModal, setOpenModal, onDecorationAdded, decorationData, isEdit }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when decorationData is provided (for edit mode)
  useEffect(() => {
    if (decorationData && isEdit && openModal) {
      setValue("decoration", decorationData.decoration || "");
      setValue("surcharge", decorationData.surcharge || "");
      setValue("lead_time", decorationData.lead_time || "");
      setValue("setup_fee", decorationData.setup_fee || "");
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
    }
  }, [decorationData, isEdit, openModal, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API payload structure
      const payload = {
        decoration: data.decoration || "",
        surcharge: parseFloat(data.surcharge) || 0,
        lead_time: parseInt(data.lead_time) || 0,
        setup_fee: parseFloat(data.setup_fee) || 0,
      };

      if (isEdit && decorationData) {
        // Update decoration
        dispatch(decorationUpdate({ id: decorationData.id, userInput: payload }))
          .unwrap()
          .then((response) => {
            console.log("Decoration updated successfully:", response);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Decoration updated successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to update decoration", {
                position: "top-right",
                autoClose: 3000,
              });
            }
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the decorations list
              if (onDecorationAdded) {
                onDecorationAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error updating decoration:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update decoration. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        // Add new decoration
        dispatch(decorationAdd(payload))
          .unwrap()
          .then((response) => {
            console.log("Decoration added successfully:", response?.status_code);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Decoration added successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to add decoration", {
                position: "top-right",
                autoClose: 3000,
              });
            }
           
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the decorations list
              if (onDecorationAdded) {
                onDecorationAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error adding decoration:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add decoration. Please try again.";
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
      console.error("Error saving decoration:", error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "add"} decoration. Please try again.`;
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
        {isEdit ? "Edit Decoration" : "Add New Decoration"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Decoration Field */}
          <div>
            <label
              htmlFor="decoration"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Decoration *
            </label>
            <input
              type="text"
              id="decoration"
              {...register("decoration", { required: "Decoration is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.decoration
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter decoration name"
            />
            {errors.decoration && (
              <p className="text-red-500 text-xs mt-1">{errors.decoration.message}</p>
            )}
          </div>

          {/* Surcharge Field */}
          <div>
            <label
              htmlFor="surcharge"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Surcharge *
            </label>
            <input
              type="number"
              id="surcharge"
              step="0.01"
              {...register("surcharge", { 
                required: "Surcharge is required",
                min: { value: 0, message: "Surcharge must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.surcharge
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter surcharge amount"
            />
            {errors.surcharge && (
              <p className="text-red-500 text-xs mt-1">{errors.surcharge.message}</p>
            )}
          </div>

          {/* Lead Time Field */}
          <div>
            <label
              htmlFor="lead_time"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Lead Time *
            </label>
            <input
              type="number"
              id="lead_time"
              {...register("lead_time", { 
                required: "Lead time is required",
                min: { value: 0, message: "Lead time must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.lead_time
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter lead time (days)"
            />
            {errors.lead_time && (
              <p className="text-red-500 text-xs mt-1">{errors.lead_time.message}</p>
            )}
          </div>

          {/* Setup Fee Field */}
          <div>
            <label
              htmlFor="setup_fee"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Setup Fee *
            </label>
            <input
              type="number"
              id="setup_fee"
              step="0.01"
              {...register("setup_fee", { 
                required: "Setup fee is required",
                min: { value: 0, message: "Setup fee must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.setup_fee
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter setup fee amount"
            />
            {errors.setup_fee && (
              <p className="text-red-500 text-xs mt-1">{errors.setup_fee.message}</p>
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
                ? "Update Decoration"
                : "Add Decoration"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDecorationModal;

