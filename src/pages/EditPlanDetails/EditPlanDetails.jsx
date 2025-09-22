import React, { useEffect, useState } from "react";
import { BiMessageSquareEdit, BiSolidImageAdd } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { TbCheck } from "react-icons/tb";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { EconomicIcon, staterIcon } from "../../assets/images/images";

import { Label, TextInput, Textarea } from "flowbite-react";
import { Select as FlowbiteSelect } from "flowbite-react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { planDetails, planList, updatePlans } from "../../Reducer/PlanSlice";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const EditPlanDetails = () => {
  // const options = [
  //   { value: "option1", label: "Option 1" },
  //   { value: "option2", label: "Option 2" },
  //   { value: "option3", label: "Option 3" },
  // ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const planid = queryParams.get("planid"); // Get the 'id' from query params

  console.log("Plan ID:", planid);
  const { planDetailsData, loadingUpdatePlan, planListData } = useSelector(
    (state) => state?.plan
  );

  const [uploadedImage, setUploadedImage] = useState(null);
  const id = useParams();
  console.log("Id", typeof id?.id);
  useEffect(() => {
    dispatch(planList());
  }, []);
  const filerteredData = planListData?.data?.filter(
    (item) => item?.id === parseInt(id?.id)
  );
  console.log("planListData", planListData?.data);

  console.log("filerteredData", filerteredData);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    setValue("plan_name", filerteredData?.[0]?.plan_name);
    setValue("credit", filerteredData?.[0]?.credit);
    setValue("price", filerteredData?.[0]?.price);
    setValue("");
  }, [filerteredData]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const onSubmit = (data) => {
    console.log("Data", data);
    dispatch(updatePlans({ ...data, id: id?.id })).then((res) => {
      console.log("Res", res);
      if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.messsage);
      }
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto">
        <div className="h-full">
          <div className="flex gap-12">
            {/* <div className="w-3/12">
              <div className="w-full mx-0 md:mx-2 mb-4 lg:mb-0">
                <div className="bg-white py-10 px-10 rounded-2xl mt-0">
                  <div className="text-center mb-6">
                    <img
                      src={planid === 2 ? EconomicIcon : staterIcon}
                      alt="staterIcon"
                      className="inline-block"
                    />
                  </div>
                  <h2 className="text-center text-2xl lg:text-[22px] font-semibold text-[#424242] pb-8 block">
                    {planDetailsData?.data?.plan_name}
                  </h2>
                  <h3 className="text-center text-lg font-medium text-black pb-0 block">
                    <span className="text-center text-[50px] font-semibold text-black pb-6 block">
                      ${planDetailsData?.data?.price}
                      <span className="text-center text-sm font-normal text-[#ADADAD]">
                        / {planDetailsData?.data?.plan_interval}
                      </span>
                    </span>
                  </h3>
                  <p className="text-[#828282] text-sm font-normal text-center pb-6 px-8">
                    {planDetailsData?.data?.description}
                  </p>
                  <div className="bg-white rounded-2xl p-0">
                    {features?.map((feature, index) => {
                      const featureName = Object.values(feature).find(
                        (value) => typeof value === "string"
                      );
                      const featureStatus = feature?.status;
                      return (
                        <li
                          key={index}
                          className={`flex items-center text-xs lg:text-sm font-normal mb-5 ${
                            planid === 2 ? "text-white" : "text-black"
                          }`}
                        >
                          {featureStatus ? (
                            <TbCheck
                              className={`${
                                planid === 2 ? "text-white" : "text-[#AB54DB]"
                              } mt-0 mr-2`}
                              size={20}
                            />
                          ) : (
                            <IoMdClose
                              className={`${
                                planid === 2
                                  ? "text-gray-300"
                                  : "text-[#D4546D]"
                              } mt-0 mr-2`}
                              size={20}
                            />
                          )}
                          {featureName}
                        </li>
                      );
                    })}
                    <div className="text-center pt-4 pb-0">
                      <Link
                        className="bg-white hover:bg-[#AB54DB] border-2 block border-[#AB54DB] rounded-lg text-sm lg:text-base font-medium text-[#AB54DB] hover:text-white px-6 lg:px-10 py-3 lg:py-2"
                        to="/"
                      >
                        Choose Plan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="w-9/12 p-10 rounded-xl bg-white">
              <h3 className="text-black font-medium text-2xl mb-6">
                Edit Plan Details
              </h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-40 edit_plan_details_area">
                  <div className="w-8/12">
                    <div className="mb-5">
                      <div className="mb-2 block">
                        <Label value="Plan Name" className="text-[#777777]" />
                      </div>
                      <TextInput
                        type="text"
                        sizing="md"
                        {...register("plan_name")}
                      />
                    </div>

                    <div className="mb-5">
                      <div className="mb-2 block">
                        <Label value="Credit" className="text-[#777777]" />
                      </div>

                      <TextInput
                        type="text"
                        sizing="md"
                        {...register("credit")}
                      />
                    </div>

                    <div className="mb-5">
                      <div className="mb-2 block">
                        <Label value="Plan Price" className="text-[#777777]" />
                      </div>
                      <TextInput
                        type="text"
                        sizing="md"
                        {...register("price")}
                      />
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() => {
                          navigate("/plan");
                        }}
                        className="text-white text-sm font-medium bg-[#515151] hover:bg-[#AB54DB] rounded-lg px-4 py-2.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-white text-sm font-medium bg-[#AB54DB] hover:bg-[#515151] rounded-lg px-4 py-2.5"
                      >
                        {loadingUpdatePlan ? "Wait..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlanDetails;
