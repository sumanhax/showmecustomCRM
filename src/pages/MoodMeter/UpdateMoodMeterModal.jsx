import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import {
  getMoodMeter,
  getSingleMoodMeter,
  updateMoodMeter,
  uploadMoodAvatar,
} from "../../Reducer/MoodMeterSlice";

const UpdateMoodMeterModal = ({
  openUpdateTagModal,
  setOpenUpdateTagModal,
  moodmeterId,
}) => {
  const dispatch = useDispatch();
  const { singleMoodMeter } = useSelector((state) => state?.moodData);
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useState(() => {
    dispatch(getSingleMoodMeter({ mood_meter_id: moodmeterId }));
  }, [moodmeterId]);

  useEffect(() => {
    setValue("mood_meter_name", singleMoodMeter?.res?.[0]?.mood_meter_name);
    // setValue("category_avatar", singleCate?.res?.[0]?.category_avatar);
  }, [singleMoodMeter, setValue]);
  const onSubmit = (data) => {
    dispatch(updateMoodMeter({ ...data, mood_meter_id: moodmeterId })).then(
      (res) => {
        console.log("res", res);

        if (res?.payload?.status_code === 200) {
          setOpenUpdateTagModal(false);
          dispatch(getMoodMeter());
        }
      }
    );
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("mood_meter_id", moodmeterId);
      dispatch(uploadMoodAvatar(formData)).then((res) => {
        console.log("Res: ", res);
        if (res?.payload?.status_code === 200) {
          //  dispatch(getCateGory({ category_id: cateGoryId }));
          setOpenUpdateTagModal(false);
          dispatch(getMoodMeter());
        }
      });
    }
  };
  return (
    <>
      <Modal
        show={openUpdateTagModal}
        onClose={() => setOpenUpdateTagModal(false)}
      >
        <Modal.Header>Update Mood Meter</Modal.Header>
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
              <div className="account_user_section w-8/12 lg:w-4/12 mb-2 lg:mb-0">
                {singleMoodMeter?.res?.[0]?.mood_meter_avatar !== null ? (
                  <img
                    src={singleMoodMeter?.res?.[0]?.mood_meter_avatar}
                    alt="Profile Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <img
                    //src={photorealisticImage}
                    alt="Profile Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                )}
                <div className="absolute right-1 top-1">
                  <button
                    type="button"
                    className="bg-white p-2 rounded-full shadow-md text-[#757575] hover:bg-[#ff1a03] hover:text-white"
                  >
                    <FileInput
                      className="absolute opacity-0 h-3 w-5 border border-black"
                      id="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <MdEdit className="text-xl" />
                  </button>
                </div>
                &nbsp;
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenUpdateTagModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Update Mood Meter
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default UpdateMoodMeterModal;
