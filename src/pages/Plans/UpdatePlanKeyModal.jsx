import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { planKeyList, updatePlanKey } from "../../Reducer/PlanKeySlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const UpdatePlanKeyModal = ({ openUpdatePlanKeyModal, setOpenUpdatePlanKeyModal, planKeyId }) => {
    console.log("planKeyId", planKeyId)
    const dispatch = useDispatch();
    const { updateloading } = useSelector((state) => state?.plankey);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        dispatch(planKeyList({ plan_key_id: planKeyId })).then((res) => {
            console.log("plan key list res", res)
            if (res?.paylod?.status_code === 200) {
                setValue("plan_price_key", res?.payload?.results?.[0]?.plan_price_key);
                setValue("plan_extrakey_key", res?.payload?.results?.[0]?.plan_extrakey_key);
            }
        })
    }, [dispatch, planKeyId, setValue]);

    const onSubmit = (data) => {
        console.log("Data:", data);
        dispatch(updatePlanKey({ ...data, plan_key_id: planKeyId })).then((res) => {
            console.log("update plan key res", res);
            if (res?.payload?.status_code === 200) {
                toast.success(res?.payload?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                    theme: "light",
                });
                dispatch(planKeyList())
                setOpenUpdatePlanKeyModal(false);
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
            <Modal show={openUpdatePlanKeyModal} onClose={() => setOpenUpdatePlanKeyModal(false)}>
                <Modal.Header>Add Plan Key</Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
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
                            onClick={() => setOpenUpdatePlanKeyModal(false)}
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

export default UpdatePlanKeyModal;