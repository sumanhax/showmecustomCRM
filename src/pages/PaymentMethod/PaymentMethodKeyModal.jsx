import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getPaymentMethodKeys, getPaymentMethods, updatePaymentMethodKey } from "../../Reducer/PaymentMethodSlice";

const PaymentMethodKeyModal = ({ openPaymentMethodKey, setOpenPaymentMethodKey, paymentMethodId }) => {
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
        dispatch(getPaymentMethodKeys({ id: paymentMethodId })).then((res) => {
            console.log("payment method keys res", res)
            if (res?.payload?.status_code === 200) {
                setValue("public_key", res?.payload?.data?.[0]?.public_key);
                setValue("private_key", res?.payload?.data?.[0]?.private_key);
                setValue("additional_key", res?.payload?.data?.[0]?.aditional_key);
            }
        })
    }, [dispatch, paymentMethodId, setValue]);

    const onSubmit = (data) => {
        console.log("Data:", data);
        dispatch(updatePaymentMethodKey({ ...data, payment_id: paymentMethodId })).then((res) => {
            console.log("update payment method key res", res);
            if (res?.payload?.status_code === 200 || res?.payload?.status_code === 201) {
                toast.success(res?.payload?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                    theme: "light",
                });
                dispatch(getPaymentMethods());
                setOpenPaymentMethodKey(false);
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
            <Modal show={openPaymentMethodKey} onClose={() => setOpenPaymentMethodKey(false)}>
                <Modal.Header>Payment Method Keys</Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
                            <div>
                                <Label htmlFor="public_key" value="Public Key" />
                                <TextInput
                                    id="public_key"
                                    {...register("public_key", { required: "Public Key is required" })}
                                />
                                {errors?.public_key && <p className="text-red-500 text-sm">{errors.public_key.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="private_key" value="Private Key" />
                                <TextInput
                                    id="private_key"
                                    {...register("private_key", { required: "Private Key is required" })}
                                />
                                {errors?.private_key && <p className="text-red-500 text-sm">{errors.private_key.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="additional_key" value="Additional Key" />
                                <TextInput
                                    id="additional_key"
                                    {...register("additional_key", { required: "Additional Key is required" })}
                                />
                                {errors?.additional_key && <p className="text-red-500 text-sm">{errors.additional_key.message}</p>}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button
                            onClick={() => setOpenPaymentMethodKey(false)}
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

export default PaymentMethodKeyModal;