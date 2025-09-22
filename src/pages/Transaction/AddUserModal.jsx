import { Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUser, userList } from "../../Reducer/TransactionSlice";
import { toast } from "react-toastify";

const AddUserModal = ({
  openAddNewProjectModal,
  setOpenAddNewProjectModal,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    dispatch(addUser(data)).then((res) => {
      console.log("Res: ", res);
      if (res?.payload?.status_code === 201) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });

        setOpenAddNewProjectModal(false);
        dispatch(userList());
      } else if (res?.payload?.response?.status === 422) {
        toast.error("User Already Exists", {
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
        show={openAddNewProjectModal}
        onClose={() => setOpenAddNewProjectModal(false)}
        size="6xl"
      >
        <Modal.Header className="coose_product_bg">Add User</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white shadow-xl py-12 rounded-lg mb-16">
              <div className="md:flex gap-8 px-6 lg:px-12">
                <div className="w-full lg:w-6/12">
                  <div className="mb-6">
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="First Name" />
                    </div>
                    <TextInput
                      type="text"
                      sizing="md"
                      placeholder="First Name"
                      {...register("first_name", { required: true })}
                    />
                    {errors?.first_name && (
                      <p className="text-red-500">First Name is Required</p>
                    )}
                    {console.log("errors", errors)}
                  </div>
                  <div className="mb-6">
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Email" />
                    </div>
                    <TextInput
                      type="email"
                      placeholder="Email"
                      {...register("email", { required: true })}
                    />
                    {errors?.email && (
                      <p className="text-red-500">Email is Required</p>
                    )}
                  </div>
                </div>
                <div className="w-full lg:w-6/12">
                  <div className="mb-6">
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="Last Name" />
                    </div>

                    <TextInput
                      type="text"
                      sizing="md"
                      placeholder="Last Name"
                      className="w-full"
                      {...register("last_name", { required: true })}
                    />
                    {errors?.last_name && (
                      <p className="text-red-500">Last Name is Required</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="mb-2 block">
                      <Label htmlFor="base" value="User Name" />
                    </div>
                    <TextInput
                      type="text"
                      sizing="md"
                      placeholder="User Name"
                      {...register("user_name", { required: true })}
                    />
                    {errors?.user_name && (
                      <p className="text-red-500">User Name is Required</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end items-center gap-4 pt-10 px-12">
                <button
                  type="submit"
                  className="bg-[#AB54DB] hover:bg-[#515151] text-white text-base leading-[18px] font-semibold text-center rounded-lg px-7 py-3"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AddUserModal;
