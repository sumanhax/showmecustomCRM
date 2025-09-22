import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getModules,
  moduleDetails,
  updateModule,
} from "../../Reducer/ModuleSlice";
import { toast } from "react-toastify";

const UpdateModuleModal = ({
  openUpdateModuleModal,
  setOpenUpdateModuleModal,
  moduleId,
}) => {
  console.log("moduleId", moduleId);
  const dispatch = useDispatch();
  const { updateloading } = useSelector((state) => state?.modulesData);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(moduleDetails(moduleId)).then((res) => {
      console.log("module details res", res);
      setValue("module_name", res?.payload?.data?.module_name);
      setValue("module_short_name", res?.payload?.data?.module_short_name);
      setValue("module_description", res?.payload?.data?.module_description);
    });
  }, [dispatch, moduleId, setValue]);

  const onSubmit = (data) => {
    console.log("Data:", data);
    dispatch(updateModule({ ...data, module_id: moduleId })).then((res) => {
      console.log("update module res", res);
      if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(getModules());
        setOpenUpdateModuleModal(false);
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
        show={openUpdateModuleModal}
        onClose={() => setOpenUpdateModuleModal(false)}
      >
        <Modal.Header className="border-0 pb-0">
          Update This Module
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
              <div>
                <Label htmlFor="module_name" value="Module Name" />
                <TextInput
                  id="module_name"
                  {...register("module_name", {
                    required: "Module Name is required",
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
              onClick={() => setOpenUpdateModuleModal(false)}
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

export default UpdateModuleModal;
