import { Link, useNavigate } from "react-router-dom";
import { LoginImg, logo, showme } from "../../../assets/images/images";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login, managerLogin, repsLogin } from "../../../Reducer/AuthSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

import AfterLoginModal from "./AfterLoginModal";
import { Checkbox, Label, Select } from "flowbite-react";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  // const domainStatus = localStorage.getItem("domain_status");
  // console.log("domainStatus: ", domainStatus);

  // const subDomainStatus = domainStatus
  //   ? JSON.parse(Base64.decode(domainStatus))
  //   : null;
  // console.log("subDomainStatus: ", subDomainStatus);

  // const signinHandler = () => {
  //   navigate("/dashboard");
  // };
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(" ");
  const [openModal, setOpenModal] = useState(false);

  const { loadingLogin } = useSelector((state) => state?.auth);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const savedUsername = Cookies.get("username");
    const savedPassword = Cookies.get("password");

    if (savedUsername && savedPassword) {
      setValue("username", savedUsername);
      setValue("password", savedPassword);
    }
  }, [setValue]);

  const onSubmit = (data) => {
    if (data?.rememberMe) {
      Cookies.set("username", data?.username, { expires: 7 });
      Cookies.set("password", data?.password, { expires: 7 });
    } else {
      Cookies.remove("username");
      Cookies.remove("password");
    }
    if (data.role === "Manager") {
      dispatch(managerLogin(data))
        .then((res) => {
          console.log("Res manager: ", res);
          if (res?.payload?.status_code === 200) {
            navigate("/crm-dashboard");
          }else if(res?.payload?.response?.data?.status_code === 422){
            toast.error(res?.payload?.response?.data?.message);
          }else {
            toast.error(res?.payload?.response?.data?.message);
          }
        })
        .catch((err) => {
          console.log("err", err);
          const errorMessage = err?.payload?.message || err?.payload?.response?.data?.message || err?.message || "An error occurred";
          toast.error(errorMessage);
        });
    }else if(data.role==='Reps'){
      dispatch(repsLogin(data)).then((res)=>{
        if(res?.payload?.status_code===200){
          navigate("/rep-dashboard");
        }else if(res?.payload?.response?.data?.status_code === 422){
          toast.error(res?.payload?.response?.data?.message);
        }else {
          toast.error(res?.payload?.response?.data?.message);
        }
      })
    } 
    
    else {
      dispatch(login(data)).then((res) => {
        console.log("Res admin: ", res);
        if (res?.payload?.status_code === 200) {
         // navigate("/crm-dashboard");
         navigate("/brand")
        }else if(res?.payload?.response?.data?.status_code === 422){
          toast.error(res?.payload?.response?.data?.message);
        }else {
          toast.error(res?.payload?.response?.data?.message);
        }
      });
    }
  };
  return (
    <>
    <div className="my-0 lg:my-0 mx-4 lg:mx-0 flex justify-center items-center wrapper_bg_area">
      <div className="w-full my-0 mx-auto">
        <div className="lg:flex h-screen">
          <div className="lg:w-6/12 flex justify-center items-center">
            <div className="w-10/12 lg:w-7/12">
              <div className="text-center lg:mb-0">
                <img src={showme} alt="logo" className="inline-block w-7/12" />
              </div>
              <h1 className="text-center font-medium text-[20px] lg:text-[25px] leading-[45px] text-black pb-4 lg:pb-6">
                Sign In to Your Account
              </h1>
              <div className="login_area">
                {errorMessage && (
                  <h6 className="text-[#ff1a03] text-center mb-4">
                    {errorMessage}
                  </h6>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6">
                    <Label className="text-[15px] text-[#6C6B6B] font-normal pb-2 block">
                      Your User Name
                    </Label>
                    <input
                      type="text"
                      id="email"
                      className="bg-white border border-[#dfdfdf] text-[#888888] text-sm rounded-lg focus:ring-[#f1d9ff] focus:border-[#f1d9ff] block w-full py-3 px-3"
                      placeholder="Enter Your User Name"
                      {...register("username", { required: true })}
                    />
                    {errors.username && (
                      <small className="text-red-500">
                        User Name is required
                      </small>
                    )}
                  </div>
                  <div className="mb-6">
                    {/* <div className="flex justify-between">
                      <div className="block md:hidden">
                        <Link
                          className="text-base md:text-xl text-teal-400 font-bold hover:text-teal-500"
                          to="/forgot-password"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </div> */}
                    <Label className="text-[15px] text-[#6C6B6B] font-normal pb-2 block">
                      Your Password
                    </Label>
                    <input
                      placeholder="Password"
                      type="password"
                      id="password"
                      className="bg-white border border-[#dfdfdf] text-[#888888] text-sm rounded-lg focus:ring-[#f1d9ff] focus:border-[#f1d9ff] block w-full py-3 px-3"
                      {...register("password", { required: true })}
                    />
                    {errors.password && (
                      <small className="text-red-500">
                        Password is required
                      </small>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="mb-2 block">
                      <Label htmlFor="countries">User Role</Label>
                    </div>
                    <Select
                      id="countries"
                      {...register("role", { required: true })}
                    >
                      <option value="">Select User Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Reps">Representative</option>
                    </Select>
                    {errors.role && (
                      <small className="text-red-500">
                        User Role is required
                      </small>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="text-white bg-[#f20c32] font-Manrope font-extrabold text-[23px] mb-2 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-0 text-xl w-full px-5 py-3 text-center"
                  >
                    {loadingLogin ? "Wait..." : "Log In"}
                  </button>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex items-center gap-1">
                        <Checkbox id="remember" {...register("rememberMe")} />
                        <Label
                          htmlFor="remember"
                          className="text-[#615D5D] font-normal text-sm"
                        >
                          Remember me!
                        </Label>
                      </div>
                    </div>
                    {/* <div className="hidden md:block">
                      <Link
                        className="text-[#3e57da] text-sm font-normal hover:text-black"
                        to="/forgot-password"
                      >
                        Forgot Password?
                      </Link>
                    </div> */}
                  </div>
                </form>
                {/* <div className="break_area relative">
                  <p className="text-[#BABABA] text-[22px] uppercase bg-white px-4 relative z-10 text-center w-[100px] mx-auto">
                    Or
                  </p>
                </div> */}
                {/* <div className="break_area relative pt-2 pb-2">
                  <p className="text-[#525252] text-sm leading-[22px] px-4 relative z-10 text-center w-[160px] mx-auto bg-white">
                    Or Continue With
                  </p>
                </div> */}
                {/* <div className="flex justify-center items-center mt-4">
                  <div className="flex justify-center items-center border border-[#747474] px-4 py-2 rounded-md">
                    <FcGoogle className="text-2xl mr-1.5" />
                    <p className="text-black text-base">Google</p>
                  </div>
                </div> */}

                {/* <div className="text-center mt-10">
                  <p className="text-[#615D5D] text-sm">
                    Don’t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-[#000000] hover:text-[#615D5D]"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div> */}
              </div>
            </div>
          </div>
          <div
            className="w-6/12 bg-cover hidden lg:block"
            style={{ backgroundImage: `url("${LoginImg}")` }}
          >
            &nbsp;
          </div>
        </div>
      </div>
      {openModal && (
        <AfterLoginModal openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </div>
    </>
  );
};

export default Login;
