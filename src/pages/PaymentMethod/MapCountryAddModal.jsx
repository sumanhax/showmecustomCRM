import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { countryMapAdd, paymentMethodDropdown } from "../../Reducer/PaymentMethodSlice";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Label, Modal, Select } from "flowbite-react";
import { toast } from "react-toastify";

const MapCountryAddModal = ({ openMapCountryAdd, setOpenMapCountryAdd, paymentMethodId }) => {
    console.log("paymentMethodId", paymentMethodId);
    const dispatch = useDispatch();
    const { countries, addloading } = useSelector((state) => state?.paymentMethod);
    console.log("countries", countries)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            country_id: '',
        },
    });

    useEffect(() => {
        dispatch(paymentMethodDropdown());
    }, [dispatch]);

    const onSubmit = (data) => {
        console.log("Data:", data);
        dispatch(countryMapAdd({ ...data, payment_method_id: paymentMethodId })).then((res) => {
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
                setOpenMapCountryAdd(false);
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
            <Modal show={openMapCountryAdd} onClose={() => setOpenMapCountryAdd(false)}>
                <Modal.Header>Add Country Map</Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className="space-y-4 max-w-full md:max-w-lg mx-auto px-2 sm:px-4">
                            <div>
                                <Label htmlFor="country_id" value="Country ID" />
                                <Select
                                    id="country_id"
                                    {...register("country_id", { required: "Country is required" })}
                                >
                                    <option value="">Select a level</option>
                                    {countries?.data?.map((coun) => (
                                        <option key={coun?.id} value={coun?.id}>
                                            {coun?.name}
                                        </option>
                                    ))}
                                </Select>
                                {errors?.country_id && <p className="text-red-500 text-sm">{errors.country_id.message}</p>}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button
                            onClick={() => setOpenMapCountryAdd(false)}
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

export default MapCountryAddModal;