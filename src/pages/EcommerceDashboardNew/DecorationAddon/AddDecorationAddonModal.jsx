import { Modal, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";


import {
  decorationaddonAdd,
  decorationaddonList,
  // decorationaddonEdit,
} from "../../../Reducer/ManageDecorationNewSlice";

const AddDecorationAddonModal = ({ openModal, setOpenModal, addonData, onSaved }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  useEffect(() => {
    if (!openModal) return;

    if (addonData?.id) {
      reset({
        name: addonData?.name || "",
        code: addonData?.code || "",
        type: addonData?.type || "",
        description: addonData?.description || "",
        is_active: addonData?.is_active === 1 || addonData?.is_active === true,
      });
    } else {
      reset({
        name: "",
        code: "",
        type: "",
        description: "",
        is_active: true,
      });
    }
  }, [openModal, addonData, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formattedData = {
      name: data?.name?.trim(),
      code: data?.code?.trim(),
      type: data?.type,
      ...(data?.description?.trim() ? { description: data.description.trim() } : {}),
      is_active: data?.is_active ? 1 : 0,
    };

    try {
   
      if (addonData?.id) {
        //  Uncomment when your slice has edit action
        // const res = await dispatch(
        //   decorationaddonEdit({ id: addonData.id, userInput: formattedData })
        // ).unwrap();

        // if (res?.status_code === 200 || res?.status_code === 201 || res?.status) {
        //   toast.success(res?.message || "Updated successfully!");
        //   dispatch(decorationaddonList());
        //   onSaved?.();
        //   setOpenModal(false);
        // } else {
        //   toast.error(res?.message || "Failed to update");
        // }

        toast.info("Hook up decorationaddonEdit() in slice to enable edit.");
      } else {
        //  Add
        const res = await dispatch(decorationaddonAdd(formattedData)).unwrap();

        if (res?.status_code === 200 || res?.status_code === 201 || res?.status === true) {
          toast.success(res?.message || "Added successfully!");
          dispatch(decorationaddonList());
          onSaved?.();
          setOpenModal(false);
        } else {
          toast.error(res?.message || "Failed to add");
        }
      }

      reset();
    } catch (error) {
      console.error("Decoration addon save error:", error);
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          `Failed to ${addonData?.id ? "update" : "add"}. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={openModal}
      onClose={() => {
        setOpenModal(false);
        reset();
      }}
      size="lg"
    >
      <Modal.Header>{addonData?.id ? "Edit Decoration Addon" : "Add Decoration Addon"}</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name + Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder='e.g. "3D Puff"'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("code", { required: "Code is required" })}
                placeholder='e.g. "3D_PUFF"'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.code ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <Select {...register("type", { required: "Type is required" })}>
              <option value="">Select type</option>
              <option value="Embroidery Addon">Embroidery Addon</option>
              <option value="Placement Addon">Placement Addon</option>
            </Select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={4}
              {...register("description")}
              placeholder='e.g. "test"'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-semibold text-gray-700">
              Active <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setOpenModal(false);
                reset();
              }}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : addonData?.id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDecorationAddonModal;
