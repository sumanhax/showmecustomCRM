import {
  Button,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getTopics, topicDetails, updateTopic } from "../../Reducer/TopicSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UpdateTopicModal = ({
  openUpdateTopicModal,
  setOpenUpdateTopicModal,
  topicId,
}) => {
  console.log("topicId", topicId);
  const dispatch = useDispatch();
  const { updateloading } = useSelector((state) => state?.topicsData);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(topicDetails(topicId)).then((res) => {
      console.log("topic details res", res);
      setValue("topic_name", res?.payload?.data?.topic_name);
      setValue("topic_short_name", res?.payload?.data?.topic_short_name);
      setValue("topic_description", res?.payload?.data?.topic_description);
    });
  }, [dispatch, topicId, setValue]);

  const onSubmit = (data) => {
    console.log("Data:", data);
    dispatch(updateTopic({ ...data, topic_id: topicId })).then((res) => {
      console.log("update topic res", res);
      if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(getTopics());
        setOpenUpdateTopicModal(false);
      } else {
        toast.error(res?.payload?.response?.data?.data?.[0]?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });
  };

  return (
    <>
      <Modal
        show={openUpdateTopicModal}
        onClose={() => setOpenUpdateTopicModal(false)}
      >
        <Modal.Header className="border-0 pb-0">Update This Topic</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
              <div>
                <Label htmlFor="topic_name" value="Topic Name" />
                <TextInput
                  id="topic_name"
                  {...register("topic_name", {
                    required: "Topic Name is required",
                  })}
                />
                {errors?.topic_name && (
                  <p className="text-red-500 text-sm">
                    {errors.topic_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="topic_short_name" value="Topic Short Name" />
                <TextInput
                  id="topic_short_name"
                  {...register("topic_short_name")}
                />
                {errors?.topic_short_name && (
                  <p className="text-red-500 text-sm">
                    {errors.topic_short_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="topic_description" value="Topic Description" />
                <Textarea
                  id="topic_description"
                  rows={3}
                  {...register("topic_description", {
                    required: "Description is required",
                  })}
                />
                {errors?.topic_description && (
                  <p className="text-red-500 text-sm">
                    {errors.topic_description.message}
                  </p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex flex-col sm:flex-row sm:justify-end gap-2 border-0 pt-0">
            <Button
              onClick={() => setOpenUpdateTopicModal(false)}
              type="button"
              className="w-full sm:w-auto bg-black hover:bg-red-800 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-[#52b69a] hover:bg-black text-white"
            >
              {updateloading ? "Wait..." : "Update"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default UpdateTopicModal;
