import { useState, useRef, useEffect } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hatMultiImageUpdate } from "../../Reducer/EcommerceSlice";
import { FaUpload, FaImage } from "react-icons/fa";

const EditHatImageModal = ({ openModal, setOpenModal, imageData, onImageUpdated }) => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Set current image preview when modal opens
  useEffect(() => {
    if (openModal && imageData) {
      setImagePreview(imageData.imageUrls || "");
      setSelectedImage(null);
    }
  }, [openModal, imageData]);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPEG, JPG, or PNG images", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error("Please select a new image to upload.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!imageData?.id) {
      toast.error("Image ID is missing.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", imageData.id);
      formData.append("image", selectedImage);

      dispatch(hatMultiImageUpdate(formData))
        .unwrap()
        .then((response) => {
          console.log("Image updated successfully:", response);
          if (response?.status_code === 200 || response?.status_code === 201) {
            toast.success(response?.message || "Image updated successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            // Reset state
            setSelectedImage(null);
            // Close modal after a short delay
            setTimeout(() => {
              setOpenModal(false);
              if (onImageUpdated) {
                onImageUpdated();
              }
            }, 100);
          } else if (response?.status_code === 422) {
            toast.error(response?.message || "Validation error occurred", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.error(response?.message || "Failed to update image", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("Error updating image:", error);
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to update image. Please try again.";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setSelectedImage(null);
    setImagePreview(imageData?.imageUrls || "");
    setOpenModal(false);
  };

  return (
    <Modal show={openModal} onClose={handleClose} size="md">
      <Modal.Header>Edit Hat Image</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current/Preview Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {selectedImage ? "New Image Preview" : "Current Image"}
            </label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
                  <div className="text-center text-gray-400">
                    <FaImage className="w-12 h-12 mx-auto mb-2" />
                    <p>No image available</p>
                  </div>
                </div>
              )}
              <div
                className="hidden items-center justify-center w-full h-64 bg-gray-100 rounded-lg"
                style={{ display: "none" }}
              >
                <div className="text-center text-gray-400">
                  <FaImage className="w-12 h-12 mx-auto mb-2" />
                  <p>Image not available</p>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload New Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <FaUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600 mb-2 text-sm">
                Click to select a new image
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: JPEG, JPG, PNG (Max 5MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Select Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileInputChange}
                className="hidden"
              />
              {selectedImage && (
                <p className="mt-2 text-xs text-gray-600">
                  Selected: {selectedImage.name}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedImage}
              className="px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Image"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditHatImageModal;

