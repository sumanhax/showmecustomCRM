import { Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createSubDomain } from "../../../Reducer/AuthSlice";
import { Base64 } from "js-base64";

const AfterLoginModal = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const domainStatus = localStorage.getItem("domain_status");
  // const decodedStatus = Base64.decode(domainStatus);
  // const parseDomainStatus = JSON.parse(decodedStatus);
  // console.log("parseDomainStatus", parseDomainStatus);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(createSubDomain(data)).then((res) => {
      console.log("SubDomain Res: ", res);
      if (res?.payload?.status_code === 200) {
        const updateStatus = true;
        localStorage.setItem(
          "domain_status",
          Base64.encode(JSON.stringify({ sub_domain: updateStatus }))
        );
        localStorage.setItem(
          "sub_domain_name",
          Base64.encode(
            JSON.stringify({
              sub_domain_name: res?.payload?.newData?.sub_domain,
            })
          )
        );
        navigate("/dashboard");
      }
    });
  };
  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="4xl"
        className="product_details_area"
      >
        <Modal.Header className="coose_product_bg pl-10"></Modal.Header>
        <Modal.Body className="p-0">
          <div className="relative overflow-x-auto">
            <div className="w-full flex justify-center items-center">
              <div className="w-4/12">
                <h1 className="text-center text-[45px] leading-[55px] text-[#4abef1] pb-8"></h1>
                <div className="login_area">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                      <input
                        type="text"
                        id="domain"
                        className="bg-white border border-[#4abef1] text-[#888888] text-base rounded-lg focus:ring-[#4abef1] focus:border-[#4abef1] block w-full py-3 px-3"
                        placeholder="Enter Sub Domain Name"
                        {...register("sub_domain", { required: true })}
                      />
                    </div>

                    <button
                      type="submit"
                      className="text-white bg-[#4abef1] font-Manrope font-extrabold text-[23px] mb-2 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl text-xl w-full px-5 py-3 text-center"
                    >
                      Create
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
                          {/* Forgot Password? */}
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AfterLoginModal;
