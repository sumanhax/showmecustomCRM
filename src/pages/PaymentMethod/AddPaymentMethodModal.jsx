import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  addPaymentMethod,
  getPaymentMethods,
} from "../../Reducer/PaymentMethodSlice";
import { Button, Label, Modal, TextInput } from "flowbite-react";

const AddPaymentMethodModal = ({
  openAddPaymentMethodModal,
  setOpenAddPaymentMethodModal,
}) => {
  const dispatch = useDispatch();
  const { addloading } = useSelector((state) => state?.paymentMethod);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Data:", data);
    dispatch(addPaymentMethod(data)).then((res) => {
      console.log("add payment method res", res);
      if (res?.payload?.status_code === 201) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(getPaymentMethods());
        setOpenAddPaymentMethodModal(false);
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
        show={openAddPaymentMethodModal}
        onClose={() => setOpenAddPaymentMethodModal(false)}
      >
        <Modal.Header className="border-0 pb-0">
          Add Payment Method
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
              <div>
                <Label htmlFor="name" value="Payment Method Name" />
                <TextInput
                  id="name"
                  {...register("name", {
                    required: "Payment Method Name is required",
                  })}
                />
                {errors?.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="short_name" value="Payment Method Short Name" />
                <TextInput
                  id="short_name"
                  {...register("short_name", {
                    required: "Payment Method Short Name is required",
                  })}
                />
                {errors?.short_name && (
                  <p className="text-red-500 text-sm">
                    {errors.short_name.message}
                  </p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex flex-col sm:flex-row sm:justify-end gap-2 border-0 pt-0">
            <Button
              onClick={() => setOpenAddPaymentMethodModal(false)}
              type="button"
              className="w-full sm:w-auto bg-black hover:bg-red-800 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-[#52b69a] hover:bg-black text-white"
            >
              {addloading ? "Wait..." : "Add"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AddPaymentMethodModal;
