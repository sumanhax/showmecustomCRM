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
import { addTopic, getlevelList, getTopics } from "../../Reducer/TopicSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddTopicModal = ({ openAddTopicModal, setOpenAddTopicModal }) => {
  const dispatch = useDispatch();
  const { levelList, addloading } = useSelector((state) => state?.topicsData);
  console.log("levelList", levelList);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      level_id: "",
    },
  });

  useEffect(() => {
    dispatch(getlevelList());
  }, [dispatch]);

  const onSubmit = (data) => {
    console.log("Data:", data);
    dispatch(addTopic(data)).then((res) => {
      console.log("add topic res", res);
      if (res?.payload?.status_code === 201) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(getTopics());
        setOpenAddTopicModal(false);
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
        show={openAddTopicModal}
        onClose={() => setOpenAddTopicModal(false)}
      >
        <Modal.Header className="border-0 pb-0">Add New Topic</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
              <div>
                <Label htmlFor="level_id" value="Level ID" />
                <Select
                  id="level_id"
                  {...register("level_id", { required: "Level is required" })}
                >
                  <option value="">Select a level</option>
                  {levelList?.data?.map((level) => (
                    <option key={level?.id} value={level?.id}>
                      {level?.level_name}
                    </option>
                  ))}
                </Select>
                {errors?.level_id && (
                  <p className="text-red-500 text-sm">
                    {errors.level_id.message}
                  </p>
                )}
              </div>
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
              onClick={() => setOpenAddTopicModal(false)}
              type="button"
              className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white"
            >
              {addloading ? "Wait..." : "Add"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AddTopicModal;
