import { Link, useNavigate } from "react-router-dom";
import { LoginImg, logo } from "../../../assets/images/images";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../../Reducer/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginBackup = () => {
  const navigate = useNavigate();
  // const signinHandler = () => {
  //   navigate("/dashboard");
  // };
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(login(data)).then((res) => {
      // console.log("Res: ", res);
      if (res?.payload?.status_code === 200) {
        // toast.success(res?.payload?.message, {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   progress: undefined,
        //   theme: "light",
        // });
        navigate("/dashboard");
      }
    });
  };
  return (
    <div className="my-0 lg:my-0 mx-4 lg:mx-0 flex justify-center items-center">
      <div className="w-full my-0 mx-auto">
        <div className="flex h-screen">
          <div
            className="w-6/12 bg-cover"
            style={{ backgroundImage: `url("${LoginImg}")` }}
          >
            &nbsp;
          </div>
          <ToastContainer />
          <div className="w-6/12 flex justify-center items-center">
            <div className="w-8/12">
              {/* <div className="text-center mb-8">
              <img className="inline-block" src={logo} />
            </div> */}
              <h1 className="text-[50px] leading-[60px] text-[#4abef1] pb-8">
                <span className="text-black">Sales automation </span> make easy
              </h1>
              <div className="login_area">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6">
                    <input
                      type="text"
                      id="email"
                      className="bg-white border border-[#4abef1] text-[#888888] text-base rounded-xl focus:ring-[#4abef1] focus:border-[#4abef1] block w-full py-4 px-3"
                      placeholder="Enter your User Name"
                      {...register("user_name", { required: true })}
                    />
                    {errors.user_name && (
                      <span className="text-red-500">
                        User Name is required
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between">
                      <div className="block md:hidden">
                        <Link
                          className="text-base md:text-xl text-teal-400 font-bold hover:text-teal-500"
                          to="/forgot-password"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                    <input
                      placeholder="Enter your password"
                      type="password"
                      id="password"
                      className="bg-white border border-[#4abef1] text-[#888888] text-base rounded-xl focus:ring-[#4abef1] focus:border-[#4abef1] block w-full py-4 px-3"
                      {...register("password", { required: true })}
                    />
                    {errors.password && (
                      <span className="text-red-500">Password is required</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="text-white bg-[#4abef1] font-Manrope font-extrabold text-[23px] mb-2 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl text-xl w-full px-5 py-3.5 text-center"
                  >
                    Log In
                  </button>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <Link
                        className="text-[#636363] text-base font-normal hover:text-black"
                        to="/register"
                      >
                        {/* Register! */}
                      </Link>
                    </div>
                    <div className="hidden md:block">
                      <Link
                        className="text-[#636363] text-base font-normal hover:text-black"
                        to="/forgot-password"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </form>
                <div className="break_area relative">
                  <p className="text-[#BABABA] text-[22px] uppercase bg-white px-4 relative z-10 text-center w-[100px] mx-auto">
                    Or
                  </p>
                </div>
                <div className="flex justify-center items-center mt-2">
                  <div className="flex justify-center items-center">
                    <FcGoogle className="text-4xl mr-1" />
                    <p className="text-black text-lg">Google</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBackup;
