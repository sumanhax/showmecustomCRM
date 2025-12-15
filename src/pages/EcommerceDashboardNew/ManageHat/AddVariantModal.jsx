import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { brandAdd, hatColorAdd } from "../../../Reducer/EcommerceNewSlice";
import { useNavigate } from "react-router-dom";

const AddVariantModal = ({
  openModal,
  setOpenModal,
  onVariantAdded,
  hatColorSingleData,
  isEdit,
  hatId
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Pre-fill form when hatColorSingleData is provided (for edit mode)
  useEffect(() => {
    if (hatColorSingleData && isEdit && openModal) {
      setValue("name", hatColorSingleData.name || "");
      setValue("color_code", hatColorSingleData.color_code || "");
      setValue(
        "is_active",
        hatColorSingleData.is_active === 1 || hatColorSingleData.is_active === true
      );

      // Set image preview if exists
      if (hatColorSingleData.primary_image_url) {
        setImagePreview(hatColorSingleData.primary_image_url);
      }
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [hatColorSingleData, isEdit, openModal, setValue, reset]);

  // Handle image file selection (primary_image_url)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload only JPEG, JPG, or PNG images", {
          position: "top-right",
          autoClose: 3000,
        });
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          position: "top-right",
          autoClose: 3000,
        });
        e.target.value = "";
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result );
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // === create payload that matches: name, color_code, primary_image_url, is_active ===
      const formData = new FormData();
      formData.append("hat_style_id",hatId)
      formData.append("name", data.name || "");
      formData.append("color_code", data.color_code || "");
      formData.append("is_active", data.is_active ? 1 : 0);

      if (selectedImage) {
        // send uploaded file as primary_image_url
        formData.append("image", selectedImage);
      } else if (isEdit && hatColorSingleData?.primary_image_url && !selectedImage) {
        // keep existing image on edit if user doesn't change it
        formData.append("image", hatColorSingleData.primary_image_url);
      }

      if (isEdit && hatColorSingleData) {
        // ----- EDIT FLOW (same structure, updated keys) -----
        const editFormData = new FormData();
        editFormData.append("name", data.name || "");
        editFormData.append("color_code", data.color_code || "");
        editFormData.append("is_active", data.is_active ? 1 : 0);

        const promises = [];

        if (selectedImage) {
          const imageFormData = new FormData();
          imageFormData.append("primary_image_url", selectedImage);
          // assuming you still have hatEditImageUpload & hatEdit actions
          promises.push(
            dispatch(
              hatEditImageUpload({ id: hatColorSingleData.id, userInput: imageFormData })
            ).unwrap()
          );
        }

        promises.push(
          dispatch(hatEdit({ id: hatColorSingleData.id, userInput: editFormData })).unwrap()
        );

        Promise.all(promises)
          .then((responses) => {
            const response = responses[responses.length - 1];

            if (response?.status_code === 200 || response?.status_code === 201) {
              toast.success(response?.message || "Updated successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            } else if (response?.status_code === 422) {
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            } else {
              toast.error(response?.message || "Failed to update", {
                position: "top-right",
                autoClose: 3000,
              });
            }

            reset();
            setSelectedImage(null);
            setImagePreview(null);
            navigate(`/brand`);

            setTimeout(() => {
              setOpenModal(false);
              if (onHatAdded) onHatAdded();
            }, 100);
          })
          .catch((error) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Failed to update. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => setIsSubmitting(false));
      } else {
        // ----- ADD FLOW (unchanged, just new keys) -----
        dispatch(hatColorAdd(formData))
          .unwrap()
          .then((response) => {
            if (response?.status_code === 200 || response?.status_code === 201) {
              toast.success(response?.message || "Added successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            } else if (response?.status_code === 422) {
              toast.error(response?.message || "Validation error occurred", {
                position: "top-right",
                autoClose: 3000,
              });
            } else {
              toast.error(response?.message || "Failed to add", {
                position: "top-right",
                autoClose: 3000,
              });
            }

            reset();
            setSelectedImage(null);
            setImagePreview(null);
            
            setTimeout(() => {
              setOpenModal(false);
              if (onHatAdded) onHatAdded();
            }, 100);
            navigate(`/hat-details/${hatId}`);
          })
          .catch((error) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Failed to add. Please try again.";
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .finally(() => setIsSubmitting(false));
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${isEdit ? "update" : "add"}. Please try again.`;
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={openModal}
      onClose={() => {
        setOpenModal(false);
        reset();
        setSelectedImage(null);
        setImagePreview(null);
      }}
      size="md"
    >
      <Modal.Header>{isEdit ? "Edit Hat Color" : "Add New Hat Color"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Primary Image Upload (primary_image_url) */}
          <div>
            <label
              htmlFor="primary_image_url"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Primary Image
            </label>
            <input
              type="file"
              id="primary_image_url"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              JPEG, JPG, or PNG only. Max 5MB
            </p>

            {imagePreview && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Preview:
                </p>
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
                      const fileInput =
                        document.getElementById("primary_image_url");
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

          {/* Name */}
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
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Color Code */}
          <div>
            <label
              htmlFor="color_code"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Color Code *
            </label>
            <input
              type="text"
              id="color_code"
              {...register("color_code", { required: "Color code is required" })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.color_code
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="#000000"
            />
            {errors.color_code && (
              <p className="text-red-500 text-xs mt-1">
                {errors.color_code.message}
              </p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              defaultChecked={
                hatColorSingleData?.is_active === 1 || hatColorSingleData?.is_active === true || true
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm font-semibold text-gray-700"
            >
              Active
            </label>
          </div>

          {/* Buttons */}
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
              {isSubmitting ? "Processing..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddVariantModal;
