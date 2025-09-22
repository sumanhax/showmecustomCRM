import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { getSubdomain } from "../../Reducer/AuthSlice";
import { DomainReplace } from "../../utils/domainReplace";

const OutsideLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subdomain } = useSelector((state) => state?.auth);
  // useEffect(() => {
  //   dispatch(getSubdomain());
  // }, [dispatch]);

  console.log("SubDomain: ", subdomain?.data?.[0]?.server_domain);
  // localStorage.setItem("subDomain", subdomain?.data?.[0]?.server_domain);
  const subDomain = localStorage.getItem("serverDomainInside");
  console.log("subDomain: ", subDomain);
  const baseURL = window.location.origin;

  // const newBaseURL = baseURL.replace(/^https?:\/\//, "");
  const localUrl = "http://localhost:5173";
  // const url = "http://localhost:5174";
  // const replacedUrl = DomainReplace(url);
  // console.log("replaced Url: ", replacedUrl);

  console.log("BaseURLOutside: ", baseURL);
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
    if (parseToken !== null || parseToken !== null) {
      nevigate("/manage-coaches");
    }
  }, []);

  return (
    <>
      <Suspense fallback={"loading ..."}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default OutsideLayout;
