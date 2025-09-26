import React from "react";
import { Link } from "react-router-dom";
import { logo, logoIcon } from "../../assets/images/images";

import DropdownMessage from "../../components/DropdownMessage";
import DropdownNotification from "../../components/DropdownNotification";
import DropdownUser from "../../components/DropdownUser";
import { BiMenu } from "react-icons/bi";
import { FiAlignLeft } from "react-icons/fi";
import { PiUserList } from "react-icons/pi";
import { TiThMenu } from "react-icons/ti";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../Reducer/SidebarSlice";

function Header(props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) {
  const dispatch = useDispatch();
  return (
    <div className="z-10 sticky top-0 z-999 flex ml-0 rounded-lg mb-6">
      <div className="flex flex-grow items-center justify-between px-6 py-3 shadow-2">
        {props.sidebarOpen ? (
          <div className="">
            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
                dispatch(toggleSidebar());
              }}
              className="z-99999 block rounded-lg bg-[#f20c32] p-1 absolute top-[28px] left-[-12px]"
            >
              <IoMdArrowForward className="text-xl text-white hover:text-black" />
            </button>
            {/* <!-- Hamburger Toggle BTN --> */}
            
              {/* <img src={logoIcon} alt="Logo" /> */}
              <p className="text-3xl text-gray-900 mb-2">Dashboard</p>
              <span className="text-gray-600">
                Monitor and analyze your lead generation performance
              </span>
           
          </div>
        ) : (
          ""
        )}

        {props.sidebarOpen ? (
          ""
        ) : (
          <div className="">
            <div className="">
              {/* <!-- Hamburger Toggle BTN --> */}
              <button
                aria-controls="sidebar"
                onClick={(e) => {
                  e.stopPropagation();
                  props.setSidebarOpen(!props.sidebarOpen);
                  dispatch(toggleSidebar())
                }}
                className="z-99999 block rounded-lg bg-[#f20c32] p-1 absolute top-[28px] left-[-12px]"
              >
                <IoMdArrowBack className="text-xl text-white hover:text-black" />
              </button>
              {/* <!-- Hamburger Toggle BTN --> */}
              
                {/* <img src={logoIcon} alt="Logo" /> */}
                <p className="text-3xl text-gray-900 font-medium">Dashboard</p>
                <span className="text-base text-[#323232]">
                  Monitor and analyze your lead generation performance
                </span>
              
            </div>
          </div>
        )}

        <div className="hidden sm:block"> &nbsp;</div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </div>
  );
}

export default Header;
