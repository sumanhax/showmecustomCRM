import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addPlanDetails,
  getCountry,
  getCurrencyByCountry,
} from "../../Reducer/PlanSlice";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddDetailsModal = ({ openAddModal, setOpenAddModal, editId }) => {
  const { countryData } = useSelector((state) => state?.plan);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCountry());
  }, []);
  console.log("County", countryData);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedCountryId = watch("country_id");

  // Effect to handle currency auto-selection when country changes
  useEffect(() => {
    if (selectedCountryId && selectedCountryId !== "Select") {
      // Find the selected country from countryData
      const selectedCountry = countryData?.data?.find(
        (country) => country?.id == selectedCountryId
      );

      if (selectedCountry?.country_name) {
        // Dispatch the API call to get currency by country name
        dispatch(getCurrencyByCountry(selectedCountry.country_name))
          .then((res) => {
            console.log("Currency API Response:", res);

            // Check if the API call was successful
            if (res?.payload && res?.payload?.length > 0) {
              // Extract currency from the response
              const currencies = res.payload[0]?.currencies;
              if (currencies) {
                // Get the first currency code and name
                const currencyCode = Object.keys(currencies)[0];
                // const currencyName = currencies[currencyCode]?.name;
                // const currencySymbol = currencies[currencyCode]?.symbol;

                // Set the currency field - you can customize the format
                const currencyValue = `${currencyCode}`;
                setValue("currency", currencyValue);

                console.log("Auto-selected currency:", currencyValue);
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching currency:", error);
            // Optionally show an error toast
            // toast.error("Failed to fetch currency for selected country");
          });
      }
    } else {
      // Clear currency field if no country is selected
      setValue("currency", "");
    }
  }, [selectedCountryId, countryData, dispatch, setValue]);

  const onSubmit = (data) => {
    dispatch(addPlanDetails({ ...data, plan_id: editId })).then((res) => {
      console.log("Res", res);
      if (res?.payload?.status_code === 201) {
        toast.success(res?.payload?.message);
        setOpenAddModal(false);
      } else if (res?.payload?.response?.data?.status_code === 400) {
        toast.error(res?.payload?.response?.data?.message);
      }
    });
  };
  const handleCancel = () => {
    setOpenAddModal(false);
  };
  const handleAddClick = () => {
    handleSubmit(onSubmit)(); // Manually trigger form submission
  };
  return (
    <>
      <Modal show={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Modal.Header className="border-0 pb-0">Add Plan Details</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="edit-plan-form">
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Country" />
                </div>
                <Select {...register("country_id")}>
                  <option>Select</option>
                  {countryData?.data?.map((country) => {
                    return (
                      <>
                        <option key={country?.id} value={country?.id}>
                          {country?.country_name}
                        </option>
                      </>
                    );
                  })}
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Price" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Price"
                  {...register("price", {
                    required: "Price is required",
                  })}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Currency" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Currency"
                  {...register("currency", {
                    required: "Currency is required",
                  })}
                  disabled
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            onClick={handleCancel}
            className="focus:outline-none text-white bg-black hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-0.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddClick}
            // Changed from type="submit" to onClick handler
            className="focus:outline-none text-white bg-[#52b69a] hover:bg-black font-medium rounded-lg text-sm px-4 py-0.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddDetailsModal;
