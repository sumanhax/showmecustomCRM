import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { pricetierAdd, pricetierUpdate, decorationList } from "../../Reducer/EcommerceSlice";

const AddPriceTierModal = ({ openModal, setOpenModal, onPriceTierAdded, priceTierData, isEdit, hatId }) => {
  const dispatch = useDispatch();
  const { decorationListData } = useSelector((state) => state.ecom);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch decoration list when modal opens
  useEffect(() => {
    if (openModal) {
      dispatch(decorationList());
    }
  }, [openModal, dispatch]);

  // Extract decoration options from decorationListData
  const decorationOptions = useMemo(() => {
    if (decorationListData?.data?.data && Array.isArray(decorationListData.data.data)) {
      return decorationListData.data.data.map((item) => ({
        id: item.id,
        decorationMethod: item.fields?.["Decoration Method"] || "",
      }));
    }
    return [];
  }, [decorationListData]);

  // Pre-fill form when priceTierData is provided (for edit mode)
  useEffect(() => {
    if (priceTierData && isEdit && openModal) {
      setValue("min_qty", priceTierData.min_qty || "");
      setValue("max_qty", priceTierData.max_qty || "");
      setValue("unit_price", priceTierData.unit_price || "");
      setValue("notes", priceTierData.notes || "");
      setValue("active", priceTierData.active ?? true);
      setValue("decoration_method_id", priceTierData.id || "");
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
      setValue("active", true);
    }
  }, [priceTierData, isEdit, openModal, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API payload structure
      const payload = {
        hat_record_id: hatId || "",
        min_qty: parseInt(data.min_qty) || 0,
        max_qty: parseInt(data.max_qty) || 0,
        unit_price: parseFloat(data.unit_price) || 0,
        notes: data.notes || "",
        active: data.active ?? true,
        "Decoration Method": data.decoration_method_id || "",
      };

      if (isEdit && priceTierData) {
        // Update price tier - API expects id in URL and payload in body
        dispatch(pricetierUpdate({ id: priceTierData.id, userInput: payload }))
          .unwrap()
          .then((response) => {
            console.log("Price tier updated successfully:", response);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Price tier updated successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to update price tier", {
                position: "top-right",
                autoClose: 3000,
              });
            }
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the price tier list
              if (onPriceTierAdded) {
                onPriceTierAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error(error?.response?.data?.message, error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update price tier. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        // Add new price tier
        dispatch(pricetierAdd(payload))
          .unwrap()
          .then((response) => {
            console.log("Price tier added successfully:", response);
           if(response?.status_code === 200 || response?.status_code === 201){
            toast.success(response?.message || "Price tier added successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
           }else if(response?.status_code === 422){
            toast.error(response?.message || "Validation error occurred", {
              position: "top-right",
              autoClose: 3000,
            });
           }else {
            toast.error(response?.message || "Failed to add price tier", {
              position: "top-right",
              autoClose: 3000,
            });
           }
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the price tier list
              if (onPriceTierAdded) {
                onPriceTierAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error(error?.response?.data?.message, error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add price tier. Please try again.";
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
      console.error("Error saving price tier:", error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "add"} price tier. Please try again.`;
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
        {isEdit ? "Edit Price Tier" : "Add New Price Tier"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Min Qty Field */}
          <div>
            <label
              htmlFor="min_qty"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Min Quantity *
            </label>
            <input
              type="number"
              id="min_qty"
              {...register("min_qty", { 
                required: "Min quantity is required",
                min: { value: 0, message: "Min quantity must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.min_qty
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter minimum quantity"
            />
            {errors.min_qty && (
              <p className="text-red-500 text-xs mt-1">{errors.min_qty.message}</p>
            )}
          </div>

          {/* Max Qty Field */}
          <div>
            <label
              htmlFor="max_qty"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Max Quantity *
            </label>
            <input
              type="number"
              id="max_qty"
              {...register("max_qty", { 
                required: "Max quantity is required",
                min: { value: 0, message: "Max quantity must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.max_qty
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter maximum quantity"
            />
            {errors.max_qty && (
              <p className="text-red-500 text-xs mt-1">{errors.max_qty.message}</p>
            )}
          </div>

          {/* Unit Price Field */}
          <div>
            <label
              htmlFor="unit_price"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Unit Price *
            </label>
            <input
              type="number"
              id="unit_price"
              step="0.01"
              {...register("unit_price", { 
                required: "Unit price is required",
                min: { value: 0, message: "Unit price must be 0 or greater" }
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.unit_price
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter unit price"
            />
            {errors.unit_price && (
              <p className="text-red-500 text-xs mt-1">{errors.unit_price.message}</p>
            )}
          </div>

          {/* Decoration Method Field */}
          <div>
            <label
              htmlFor="decoration_method_id"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Decoration Method
            </label>
            <select
              id="decoration_method_id"
              {...register("decoration_method_id")}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.decoration_method_id
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Select Decoration Method</option>
              {decorationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.decorationMethod}
                </option>
              ))}
            </select>
            {errors.decoration_method_id && (
              <p className="text-red-500 text-xs mt-1">{errors.decoration_method_id.message}</p>
            )}
          </div>

          {/* Notes Field */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              {...register("notes")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notes (optional)"
            />
          </div>

          {/* Active Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              {...register("active")}
              defaultChecked={priceTierData?.active ?? true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="active"
              className="ml-2 text-sm font-semibold text-gray-700"
            >
              Active
            </label>
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
                ? "Update Price Tier"
                : "Add Price Tier"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPriceTierModal;

