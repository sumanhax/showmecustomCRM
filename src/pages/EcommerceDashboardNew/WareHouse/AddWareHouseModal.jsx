import { Modal, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  warehouseAdd,
  warehouseList,
  // warehouseEdit,
} from "../../../Reducer/ManageWareHouseNewSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const AddWareHouseModal = ({
  openModal,
  setOpenModal,
  warehouseData,
  isEdit,
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  // (Kept because your onClose was referencing these)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Pre-fill form when warehouseData is provided (for edit mode)
  useEffect(() => {
    if (warehouseData && isEdit && openModal) {
      setValue("name", warehouseData?.name || "");
      setValue("code", warehouseData?.code || "");
      setValue("address", warehouseData?.address || "");
      setValue(
        "is_active",
        warehouseData?.is_active === 1 || warehouseData?.is_active === true
      );
    } else if (!isEdit && openModal) {
      // Reset form for add mode
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [warehouseData, isEdit, openModal, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formattedData = {
      ...data,
      is_active: data.is_active ? 1 : 0,
    };

    try {
      if (isEdit && warehouseData?.id) {
        // ✅ Edit API
        const res = await dispatch(
          // warehouseEdit({ id: warehouseData.id, userInput: formattedData })
        ).unwrap();

        if (res?.status_code === 200 || res?.status_code === 201) {
          toast.success(res?.message || "Updated successfully!");
          dispatch(warehouseList());
          setOpenModal(false);
        } else {
          toast.error(res?.message || "Failed to update");
        }
      } else {
        // ✅ Add API
        const res = await dispatch(warehouseAdd(formattedData)).unwrap();

        if (res?.status_code === 200 || res?.status_code === 201) {
          toast.success(res?.message || "Added successfully!");
          dispatch(warehouseList());
          setOpenModal(false);
        } else {
          toast.error(res?.message || "Failed to add");
        }
      }

      reset();
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Warehouse save error:", error);
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "add"}. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
        <Modal.Header>{isEdit ? "Edit Warehouse" : "Add Warehouse"}</Modal.Header>
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
                {...register("code", {
                  required: "Code is required",
                })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.code
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

            {/* address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Address *
              </label>
              <textarea
                rows={4}
                type="textarea"
                id="address"
                {...register("address", {
                  required: "address is required",
                })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
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
                  warehouseData?.is_active === 1 ||
                  warehouseData?.is_active === true ||
                  true
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
                {isSubmitting ? "Processing..." : isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddWareHouseModal;
