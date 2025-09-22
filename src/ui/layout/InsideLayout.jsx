import { useEffect, useState } from "react";
import { Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Sidebar from "../layout/Sidebar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getSubdomain } from "../../Reducer/AuthSlice";
const InsideLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const location = useLocation();
  // const isBaseUrl = (endPoint) => {
  //   return location.pathname === endPoint;
  // };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subdomain } = useSelector((state) => state?.auth);
  // useEffect(() => {
  //   dispatch(getSubdomain());
  // }, [dispatch]);

  // console.log("SubDomain: ", subdomain?.data?.[0]?.server_domain);
  // localStorage.setItem("subDomainInside", subdomain?.data?.[0]?.server_domain);
  const subDomain = localStorage.getItem("serverDomainInside");
  console.log("subDomain: ", subDomain);

  const baseURL = window.location.origin;
  // const newBaseURL = baseURL.replace(/^https?:\/\//, "");
  const localUrl = "http://localhost:5173";
  // console.log("BaseURLInside: ", newBaseURL);

  // if (baseURL !== subdomain?.data?.[0]?.server_domain && baseURL !== localUrl) {
  //   navigate("/pageNotFound");
  // }

  // if (baseURL !== subDomain && baseURL !== localUrl) {
  //   navigate("/pageNotFound");
  // }

  const token = sessionStorage.getItem("good_mood_admin_token");
  const parseToken = token ? JSON.parse(token)?.token : null;
  const nevigate = useNavigate();
  useEffect(() => {
    if (parseToken === null || parseToken === null) {
      nevigate("/");
    }
  }, []);

  return (
    <>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="lg:flex overflow-hidden pl-5 temp_bg pt-5">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col mb-24 py-0 mr-6 ml-12">
            {/* <!-- ===== Header Start ===== --> */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className="mx-auto lg:p-4 md:p-6 2xl:p-0">
                <Outlet />
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      </div>
    </>
  );
};

export default InsideLayout;
