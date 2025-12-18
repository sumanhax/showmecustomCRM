import { Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import {
  decorationaddonPriceAdd,
  decorationaddonPriceSingle,
} from "../../../Reducer/ManageDecorationNewSlice";

const DecorationAddonPriceAddModal = ({ openModal, setOpenModal, decorationAddonId }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      min_qty: "",
      max_qty: "",
      unit_price: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (!openModal) return;
    reset({
      min_qty: "",
      max_qty: "",
      unit_price: "",
      is_active: true,
    });
  }, [openModal, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      decoration_addon_id: String(decorationAddonId), // ✅ from params
      min_qty: Number(data.min_qty),
      max_qty: Number(data.max_qty),
      unit_price: String(data.unit_price), 
      is_active: data.is_active ? 1 : 0,
    };

    // basic sanity check
    if (payload.max_qty < payload.min_qty) {
      toast.error("Max Qty must be greater than or equal to Min Qty");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await dispatch(decorationaddonPriceAdd(payload)).unwrap();

      if (res?.status_code === 200 || res?.status_code === 201 || res?.status === true) {
        toast.success(res?.message || "Price tier added successfully!");
        // refresh tiers list
        dispatch(decorationaddonPriceSingle(decorationAddonId));
        setOpenModal(false);
        reset();
      } else {
        toast.error(res?.message || "Failed to add price tier");
      }
    } catch (err) {
      console.error("decorationaddonPriceAdd error:", err);
      toast.error(err?.message || err?.response?.data?.message || "Failed to add price tier");
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
      <Modal.Header>Add Price Tier</Modal.Header>

      <Modal.Body>
        {/* Same clean payload-style layout */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Min/Max */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Min Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                {...register("min_qty", {
                  required: "Min Qty is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Min Qty must be at least 1" },
                })}
                placeholder="1"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.min_qty
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.min_qty && (
                <p className="text-red-500 text-xs mt-1">{errors.min_qty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Max Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                {...register("max_qty", {
                  required: "Max Qty is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Max Qty must be at least 1" },
                })}
                placeholder="11"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.max_qty
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.max_qty && (
                <p className="text-red-500 text-xs mt-1">{errors.max_qty.message}</p>
              )}
            </div>
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Unit Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              {...register("unit_price", {
                required: "Unit Price is required",
                validate: (v) => (Number(v) >= 0 ? true : "Unit Price must be >= 0"),
              })}
              placeholder="8.00"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.unit_price
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.unit_price && (
              <p className="text-red-500 text-xs mt-1">{errors.unit_price.message}</p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              defaultChecked
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-semibold text-gray-700">
              Active <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Actions */}
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
              {isSubmitting ? "Processing..." : "Add"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DecorationAddonPriceAddModal;
