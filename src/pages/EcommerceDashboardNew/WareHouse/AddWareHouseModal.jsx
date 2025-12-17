import { Modal, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addPriceTire, priceTierList } from "../../../Reducer/ManagePriceTireNewSlice";

const AddWareHouseModal=({
     openAddWareHouseModal,
            setOpenAddWareHouseModal,
           // onbrandAdded,
            brandData,
            isEdit,
            hatListData,
            decoList
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
dispatch(addPriceTire(data)).then((res)=>{
    console.log("res",res);
    if(res?.payload?.status_code===201){
        dispatch(priceTierList({page:1,limit:20}))
        setOpenAddWareHouseModal(false)
    }
    
    
})
}
    return(
        <>
         <Modal
              show={openAddWareHouseModal}
              onClose={() => {
                setOpenAddWareHouseModal(false);
                reset();
                setSelectedImage(null);
                setImagePreview(null);
              }}
              size="md"
            >
              <Modal.Header>{isEdit ? "Edit Hat" : "Add New Pricing"}</Modal.Header>
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
                      Choose Hats *
                    </label>
        
                    <Select
                      id="brand_id"
                      {...register("hat_id", {
                        required: "Hat is is required",
                      })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.brand_id
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    >
                      {/* IMPORTANT: empty value */}
                      <div className="h-[100px] overflow-y-scroll">
                        <option value="">Select Hats</option>
            
                        {hatListData?.data?.map((brand) => (
                            <option className="h-[50px] overflow-y-scroll"  key={brand.id} value={brand.id}>
                            {brand.name}
                            </option>
                        ))}
                      </div>
                    </Select>
        
                    {errors.hat_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.hat_id.message}
                      </p>
                    )}
                  </div>

                   <div>
                    <label
                      htmlFor="brand_id"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Choose Decoration Type *
                    </label>
        
                    <Select
                      id="brand_id"
                      {...register("decoration_type_id", {
                        required: "Decoration Type is required",
                      })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.brand_id
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    >
                      {/* IMPORTANT: empty value */}
                      <div className="h-[100px] overflow-y-scroll">
                        <option value="">Select Decoration Type</option>
            
                        {decoList?.data?.map((brand) => (
                            <option className="h-[50px] overflow-y-scroll"  key={brand.id} value={brand.id}>
                            {brand.name}
                            </option>
                        ))}
                      </div>
                    </Select>
        
                    {errors.decoration_type_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.decoration_type_id.message}
                      </p>
                    )}
                  </div>
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Max Quantity *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("max_qty", { required: "Name is required" })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter Max Qty"
                    />
                    {errors.max_qty && (
                      <p className="text-red-500 text-xs mt-1">{errors.max_qty.message}</p>
                    )}
                  </div>
        
                  {/* Code Field */}
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                       Min Quantity *
                    </label>
                    <input
                      type="text"
                      id="code"
                      {...register("min_qty", {
                        required: "Min Qty is required",
                      })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.code
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter Min Qty"
                    />
                    {errors.min_qty && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.min_qty.message}
                      </p>
                    )}
                  </div>
        
                  {/* Website URL Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description *
                    </label>
        
                    <input
                      {...register("display_label", {
                        required: "Display Label is required",
                      })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.description
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Display Label"
                    />
        
                    {errors.display_label && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.display_label.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Unit Price *
                    </label>
        
                    <input
                      {...register("unit_price", {
                        required: "Unit Price is required",
                        
                      })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.min_qty
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter Unit Price"
                    />
        
                    {errors.min_qty && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.min_qty.message}
                      </p>
                    )}
                  </div>
        
                  {/* Active Field */}
            
        
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenAddWareHouseModal(false);
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
export default AddWareHouseModal