import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addPlanKey, paymentMethodList } from "../../Reducer/PlanKeySlice";

const AddPlanKeyModal = ({ openAddPlanKeyModal, setOpenAddPlanKeyModal, detailsId }) => {
    console.log("detailsId", detailsId)
    const dispatch = useDispatch();
    const { addloading, paymentMethods } = useSelector((state) => state?.plankey);
    console.log("paymentMethods", paymentMethods)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            payment_id: '',
        },
    });

    useEffect(() => {
        dispatch(paymentMethodList());
    }, [dispatch]);

    const onSubmit = (data) => {
        console.log("Data:", data);
        dispatch(addPlanKey({ ...data, plan_details_id: detailsId })).then((res) => {
            console.log("add plan key res", res);
            if (res?.payload?.status_code === 201) {
                toast.success(res?.payload?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                    theme: "light",
                });
                setOpenAddPlanKeyModal(false);
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
            <Modal show={openAddPlanKeyModal} onClose={() => setOpenAddPlanKeyModal(false)}>
                <Modal.Header>Add Plan Key</Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
                            <div>
                                <Label htmlFor="payment_id" value="Payment ID" />
                                <Select
                                    id="payment_id"
                                    {...register("payment_id", { required: "Payment is required" })}
                                >
                                    <option value="">Select a payment</option>
                                    {paymentMethods?.data
                                        ?.filter((pay) => pay?.status === 1)
                                        .map((pay) => (
                                            <option key={pay?.id} value={pay?.id}>
                                                {pay?.name}
                                            </option>
                                        ))}
                                </Select>
                                {errors?.payment_id && <p className="text-red-500 text-sm">{errors.payment_id.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="plan_price_key" value="Plan Price Key" />
                                <TextInput
                                    id="plan_price_key"
                                    {...register("plan_price_key", { required: "Plan Price Key is required" })}
                                />
                                {errors?.plan_price_key && <p className="text-red-500 text-sm">{errors.plan_price_key.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="plan_extrakey_key" value="Plan ExtraKey Key" />
                                <TextInput
                                    id="plan_extrakey_key"
                                    {...register("plan_extrakey_key", { required: "Plan ExtraKey Key is required" })}
                                />
                                {errors?.plan_extrakey_key && (
                                    <p className="text-red-500 text-sm">{errors.plan_extrakey_key.message}</p>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button
                            onClick={() => setOpenAddPlanKeyModal(false)}
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
    )
};

export default AddPlanKeyModal;