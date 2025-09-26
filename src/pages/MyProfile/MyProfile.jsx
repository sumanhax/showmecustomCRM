import { Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { SlEnvolope } from "react-icons/sl";
import { ToastContainer } from "react-toastify";

const MyProfile=()=>{
      const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();
    return(
        <>
        <div>
        <div>
          <ToastContainer />
          <div className='pt-6 lg:pt-0 mb-6'>
              <h3 className='text-[22px] leading-[22px] text-black font-medium pb-4'>My Account</h3>
              <p className='text-[13px] leading-[22px] text-[#747577] font-normal pb-0'>Manage and update your account details in one place.</p>
          </div>
          <div className="bg-white rounded-2xl">
            <div className="w-full lg:w-full p-5 lg:p-10 mb-4">
              <div className="account_setting_section">
                {/* <div className="lg:flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative">
                        {
                          profileData?.res?.avatar ? (
                            <Image src={profileData?.res?.avatar} width={120}
                              height={120} alt='profileUser' className='w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] rounded-[50px] overflow-hidden' />
                          ) : (
                            <Image src={profileUser} alt='profileUser' className='w-[120px] h-[120px] rounded-[50px] overflow-hidden' />
                          )
                        }

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="bg-white p-2 rounded-full shadow-md text-[#757575] hover:bg-[#00806A] hover:text-white"
                          >
                            <FileInput
                              className="absolute opacity-0 h-3 w-5 border border-black"
                              id="file"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                            <MdEdit className="text-xl" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[#000000] text-xl pb-2"> Name</p>
                        <p className="text-[#777777] text-base pb-2">Email </p>
                      </div>
                    </div>
                  </div>
               
                </div> */}
                <div>
                  <form
                 //  onSubmit={handleSubmit(onSubmit)}
                   >
                    <div className="lg:pt-0">
                      <div className="common-section-box-content">
                        <div className="lg:flex gap-8 mb-4">
                        </div>
                        <div className="lg:flex gap-6 mb-3">
                          <div className="w-full lg:w-6/12">
                            <div className="mb-1 block">
                              <Label className="">First Name </Label>
                            </div>
                            <TextInput
                              id="base"
                              type="text"
                              sizing="md"
                              className=""
                              {...register("first_name")}
                              readOnly
                            />
                          </div>
                          <div className="w-full lg:w-6/12">
                            <div className="mb-1 block">
                              <Label className="">Last Name </Label>
                            </div>
                            <TextInput
                              id="base"
                              type="text"
                              sizing="md"
                              className=""
                              {...register("last_name")}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="lg:flex gap-6 mb-3">
                          <div className="w-full lg:w-6/12">
                            <div className="mb-1 block">
                              <Label className="">
                                Email <span className="text-[#ff1a03]"></span>
                              </Label>
                            </div>
                            <TextInput
                              id="base"
                              type="text"
                              sizing="md"
                              required
                              {...register("email")}
                              readOnly
                            />
                          </div>
                     
                        </div>

                        <div className="lg:flex justify-between mt-3">
                          <div className="py-10 w-full mt-5">
                            <p className="text-[#000000] text-[18px] pb-4">My email Address</p>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="bg-[#e6eeec] w-[56px] h-[56px] rounded-full flex justify-center items-center">
                                  <SlEnvolope className="text-2xl text-[#055346]" />
                                </div>
                              </div>
                              <div>
                                <p className="text-[#000000] text-[16px]">My Email</p>
                                <p className="text-[#808080] text-[16px]">1 month ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-10">
                            <p className="text-[#000000] text-[18px] pb-4">Change Paasowrd</p>

                            <div className="w-full lg:w-12/12">
                              <div className="mb-1 block">
                                <Label className="">Old Password </Label>
                              </div>
                              <TextInput
                                id="base"
                                type="password"
                                sizing="md"
                                {...register("oldPassword", { required: "Old Password is Required" })}
                              />
                              {errors?.oldPassword && (
                                <span className="text-red-500">
                                  {errors?.oldPassword?.message}
                                </span>
                              )}
                            </div>
                            <div className="w-full lg:w-12/12">
                              <div className="mb-1 block">
                                <Label className="">New Passowrd </Label>
                              </div>
                              <TextInput
                                id="base"
                                type="password"
                                sizing="md"
                                {...register("newPassword", { required: "New Password is Required" })}
                              />
                              {errors?.newPassword && (
                                <span className="text-red-500">
                                  {errors?.newPassword?.message}
                                </span>
                              )}
                            </div>
                            <div className="w-full lg:w-12/12">
                              <div className="mb-1 block">
                                <Label className="">Confirm Passowrd </Label>
                              </div>
                              <TextInput
                                id="base"
                                type="password"
                                sizing="md"
                                {...register("confirmPassword", {
                                  required: "Confirm Password is required",

                                  validate: (value) =>
                                    value === password || "Password do not Match",
                                })}

                              />
                              {errors.confirmPassword && (
                                <span className="text-red-500">
                                  {errors.confirmPassword.message}
                                </span>
                              )}
                            </div>
                            <div>
                              <button className="bg-[#00806A] hover:bg-black text-white text-base leading-[46px] rounded-[8px] px-8 cursor-pointer mt-3">Update</button>
                            </div>

                          </div>

                        </div>
                        
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
        </>
    )
}
export default MyProfile