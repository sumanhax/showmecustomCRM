import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  editPlanDetails,
  getPlanDetails,
  updateEditDetails,
} from "../../Reducer/PlanSlice";
import { toast } from "react-toastify";

const EditDetailsModal = ({
  openEditPlan,
  setOpenEditPlan,
  detailsId,
  editId,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (detailsId && openEditPlan) {
      dispatch(editPlanDetails({ plan_detail_id: detailsId })).then((res) => {
        console.log("res:", res);
        if (res?.payload?.status_code === 200) {
          setValue("price", res?.payload?.results?.price);
          setValue("currency", res?.payload?.results?.currency);
        }
      });
    }
  }, [detailsId, openEditPlan, setValue, dispatch]);

  const onSubmit = (data) => {
    const payload = {
      plan_detail_id: detailsId,
      price: data?.price,
    };
    dispatch(updateEditDetails(payload)).then((res) => {
      console.log("Update_res", res);
      if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.message);
        setOpenEditPlan(false);
        dispatch(getPlanDetails({ plan_id: editId }));
      } else {
        toast.error("something went wrong!");
      }
    });
  };
  const handleCancel = () => {
    setOpenEditPlan(false);
  };
  const handleUpdateClick = () => {
    handleSubmit(onSubmit)(); // Manually trigger form submission
  };

  return (
    <>
      <Modal show={openEditPlan} onClose={() => setOpenEditPlan(false)}>
        <Modal.Header className="border-0 pb-0">Edit Plan Details</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="edit-plan-form">
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Plan Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  {...register("price", {
                    required: "Price is required",
                  })}
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">
                    {errors.price.message}
                  </span>
                )}
                <div className="mb-2 mt-2 block">
                  <Label htmlFor="name" value="Currency" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  {...register("currency", {
                    required: "Price is required",
                  })}
                  disabled
                />
                {errors.currency && (
                  <span className="text-red-500 text-sm">
                    {errors.currency.message}
                  </span>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateClick} // Changed from type="submit" to onClick handler
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default EditDetailsModal;
