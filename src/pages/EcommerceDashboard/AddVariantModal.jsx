import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { addVarient, updateVarient, updateVarientImage } from "../../Reducer/EcommerceSlice";

const AddVariantModal = ({ openModal, setOpenModal, onVariantAdded, hatId, variantData, isEdit }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Watch color code for live preview
  const colorCode = watch("color_code") || "#ffffff";

  // Pre-fill form when variantData is provided (for edit mode)
  useEffect(() => {
    if (variantData && isEdit && openModal) {
      setValue("variant_name", variantData.variantName || "");
      setValue("color", variantData.color || "");
      setValue("color_code", variantData.colorCode || "");
      setValue("active", variantData.active ?? true);
      // Set image preview if exists
      if (variantData.images) {
        setImagePreview(variantData.images);
      }
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [variantData, isEdit, openModal, setValue, reset]);

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
      if (isEdit && variantData) {
        // Edit mode - separate image update and variant update
        const promises = [];
        
        // If new image is selected, upload it separately
        if (selectedImage) {
          const imageFormData = new FormData();
          imageFormData.append("images", selectedImage);
          
          promises.push(
            dispatch(updateVarientImage({ id: variantData.id, userInput: imageFormData })).unwrap()
          );
        }

        // Create FormData for variant update (without image)
        const editFormData = new FormData();
        editFormData.append("variant_name", data.variant_name || "");
        editFormData.append("color", data.color || "");
        editFormData.append("color_code", data.color_code || "");
        editFormData.append("active", data.active ?? true);
        
        // Always dispatch variant update
        promises.push(
          dispatch(updateVarient({ id: variantData.id, userInput: editFormData })).unwrap()
        );

        // Wait for all promises to complete
        Promise.all(promises)
          .then((responses) => {
            console.log("Variant updated successfully:", responses);
            toast.success("Variant updated successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            reset();
            setSelectedImage(null);
            setImagePreview(null);
            setTimeout(() => {
              setOpenModal(false);
              if (onVariantAdded) {
                onVariantAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error updating variant:", error);
            toast.error("Failed to update variant. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        // Add mode
        const formData = new FormData();
        formData.append("hat", hatId || "");
        formData.append("variant_name", data.variant_name || "");
        formData.append("color", data.color || "");
        formData.append("color_code", data.color_code || "");
        formData.append("active", data.active ?? true);
        
        // Append image if selected
        if (selectedImage) {
          formData.append("images", selectedImage);
        }

        // Dispatch add variant action
        dispatch(addVarient(formData))
          .unwrap()
          .then((response) => {
            console.log("Variant added successfully:", response);
            toast.success("Variant added successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            reset();
            setSelectedImage(null);
            setImagePreview(null);
            setTimeout(() => {
              setOpenModal(false);
              if (onVariantAdded) {
                onVariantAdded();
              }
            }, 100);
          })
          .catch((error) => {
            console.error("Error adding variant:", error);
            toast.error("Failed to add variant. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    } catch (error) {
      console.error("Error saving variant:", error);
      toast.error(`Failed to ${isEdit ? "update" : "add"} variant. Please try again.`, {
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
        {isEdit ? "Edit Variant" : "Add New Variant"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload Field - Moved to top */}
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

          {/* Variant Name Field */}
          <div>
            <label
              htmlFor="variant_name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Variant Name *
            </label>
            <input
              type="text"
              id="variant_name"
              {...register("variant_name", { required: "Variant name is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.variant_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter variant name"
            />
            {errors.variant_name && (
              <p className="text-red-500 text-xs mt-1">{errors.variant_name.message}</p>
            )}
          </div>

          {/* Color Field */}
          <div>
            <label
              htmlFor="color"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Color *
            </label>
            <input
              type="text"
              id="color"
              {...register("color", { required: "Color is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.color
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter color name (e.g., Black, Red)"
            />
            {errors.color && (
              <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>
            )}
          </div>

          {/* Color Code Field */}
          <div>
            <label
              htmlFor="color_code"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Color Code *
            </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="color_code"
                  {...register("color_code", { 
                    required: "Color code is required",
                    pattern: {
                      value: /^#[0-9A-Fa-f]{6}$/,
                      message: "Color code must be a valid hex code (e.g., #000000)"
                    }
                  })}
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.color_code
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="#000000"
                />
                <div
                  className="w-12 h-10 border border-gray-300 rounded flex-shrink-0"
                  style={{ 
                    backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(colorCode) ? colorCode : "#ffffff"
                  }}
                  title="Color preview"
                />
              </div>
            {errors.color_code && (
              <p className="text-red-500 text-xs mt-1">{errors.color_code.message}</p>
            )}
          </div>

          {/* Active Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              {...register("active")}
              defaultChecked={variantData?.active ?? true}
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
                setSelectedImage(null);
                setImagePreview(null);
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
                ? (isEdit ? "Updating..." : "Adding...")
                : (isEdit ? "Update Variant" : "Add Variant")}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddVariantModal;

