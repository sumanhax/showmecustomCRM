import { Label, Textarea, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { TbCheck } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createPlans, planList } from "../../Reducer/PlanSlice";

const CreatePlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(createPlans(data)).then((res) => {
      console.log("Res", res);
      if (res?.payload?.status_code === 201) {
        dispatch(planList());
        navigate("/manage-plans");
      }
    });
  };
  return (
    <>
      <div>
        <div className="wrapper_area my-0 mx-auto">
          <div className="h-full">
            <div className="flex ">
              <div className="w-9/12 p-10 rounded-xl bg-white">
                <h3 className="text-black font-medium text-2xl mb-6">
                  Add Plan
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

                      {/* <div className="mb-5">
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
                          <Label value="Price" className="text-[#777777]" />
                        </div>

                        <TextInput
                          type="text"
                          sizing="md"
                          {...register("price")}
                        />
                      </div> */}
                      <div className="flex gap-3 mt-8">
                        <button
                          onClick={() => {
                            navigate("/manage-plans");
                          }}
                          className="text-white text-sm font-medium bg-black hover:bg-[#9b1c1c] rounded-lg px-4 py-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-white text-sm font-medium bg-[#52b69a] hover:bg-black rounded-lg px-4 py-2"
                        >
                          Add
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
    </>
  );
};
export default CreatePlan;
