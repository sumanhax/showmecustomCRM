import { Modal, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addInventory } from "../../../Reducer/AddInvetoryNewSlice";
import { toast, ToastContainer } from "react-toastify";

const AddVariantSizeInventoryModal=({
          openModal,
          setOpenModal,
          onInventoryAdded,
          inventoryData,
          isEdit,
          variantSizeId,
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
    dispatch(addInventory({...data,hat_size_variant_id:variantSizeId})).then((res)=>{
        if(res?.payload?.status_code===201){
            toast.success(res?.payload?.message)
             setOpenModal(false)
        }else if(res?.payload?.status_code===400){
            toast.error(res?.payload?.message)
            setOpenModal(false)
        }
    }).catch((err)=>{
        toast.error(err)
        console.log("inven error",err)
    })
    
}
    return(
        <>
        <ToastContainer/>
        <Modal
                show={openModal}
                onClose={() => {
                setOpenModal(false);                
                }}
                size="md"
                >
                <Modal.Header>{isEdit ? "Edit Inventory" : "Add New Inventory"}</Modal.Header>
                <Modal.Body>
                <form 
                 onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4">
                    {/* Image Upload Field */}
                    {/* Name Field */}
                    <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Quantity On Hand *
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register("qty_on_hand", { required: "Quantity On Hand is required" })}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder="Enter Quantity On Hand"
                    />
                    {errors.qty_on_hand && (
                        <p className="text-red-500 text-xs mt-1">{errors.qty_on_hand.message}</p>
                    )}
                    </div>
                     <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                       Source *
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register("source", { required: "Quantity On Hand is required" })}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder="Enter Source"
                    />
                    {errors.source && (
                        <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>
                    )}
                    </div>
        
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                        setOpenModal(false);
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
export default AddVariantSizeInventoryModal