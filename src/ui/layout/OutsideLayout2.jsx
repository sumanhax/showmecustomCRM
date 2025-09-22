import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const OutsideLayout2 = () => {
  return (
    <>
      <Suspense fallback={"loading ..."}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default OutsideLayout2;
