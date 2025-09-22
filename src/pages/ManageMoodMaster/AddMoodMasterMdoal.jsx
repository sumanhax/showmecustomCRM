import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addMoodMaster, getMoodMaster } from "../../Reducer/MoodMasterSlice";

const AddMoodMasterMdoal = ({
  openMoodMasterModal,
  setOpenMoodMasterModal,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("mood_master_name", data?.mood_master_name);
    formData.append("mood_master_description", data?.mood_master_description);
    formData.append("mood_master_color_code", data?.mood_master_color_code);
    formData.append("emoji", data?.emoji?.[0]);
    dispatch(addMoodMaster(formData)).then((res) => {
      console.log("res", res);
      if (res?.payload?.status_code === 201) {
        setOpenMoodMasterModal(false);
        dispatch(getMoodMaster());
      } else if (res?.payload?.response?.data?.status_code === 400) {
        toast.error(res?.payload?.response?.data?.message);
      }
    });
  };
  return (
    <>
      <Modal
        show={openMoodMasterModal}
        onClose={() => setOpenMoodMasterModal(false)}
      >
        <Modal.Header>Add New Mood Master</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Master Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Mood Master"
                  {...register("mood_master_name")}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Master Description" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Mood Master Description"
                  {...register("mood_master_description")}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Master Color Code" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Mood Master Color Code"
                  {...register("mood_master_color_code")}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Master Image" />
                </div>
                <FileInput id="file-upload" {...register("emoji")} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenMoodMasterModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Mood Master
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddMoodMasterMdoal;
