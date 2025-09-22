import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  changeAvatar,
  getMoodMaster,
  updateMoodMaster,
} from "../../Reducer/MoodMasterSlice";

const UpdateMoodMasterModal = ({
  openUpdateMoodMasterModal,
  setOpenUpdateMoodMasterModal,
  mood_masterId,
  singleMoodMaster,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  console.log("singleMoodMaster", singleMoodMaster);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setValue("mood_master_name", singleMoodMaster?.data?.[0]?.mood_master_name);
    setValue(
      "mood_master_description",
      singleMoodMaster?.data?.[0]?.mood_master_description
    );
    setValue(
      "mood_master_color_code",
      singleMoodMaster?.data?.[0]?.mood_master_color_code
    );
  }, [singleMoodMaster]);
  const onSubmit = (data) => {
    dispatch(updateMoodMaster({ ...data, id: mood_masterId })).then((res) => {
      if (res?.payload?.status_code === 200) {
        setOpenUpdateMoodMasterModal(false);
        dispatch(getMoodMaster());
      }
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("emoji", file);

      dispatch(changeAvatar({ id: mood_masterId, formData })).then((res) => {
        console.log("Res: ", res);
        if (res?.payload?.status_code === 200) {
          //  dispatch(getCateGory({ category_id: cateGoryId }));
          setOpenUpdateMoodMasterModal(false);
          dispatch(getMoodMaster());
        }
      });
    }
  };
  return (
    <>
      <Modal
        show={openUpdateMoodMasterModal}
        onClose={() => setOpenUpdateMoodMasterModal(false)}
      >
        <Modal.Header>Update Mood Master</Modal.Header>
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
              <div className="account_user_section w-8/12 lg:w-4/12 mb-2 lg:mb-0">
                {singleMoodMaster?.data?.[0]?.mood_master_icon !== null ? (
                  <img
                    src={
                      "https://goodmoodapi.bestworks.cloud/" +
                      singleMoodMaster?.data?.[0]?.mood_master_icon
                    }
                    alt="Profile Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <img
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
              onClick={() => setOpenUpdateMoodMasterModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Update Mood Master
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default UpdateMoodMasterModal;
