import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addMoodMaster, getMoodMaster } from "../../Reducer/MoodMasterSlice";
import { addEquilizer, getEquilizer } from "../../Reducer/EquilizerSlice";

const AddManageEquilizer = ({
   openAddEqModal,
setOpenEqModal
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("mood_eq_name", data?.mood_eq_name);
    formData.append("image", data?.image?.[0]);
    dispatch(addEquilizer(formData)).then((res) => {
      console.log("res", res);
      if (res?.payload?.status_code === 201) {
        setOpenEqModal(false);
        dispatch(getEquilizer());
      } else if (res?.payload?.response?.data?.status_code === 400) {
        toast.error(res?.payload?.response?.data?.message);
      }
    });
  };
  return (
    <>
      <Modal
        show={openAddEqModal}
        onClose={() => setOpenEqModal(false)}
      >
        <Modal.Header>Add New Mood Eqelizer</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Equilizer Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Mood Equilizer"
                  {...register("mood_eq_name")}
                />
              </div>
       
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Equilizer Image" />
                </div>
                <FileInput id="file-upload" {...register("image")} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenEqModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Mood Equilizer
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddManageEquilizer;
