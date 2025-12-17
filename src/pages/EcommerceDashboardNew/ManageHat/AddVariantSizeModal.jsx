import { Modal, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hatSizeAdd } from "../../../Reducer/EcommerceNewSlice";

const AddVariantSizeModal=({
     openModal,
          setOpenModal,
          onSizeAdded,
          colorId,
          isEdit
})=>{
    const dispatch=useDispatch()
     const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
      } = useForm();

      const onSubmit=(data)=>{
        dispatch(hatSizeAdd({...data,hat_color_id:Number(colorId),is_active:1})).then((res)=>{
            console.log("res",res);
            
        })
      }
    return(
        <>
         <Modal
        show={openModal}
        onClose={() => {
        setOpenModal(false);                
        }}
        size="md"
        >
        <Modal.Header>{isEdit ? "Edit Hat" : "Add New Size"} {colorId}</Modal.Header>
        <Modal.Body>
        <form 
         onSubmit={handleSubmit(onSubmit)}
            className="space-y-4">
            {/* Image Upload Field */}

            <div>
            <label
                htmlFor="brand_id"
                className="block text-sm font-semibold text-gray-700 mb-1"
            >
                Size Label *
            </label>

            <Select
                id="brand_id"
                {...register("size_label", {
                required: "Size Label is required",
                })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.brand_id
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
            >
                {/* IMPORTANT: empty value */}
                <div className="h-[100px] overflow-y-scroll">
                <option value="">Select Size</option>
    
                <option className="h-[50px] overflow-y-scroll"  value="XL/XXL">XL/XXL</option>
                <option className="h-[50px] overflow-y-scroll"  value="L/XL">L/XL</option>
                <option className="h-[50px] overflow-y-scroll"  value="OSFA">OSFA</option>
                <option className="h-[50px] overflow-y-scroll"  value="S/M">S/M</option>
                
                </div>
            </Select>

            {errors.size_label && (
                <p className="text-red-500 text-xs mt-1">
                {errors.size_label.message}
                </p>
            )}
            </div>

            
            {/* Name Field */}
            <div>
            <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-1"
            >
                Variant Name *
            </label>
            <input
                type="text"
                id="name"
                {...register("variant_name", { required: "Variant Name is required" })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter Variant Name"
            />
            {errors.variant_name && (
                <p className="text-red-500 text-xs mt-1">{errors.variant_name.message}</p>
            )}
            </div>

            {/* Code Field */}
            {/* <div>
            <label
                htmlFor="code"
                className="block text-sm font-semibold text-gray-700 mb-1"
            >
                Supplier Sku *
            </label>
            <input
                type="text"
                id="code"
                {...register("supplier_sku", {
                required: "Supplier Sku is required",
                })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.code
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter Supplier Sku"
            />
            {errors.supplier_sku && (
                <p className="text-red-500 text-xs mt-1">
                {errors.supplier_sku.message}
                </p>
            )}
            </div> */}

            {/* Website URL Field */}
            {/* <div className="flex items-center">
            <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
            
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
            htmlFor="is_active"
            className="ml-2 text-sm font-semibold text-gray-700"
            >
            Active
            </label>
            </div> */}

            {/* Active Field */}
    

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
            <button
                type="button"
                onClick={() => {
                setOpenAddPriceModal(false);
                reset();
                }}
            //  disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
            //  disabled={isSubmitting}
                className="px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {/* {isSubmitting ? "Processing..." : isEdit ? "Update" : "Add"} */}
                Add
            </button>
            </div>
        </form>
        </Modal.Body>
    </Modal>
        </>
    )
}
export default AddVariantSizeModal