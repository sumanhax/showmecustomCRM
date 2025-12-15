import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { hatAdd } from "../../../Reducer/EcommerceNewSlice";
import { useNavigate } from "react-router-dom";

const AddHatModal = ({ openModal, setOpenModal, onHatAdded, hatData, isEdit,  }) => {
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

  // Pre-fill form when hatData is provided (for edit mode)
  useEffect(() => {
    if (hatData && isEdit && openModal) {
      setValue("name", hatData.name || "");
      setValue("code", hatData.code || "");
      setValue("website_url", hatData.website_url || "");
      setValue(
        "is_active",
        hatData.is_active === 1 ? 1:0
      );

      // Set image preview if exists
      if (hatData.image_url) {
        setImagePreview(hatData.image_url);
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
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
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
      // Transform form data to match **new** API payload structure
      // const formData = new FormData();
      // formData.append("name", data.name || "");
      // formData.append("code", data.code || "");
      // formData.append("website_url", data.website_url || "");
      // formData.append("is_active", data.is_active ? 1 : 0);

      // Append image if selected (for add mode) or if changed (for edit mode)
      if (selectedImage) {
        formData.append("image", selectedImage);
      } else if (isEdit && hatData?.image_url && !selectedImage) {
        // In edit mode, if no new image selected, keep existing image URL
        formData.append("image", hatData.image_url);
      }

      if (isEdit && hatData) {
        // FormData for non-image fields on edit
        // const editFormData = new FormData();
        // editFormData.append("name", data.name || "");
        // editFormData.append("code", data.code || "");
        // editFormData.append("website_url", data.website_url || "");
        // editFormData.append("is_active", data.is_active ? 1 : 0);

        // const promises= [];

        // if (selectedImage) {
        //   // Separate image upload on edit
        //   const imageFormData = new FormData();
        //   imageFormData.append("image_url", selectedImage);
        //   promises.push(
        //     dispatch(
        //       hatEditImageUpload({ id: hatData.id, userInput: imageFormData })
        //     ).unwrap()
        //   );
        // }

        // Always update main fields
        // promises.push(
        //   dispatch(hatEdit({ id: hatData.id, userInput: editFormData })).unwrap()
        // );

        // Promise.all(promises)
        //   .then((responses) => {
        //     console.log("Hat/brand updated successfully:", responses);
        //     const response = responses[responses.length - 1];

        //     if (response?.status_code === 200 || response?.status_code === 201) {
        //       toast.success(response?.message || "Updated successfully!", {
        //         position: "top-right",
        //         autoClose: 3000,
        //       });
        //     } else if (response?.status_code === 422) {
        //       toast.error(response?.message || "Validation error occurred", {
        //         position: "top-right",
        //         autoClose: 3000,
        //       });
        //     } else {
        //       toast.error(response?.message || "Failed to update", {
        //         position: "top-right",
        //         autoClose: 3000,
        //       });
        //     }

        //     reset();
        //     setSelectedImage(null);
        //     setImagePreview(null);
        //     navigate(`/hat-details/${responses[0].data.id}`);

        //     setTimeout(() => {
        //       setOpenModal(false);
        //       if (onHatAdded) onHatAdded();
        //     }, 100);
        //   })
        //   .catch((error) => {
        //     console.error("Error updating:", error);
        //     const errorMessage =
        //       error?.response?.data?.message ||
        //       error?.message ||
        //       "Failed to update. Please try again.";
        //     toast.error(errorMessage, {
        //       position: "top-right",
        //       autoClose: 3000,
        //     });
        //   })
        //   .finally(() => setIsSubmitting(false));
      }

      else {
        // Add new
        // const newPayload = {
        //   brand_id: 1,
        //   name: "new hat",
        //   internal_style_code: "#09967",
        //   description: "desc",
        //   "min_qty": ,
        // }
        dispatch(hatAdd(data))
          .unwrap()
          .then((response) => {
            console.log("Hat/brand added successfully:", response);
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
            navigate(`/hat-details/${response.data.id}`);
          })
          .catch((error) => {
            console.error("Error adding:", error);
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
      console.error("Error saving:", error);
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
      <Modal.Header>{isEdit ? "Edit Brand" : "Add New Brand"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload Field */}
          <div>
            <label
              htmlFor="image_url"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Image
            </label>
            <input
              type="file"
              id="image_url"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              JPEG, JPG, or PNG only. Max 5MB
            </p>

            {/* Image Preview */}
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
                        document.getElementById("image_url");
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
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.name
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
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.code
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
                }`}
              placeholder="Enter code"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">
                {errors.code.message}
              </p>
            )}
          </div>

          {/* Website URL Field */}
          <div>
            <label
              htmlFor="website_url"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Website URL
            </label>
            <input
              type="text"
              id="website_url"
              {...register("website_url")}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.website_url
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
                }`}
              placeholder="https://example.com"
            />
            {errors.website_url && (
              <p className="text-red-500 text-xs mt-1">
                {errors.website_url.message}
              </p>
            )}
          </div>

          {/* Active Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              defaultChecked={
                hatData?.is_active === 1 || hatData?.is_active === 1 || 1
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
                  ? "Update"
                  : "Add"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddHatModal;
