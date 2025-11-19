import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { hatAdd, hatEdit, hatEditImageUpload } from "../../Reducer/EcommerceSlice";
import { useNavigate } from "react-router-dom";

const AddHatModal = ({ openModal, setOpenModal, onHatAdded, hatData, isEdit, supplierListData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Extract supplier options from supplierListData
  const supplierOptions = useMemo(() => {
    if (supplierListData?.data && Array.isArray(supplierListData.data)) {
      return supplierListData.data.map((item) => ({
        id: item.id,
        name: item.fields?.["Supplier Name"] || "",
      }));
    }
    return [];
  }, [supplierListData]);

  // Pre-fill form when hatData is provided (for edit mode)
  useEffect(() => {
    if (hatData && isEdit && openModal) {
      const newBasePrice = hatData.basePrice.replace("$", '');
      setValue("hat_name", hatData.hatName || "");
      setValue("supplier_style_code", hatData.supplierStyleCode || "");
      setValue("base_price", newBasePrice || "");
      setValue("min_order_qty", hatData.minOrderQty || "");
      setValue("supplier_name_id", hatData.supplier && hatData.supplier.length > 0 ? hatData.supplier[0] : "");
      setValue("active", hatData.active ?? false);
      // Set image preview if exists
      if (hatData.images) {
        setImagePreview(hatData.images);
      }
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [hatData, isEdit, openModal, setValue, reset]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload only JPEG, JPG, or PNG images", {
          position: "top-right",
          autoClose: 3000,
        });
        e.target.value = "";
        return;
      }

      // Validate file size (optional - limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          position: "top-right",
          autoClose: 3000,
        });
        e.target.value = "";
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API payload structure
      const newBasePrice = data.base_price.replace("$", '');
      
      // Create FormData
      const formData = new FormData();
      formData.append("hat_name", data.hat_name || "");
      formData.append("supplier_style_code", data.supplier_style_code || "");
      formData.append("base_price", newBasePrice || "");
      formData.append("min_order_qty", data.min_order_qty || "");
      formData.append("supplier_name_id", data.supplier_name_id || "");
      formData.append("active", data.active ?? true);
      
      // Append image if selected (for add mode) or if changed (for edit mode)
      if (selectedImage) {
        formData.append("images", selectedImage);
      } else if (isEdit && hatData?.images && !selectedImage) {
        // In edit mode, if no new image selected, keep existing image URL
        formData.append("images", hatData.images);
      }

      if (isEdit && hatData) {
        // Create FormData for rest of the fields (without image)
        const editFormData = new FormData();
        editFormData.append("hat_name", data.hat_name || "");
        editFormData.append("supplier_style_code", data.supplier_style_code || "");
        editFormData.append("base_price", newBasePrice || "");
        editFormData.append("min_order_qty", data.min_order_qty || "");
        editFormData.append("supplier_name_id", data.supplier_name_id || "");
        editFormData.append("active", data.active ?? true);

        // If new image is selected, upload it separately
        const promises = [];
        
        if (selectedImage) {
          // Create FormData for image upload
          const imageFormData = new FormData();
          imageFormData.append("images", selectedImage);
          
          // Dispatch image upload
          promises.push(
            dispatch(hatEditImageUpload({ id: hatData.id, userInput: imageFormData })).unwrap()
          );
        }

        // Always dispatch hat edit for rest of the fields
        promises.push(
          dispatch(hatEdit({ id: hatData.id, userInput: editFormData })).unwrap()
        );

        // Wait for all promises to complete
        Promise.all(promises)
          .then((responses) => {
            console.log("Hat updated successfully:", responses);
            toast.success("Hat updated successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            reset();
            setSelectedImage(null);
            setImagePreview(null);
            navigate(`/hat-details/${responses[0].data.id}`)
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the hats list
              if (onHatAdded) {
                onHatAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error updating hat:", error);
            toast.error("Failed to update hat. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        // Add new hat using Redux
        dispatch(hatAdd(formData))
          .unwrap()
          .then((response) => {
            console.log("Hat added successfully:", response);
            toast.success("Hat added successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            reset();
            setSelectedImage(null);
            setImagePreview(null);
            navigate(`/hat-details/${response.data.id}`);
            // Close modal after a short delay to ensure toast is visible
            setTimeout(() => {
              setOpenModal(false);
              // Call the callback to refresh the hats list
              if (onHatAdded) {
                onHatAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error adding hat:", error);
            toast.error("Failed to add hat. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    } catch (error) {
      console.error("Error saving hat:", error);
      toast.error(`Failed to ${isEdit ? "update" : "add"} hat. Please try again.`, {
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
      setSelectedImage(null);
      setImagePreview(null);
    }} size="md">
      <Modal.Header>
        {isEdit ? "Edit Hat" : "Add New Hat"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload Field */}
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Image
            </label>
            <input
              type="file"
              id="images"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">JPEG, JPG, or PNG only. Max 5MB</p>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Preview:</p>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      const fileInput = document.getElementById("images");
                      if (fileInput) fileInput.value = "";
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hat Name Field */}
          <div>
            <label
              htmlFor="hat_name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Hat Name *
            </label>
            <input
              type="text"
              id="hat_name"
              {...register("hat_name", { required: "Hat name is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.hat_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter hat name"
            />
            {errors.hat_name && (
              <p className="text-red-500 text-xs mt-1">{errors.hat_name.message}</p>
            )}
          </div>

          {/* Supplier Name ID Dropdown */}
          <div>
            <label
              htmlFor="supplier_name_id"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Supplier *
            </label>
            <select
              id="supplier_name_id"
              {...register("supplier_name_id", { required: "Supplier is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.supplier_name_id
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Select Supplier</option>
              {supplierOptions.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.supplier_name_id && (
              <p className="text-red-500 text-xs mt-1">{errors.supplier_name_id.message}</p>
            )}
          </div>

          {/* Supplier Style Code Field */}
          <div>
            <label
              htmlFor="supplier_style_code"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Supplier Style Code *
            </label>
            <input
              type="text"
              id="supplier_style_code"
              {...register("supplier_style_code", { required: "Supplier style code is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.supplier_style_code
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter supplier style code"
            />
            {errors.supplier_style_code && (
              <p className="text-red-500 text-xs mt-1">{errors.supplier_style_code.message}</p>
            )}
          </div>

          {/* Base Price Field */}
          <div>
            <label
              htmlFor="base_price"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Base Price *
            </label>
            <input
              type="text"
              id="base_price"
              {...register("base_price", { required: "Base price is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.base_price
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="e.g., 14"
            />
            {errors.base_price && (
              <p className="text-red-500 text-xs mt-1">{errors.base_price.message}</p>
            )}
          </div>

          {/* Min Order Qty Field */}
          <div>
            <label
              htmlFor="min_order_qty"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Min Order Qty *
            </label>
            <input
              type="text"
              id="min_order_qty"
              {...register("min_order_qty", { required: "Min order qty is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.min_order_qty
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter minimum order quantity"
            />
            {errors.min_order_qty && (
              <p className="text-red-500 text-xs mt-1">{errors.min_order_qty.message}</p>
            )}
          </div>

          {/* Active Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              {...register("active")}
              defaultChecked={hatData?.active ?? true}
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
                ? "Update Hat"
                : "Add Hat"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddHatModal;

