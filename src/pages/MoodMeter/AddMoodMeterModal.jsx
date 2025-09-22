import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { addMoodMeter, getMoodMeter } from "../../Reducer/MoodMeterSlice";

const AddMoodMeterModal = ({ openAddTagModal, setOpenTagModal }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("mood_meter_name", data?.mood_meter_name);
    formData.append("image", data?.image?.[0]);
    dispatch(addMoodMeter(formData)).then((res) => {
      console.log("res", res);
      if (res?.payload?.status_code === 201) {
        setOpenTagModal(false);
        dispatch(getMoodMeter());
      } else if (res?.payload?.response?.data?.status_code === 400) {
        toast.error(res?.payload?.response?.data?.message);
      }
    });
  };
  return (
    <>
      <Modal show={openAddTagModal} onClose={() => setOpenTagModal(false)}>
        <Modal.Header>Add New Mood Meter</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Meter Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Mood Meter"
                  {...register("mood_meter_name")}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Mood Meter Image" />
                </div>
                <FileInput id="file-upload" {...register("image")} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cnl_btn" onClick={() => setOpenTagModal(false)}>
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Mood Meter
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddMoodMeterModal;
