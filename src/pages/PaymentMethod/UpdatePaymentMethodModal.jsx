import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getPaymentMethods, paymentMethodDetail, updatePaymentMethod } from "../../Reducer/PaymentMethodSlice";
import { toast } from "react-toastify";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect } from "react";

const UpdatePaymentMethodModal = ({ openUpdatePaymentMethodModal, setOpenUpdatePaymentMethodModal, paymentMethodId }) => {
    console.log("paymentMethodId", paymentMethodId)
    const dispatch = useDispatch();
    const { updateloading } = useSelector((state) => state?.paymentMethod);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        dispatch(paymentMethodDetail({ payment_method_id: paymentMethodId })).then((res) => {
            console.log("payment method details res", res)
            if (res?.payload?.status_code === 200) {
                setValue("name", res?.payload?.data?.name);
                setValue("short_name", res?.payload?.data?.short_name);
            }
        })
    }, [dispatch, paymentMethodId, setValue]);

    const onSubmit = (data) => {
        console.log("Data:", data);
        dispatch(updatePaymentMethod({ ...data, payment_method_id: paymentMethodId })).then((res) => {
            console.log("update payment method res", res);
            if (res?.payload?.status_code === 200) {
                toast.success(res?.payload?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                    theme: "light",
                });
                dispatch(getPaymentMethods());
                setOpenUpdatePaymentMethodModal(false);
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
        })

    };

    return (
        <>
            <Modal show={openUpdatePaymentMethodModal} onClose={() => setOpenUpdatePaymentMethodModal(false)}>
                <Modal.Header>Update This Payment Method</Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
                            <div>
                                <Label htmlFor="name" value="Payment Method Name" />
                                <TextInput
                                    id="name"
                                    {...register("name", { required: "Payment Method Name is required" })}
                                />
                                {errors?.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="short_name" value="Payment Method Short Name" />
                                <TextInput
                                    id="short_name"
                                    {...register("short_name", { required: "Payment Method Short Name is required" })}
                                />
                                {errors?.short_name && (
                                    <p className="text-red-500 text-sm">{errors.short_name.message}</p>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button
                            onClick={() => setOpenUpdatePaymentMethodModal(false)}
                            type="button"
                            className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white"
                        >
                            {updateloading ? "Wait..." : "Update"}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
};

export default UpdatePaymentMethodModal;