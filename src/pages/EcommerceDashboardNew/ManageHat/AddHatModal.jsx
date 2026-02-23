import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Modal, Select } from "flowbite-react";
import { useDispatch } from "react-redux";
import { brandList, hatAdd, hatList, hatUpdate } from "../../../Reducer/EcommerceNewSlice";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { useSelector } from "react-redux";

const AddHatModal = ({
  openModal,
  setOpenModal,
  onHatAdded,
  hatData,
  isEdit,
  brandListData,
}) => {
   const {hatSingleForEditData } = useSelector(
      (state) => state.newecom,
    );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      size_chart: [{ size: "", value: "" }], // initial one row
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "size_chart",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  console.log("brandListData", brandListData);

  

useEffect(() => {
  if (isEdit && openModal && hatSingleForEditData?.data) {
    const data = hatSingleForEditData.data;

    reset({
      brand_id: Number(data.brand_id),
      name: data.name || "",
      internal_style_code: data.internal_style_code || "",
      description: data.description || "",
      min_qty: Number(data.min_qty) || 0,

      // 👇 THIS IS THE FIX
      size_chart:
        data.size_chart_json?.size_chart?.length > 0
          ? data.size_chart_json.size_chart
          : [{ size: "", value: "" }],
    });
  }

  if (!openModal) {
    reset({
      size_chart: [{ size: "", value: "" }],
    });
  }
}, [isEdit, openModal, hatSingleForEditData , reset]);
 
 
 
 
 
//   const onSubmit = async (data) => {
//   setIsSubmitting(true);

//   try {
//     const payload = {
//       brand_id: Number(data.brand_id),
//       name: data.name,
//       internal_style_code: data.internal_style_code,
//       description: data.description,
//       min_qty: Number(data.min_qty),

//       // 👇 IMPORTANT: stringify size chart
//       size_chart_json: JSON.stringify({
//         size_chart: data.size_chart,
//       }),
//     };

//     console.log("FINAL PAYLOAD 👉", payload);

//     dispatch(hatAdd(payload))
//       .unwrap()
//       .then((response) => {
//         console.log("res",response);
//         dispatch(hatList())
        
//         toast.success(response?.message || "Added successfully!");
//         reset();
//         setOpenModal(false);
//       })
//       .catch((error) => {
//         toast.error(
//           error?.response?.data?.message || "Failed to add"
//         );
//       })
//       .finally(() => setIsSubmitting(false));

//   } catch (error) {
//     console.error(error);
//     toast.error("Something went wrong");
//     setIsSubmitting(false);
//   }
// };

  const onSubmit = async (data) => {
  setIsSubmitting(true);

  try {
    let payload;

    if (isEdit) {
      // ✅ UPDATE PAYLOAD
      payload = {
        hat_id: Number(hatSingleForEditData?.data?.id),
        name: data.name,
        internal_style_code: data.internal_style_code,
        description: data.description,
        size_chart_json: {
          size_chart: data.size_chart,
        },
      };

      const response = await dispatch(hatUpdate(payload)).unwrap();

      toast.success(response?.message || "Updated successfully!");

    } else {
      // ✅ ADD PAYLOAD
      payload = {
        brand_id: Number(data.brand_id),
        name: data.name,
        internal_style_code: data.internal_style_code,
        description: data.description,
        min_qty: Number(data.min_qty),
             size_chart_json: JSON.stringify({
        size_chart: data.size_chart,
      })
      };

      const response = await dispatch(hatAdd(payload)).unwrap();

      toast.success(response?.message || "Added successfully!");
    }

    dispatch(hatList());
    reset();
    setOpenModal(false);

  } catch (error) {
    console.error(error);
    toast.error(error?.message || "Something went wrong");
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
        setSelectedImage(null);
        setImagePreview(null);
      }}
      size="md"
    >
      <Modal.Header>{isEdit ? "Edit Hat" : "Add New Hat"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload Field */}

          {/* <div>
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
                      const fileInput = document.getElementById("image_url");
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
          </div> */}
          <div>
            <label
              htmlFor="brand_id"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Choose Brand *
            </label>

            <Select
              id="brand_id"
              {...register("brand_id", {
                required: "Brand is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.brand_id
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              {/* IMPORTANT: empty value */}
              <option value="">Select Brand</option>

              {brandListData?.data?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>

            {errors.brand_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brand_id.message}
              </p>
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
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter name"
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
              Style Code *
            </label>
            <input
              type="text"
              id="code"
              {...register("internal_style_code", {
                required: "Code is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.code
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter Style code"
            />
            {errors.internal_style_code && (
              <p className="text-red-500 text-xs mt-1">
                {errors.internal_style_code.message}
              </p>
            )}
          </div>

          {/* Website URL Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description *
            </label>

            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Description"
            />

            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* <div className="flex gap-2">
            <div>
            <label
              htmlFor="size_chart"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
             Size
            </label>
            <input
              type="text"
              id="size_chart"
             
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 
                  border-gray-300 focus:ring-blue-500`}
              placeholder="eg:X/XL"
            />
            </div>

            <div>
            <label
              htmlFor="size_chart"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
             Value
            </label>
            <input
              type="text"
              id="size_chart"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 
                  border-gray-300 focus:ring-blue-500`}
              placeholder="eg:5/8'-7 7/8'"
            />
            </div>
            <div className="mt-9">
            <button><CiCirclePlus size={20} color="green"/></button>  
            </div>
            <div className="mt-9">
            <button><CiCircleMinus size={20} color="red"/></button>  
            </div>
          </div> */}

          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Size Chart *
          </label>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end mb-2">
              {/* Size */}
              <div className="flex-1">
                <input
                  {...register(`size_chart.${index}.size`, {
                    required: "Size is required",
                  })}
                  placeholder="eg: X/XL"
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.size_chart?.[index]?.size
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.size_chart?.[index]?.size && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.size_chart[index].size.message}
                  </p>
                )}
              </div>

              {/* Value */}
              <div className="flex-1">
                <input
                  {...register(`size_chart.${index}.value`, {
                    required: "Value is required",
                  })}
                  placeholder="eg: 5/8'-7 7/8'"
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    errors.size_chart?.[index]?.value
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.size_chart?.[index]?.value && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.size_chart[index].value.message}
                  </p>
                )}
              </div>

              {/* Add */}
              <button
                type="button"
                onClick={() => append({ size: "", value: "" })}
              >
                <CiCirclePlus size={22} className="text-green-600" />
              </button>

              {/* Remove */}
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)}>
                  <CiCircleMinus size={22} className="text-red-600" />
                </button>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Min Quantity *
            </label>

            <input
              {...register("min_qty", {
                required: "Minimum quantity is required",
                min: {
                  value: 1,
                  message: "Minimum quantity must be at least 1",
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.min_qty
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Min Quantity"
            />

            {errors.min_qty && (
              <p className="text-red-500 text-xs mt-1">
                {errors.min_qty.message}
              </p>
            )}
          </div>

          {/* Active Field */}
          {/* <div className="flex items-center">
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
          </div> */}

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
  );
};

export default AddHatModal;
