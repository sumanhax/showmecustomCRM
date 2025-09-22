import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { editPlan, planList, updatePlans } from "../../Reducer/PlanSlice";
import { toast } from "react-toastify";

const EditModal = ({ openEditModal, setOpenEditModal, editId }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editId && openEditModal) {
      dispatch(editPlan({ plan_id: editId })).then((res) => {
        console.log("Res", res);
        if (res?.payload?.status_code === 200) {
          setValue("plan_name", res?.payload?.results?.plan_name);
        }
      });
    }
  }, [editId, openEditModal, dispatch, setValue]); // Added missing dependencies

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data); // Debug log
    dispatch(updatePlans({ ...data, plan_id: editId }))
      .then((res) => {
        console.log("Update response:", res);
        if (res?.payload?.status_code === 200) {
          toast.success(res?.payload?.message);
          setOpenEditModal(false); // Close modal on success
          dispatch(planList());
        } else {
          toast.error("Failed to update plan");
        }
      })
      .catch((error) => {
        console.error("Update error:", error);
        toast.error("An error occurred while updating the plan");
      });
  };

  const handleCancel = () => {
    setOpenEditModal(false);
  };

  const handleUpdateClick = () => {
    handleSubmit(onSubmit)(); // Manually trigger form submission
  };

  return (
    <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
      <Modal.Header className="border-0 pb-0">Edit Plan</Modal.Header>
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
                {...register("plan_name", {
                  required: "Plan name is required",
                })}
              />
              {errors.plan_name && (
                <span className="text-red-500 text-sm">
                  {errors.plan_name.message}
                </span>
              )}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          className="focus:outline-none text-white bg-black hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-0.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateClick} // Changed from type="submit" to onClick handler
          className="focus:outline-none text-white bg-[#52b69a] hover:bg-black font-medium rounded-lg text-sm px-4 py-0.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
