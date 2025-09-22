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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getTopics } from "../../Reducer/TopicSlice";
import { addModule, getModules } from "../../Reducer/ModuleSlice";
import { toast } from "react-toastify";

const AddModuleModal = ({ openAddModuleModal, setOpenAddModuleModal }) => {
  const dispatch = useDispatch();
  const { allTopics } = useSelector((state) => state?.topicsData);
  const { addloading } = useSelector((state) => state?.modulesData);
  console.log("allTopics", allTopics);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      topic_id: "",
    },
  });

  useEffect(() => {
    dispatch(getTopics());
  }, [dispatch]);

  const onSubmit = (data) => {
    console.log("Data:", data);
    dispatch(addModule(data)).then((res) => {
      console.log("add module res", res);
      if (res?.payload?.status_code === 201) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(getModules());
        setOpenAddModuleModal(false);
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
        show={openAddModuleModal}
        onClose={() => setOpenAddModuleModal(false)}
      >
        <Modal.Header className="border-0 pb-0">Add New Module</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
              <div>
                <Label htmlFor="topic_id" value="Topic ID" />
                <Select
                  id="topic_id"
                  {...register("topic_id", { required: "Topic is required" })}
                >
                  <option value="">Select a level</option>
                  {allTopics?.data
                    ?.filter(
                      (topic) => topic?.status === 1 && topic?.is_deleted === 0
                    )
                    .map((topic) => (
                      <option key={topic?.id} value={topic?.id}>
                        {topic?.topic_name}
                      </option>
                    ))}
                </Select>
                {errors?.topic_id && (
                  <p className="text-red-500 text-sm">
                    {errors.topic_id.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="module_name" value="Module Name" />
                <TextInput
                  id="module_name"
                  {...register("module_name", {
                    required: "Topic Name is required",
                  })}
                />
                {errors?.module_name && (
                  <p className="text-red-500 text-sm">
                    {errors.module_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="module_short_name" value="Module Short Name" />
                <TextInput
                  id="module_short_name"
                  {...register("module_short_name")}
                />
                {errors?.module_short_name && (
                  <p className="text-red-500 text-sm">
                    {errors.module_short_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="module_description"
                  value="Module Description"
                />
                <Textarea
                  id="module_description"
                  rows={3}
                  {...register("module_description", {
                    required: "Description is required",
                  })}
                />
                {errors?.module_description && (
                  <p className="text-red-500 text-sm">
                    {errors.module_description.message}
                  </p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex flex-col sm:flex-row sm:justify-end gap-2 border-0 pt-0">
            <Button
              onClick={() => setOpenAddModuleModal(false)}
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

export default AddModuleModal;
