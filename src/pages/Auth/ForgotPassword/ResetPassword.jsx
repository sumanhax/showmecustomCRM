import { Link, useNavigate, useParams } from "react-router-dom";
import { forgotPasswordIcon } from "../../../assets/images/images";
import { Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../../Reducer/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  console.log("Token:", token);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(resetPassword({ ...data, token: token })).then((res) => {
      console.log("reset:", res);
      if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(res?.payload?.message, {
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
  const password = watch("newPassword");
  return (
    <>
      <div className="my-0 md:my-16 lg:my-0 mx-4 lg:mx-0 flex justify-center items-center h-screen">
        <div className="w-full max-w-lg my-0 mx-auto">
          <div className="text-center mb-4">
            <img className="inline-block w-44" src={forgotPasswordIcon} />
          </div>
          <ToastContainer />
          <h1 className="text-[40px] text-center leading-[40px] text-[#4abef1] pb-5">
            Reset Your Password
          </h1>
          {/* <p className="text-base md:text-lg text-blue-900 font-medium text-center pb-8">
            No worries, we got you covered.
          </p> */}
          <div className="login_area">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="signup-wrapper">
                <div className="mb-3">
                  <div className="mb-1 block">
                    <Label
                      htmlFor="password"
                      value="New Password"
                      className="text-[#1d2245] text-base font-medium font-roboto"
                    />
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="Enter New Password"
                    {...register("newPassword", { required: true })}
                  />
                  {errors?.newPassword && (
                    <h6 className="text-red-600">New Password is Required</h6>
                  )}
                </div>

                <div className="mb-3">
                  <div className="mb-1 block">
                    <Label
                      htmlFor="password"
                      value="Confirm Password"
                      className="text-[#1d2245] text-base font-medium font-roboto"
                    />
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: true,

                      validate: (value) =>
                        value === password || "Password do not Match",
                    })}
                  />
                </div>
                {errors?.confirmPassword && (
                  <h6 className="text-red-600">
                    {errors.confirmPassword.message}
                  </h6>
                )}
                <button
                  type="submit"
                  className="text-white bg-[#4abef1] font-Manrope font-extrabold text-[23px] mb-2 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl text-xl w-full px-5 py-3.5 text-center"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
