import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { addSupplier, supplierEdit } from "../../Reducer/EcommerceSlice";

const AddSupplierModal = ({ openModal, setOpenModal, onSupplierAdded, supplierData, isEdit }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when supplierData is provided (for edit mode)
  useEffect(() => {
    if (supplierData && isEdit && openModal) {
      setValue("name", supplierData.name || "");
      setValue("code", supplierData.code || "");
      setValue("api_base_url", supplierData.fields?.["API Base URL"] || "");
      setValue("auth_type", supplierData.fields?.["Auth Type"] || "");
      setValue("api_key", supplierData.fields?.["API Key"] || "");
      setValue("is_active", supplierData.isActive ?? false);
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
    }
  }, [supplierData, isEdit, openModal, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API payload structure
      const payload = {
        "supplier_name": data.name,
        "code": data.code,
        "api_base_url": data.api_base_url || "",
        "auth_type": data.auth_type || "",
        "api_key": data.api_key || "",
        "is_active": data.is_active ?? true,
      };

      if (isEdit && supplierData) {
        // Update existing supplier using Redux
        dispatch(supplierEdit({ id: supplierData.id, userInput: payload }))
          .unwrap()
          .then((response) => {
            console.log("Supplier updated successfully:", response);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Supplier added successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to add supplier", {
                position: "top-right",
                autoClose: 3000,
              });
            }
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the suppliers list
              if (onSupplierAdded) {
                onSupplierAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error updating supplier:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update supplier. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        // Add new supplier using Redux
        dispatch(addSupplier(payload))
          .unwrap()
          .then((response) => {
            console.log("Supplier added successfully:", response);
            if(response?.status_code === 200 || response?.status_code === 201){
              toast.success(response?.message || "Supplier updated successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            }else if(response?.status_code === 422){
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            }else {
              toast.error(response?.message || "Failed to update supplier", {
                position: "top-right",
                autoClose: 3000,
              });
            }
            reset();
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the suppliers list
              if (onSupplierAdded) {
                onSupplierAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error adding supplier:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add supplier. Please try again.";
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
      console.error("Error saving supplier:", error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEdit ? "update" : "add"} supplier. Please try again.`;
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
        {isEdit ? "Edit Supplier" : "Add New Supplier"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter supplier name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Code Field */}
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Code *
            </label>
            <input
              type="text"
              id="code"
              {...register("code", { required: "Code is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.code
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter supplier code"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* API Base URL Field */}
          <div>
            <label
              htmlFor="api_base_url"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              API Base URL
            </label>
            <input
              type="url"
              id="api_base_url"
              {...register("api_base_url")}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.api_base_url
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="https://api.example.com"
            />
            {errors.api_base_url && (
              <p className="text-red-500 text-xs mt-1">{errors.api_base_url.message}</p>
            )}
          </div>

          {/* Auth Type Field */}
          <div>
            <label
              htmlFor="auth_type"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Auth Type
            </label>
            <input
              type="text"
              id="auth_type"
              {...register("auth_type")}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.auth_type
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="e.g., API Key, OAuth, Bearer Token"
            />
            {errors.auth_type && (
              <p className="text-red-500 text-xs mt-1">{errors.auth_type.message}</p>
            )}
          </div>

          {/* API Key Field */}
          <div>
            <label
              htmlFor="api_key"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              API Key
            </label>
            <input
              type="text"
              id="api_key"
              {...register("api_key")}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.api_key
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter API key"
            />
            {errors.api_key && (
              <p className="text-red-500 text-xs mt-1">{errors.api_key.message}</p>
            )}
          </div>

          {/* Is Active Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              defaultChecked={supplierData?.isActive ?? true}
              {...register("is_active")}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm font-semibold text-gray-700"
            >
              Is Active
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
                ? "Update Supplier"
                : "Add Supplier"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddSupplierModal;

