import { useState, useRef } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hatMultiImageUpload } from "../../Reducer/EcommerceSlice";
import { FaUpload, FaTimes, FaImage } from "react-icons/fa";

const AddHatImagesModal = ({ openModal, setOpenModal, hatId, onImagesAdded }) => {
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (files) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const newFiles = Array.from(files).filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type. Only JPEG, JPG, or PNG are allowed.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
      return true;
    });

    if (newFiles.length > 0) {
      const updatedImages = [...selectedImages, ...newFiles];
      setSelectedImages(updatedImages);

      // Create previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, { file, preview: reader.result }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image to upload.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", hatId);
      
      selectedImages.forEach((image) => {
        formData.append("image", image);
      });

      dispatch(hatMultiImageUpload(formData))
        .unwrap()
        .then((response) => {
          console.log("Images uploaded successfully:", response);
          if (response?.data?.status_code === 200 || response?.data?.status_code === 201) {
            toast.success(response?.data?.message || "Images uploaded successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            // Reset state
            setSelectedImages([]);
            setImagePreviews([]);
            // Close modal after a short delay
            setTimeout(() => {
              setOpenModal(false);
              if (onImagesAdded) {
                onImagesAdded();
              }
            }, 100);
          } else if (response?.data?.status_code === 422) {
            toast.error(response?.data?.message || "Validation error occurred", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.error(response?.data?.message || "Failed to upload images", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("Error uploading images:", error);
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload images. Please try again.";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setIsDragging(false);
    setOpenModal(false);
  };

  return (
    <Modal show={openModal} onClose={handleClose} size="lg">
      <Modal.Header>Add More Images</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-[#f20c32] bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <FaUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              Drag and drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: JPEG, JPG, PNG (Max 5MB per image)
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Select Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Selected Images ({imagePreviews.length})
              </h3>
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {imagePreviews.map((item, index) => (
                  <div
                    key={index}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <FaTimes size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {item.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={isSubmitting || selectedImages.length === 0}
              className="px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Uploading..." : `Upload ${selectedImages.length} Image${selectedImages.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddHatImagesModal;

