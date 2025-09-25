import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// import Logo from '../images/logo/logo.svg';
// import SidebarLinkGroup from './SidebarLinkGroup';
import SidebarLinkGroup from "../layout/SidebarLinkGroup";
import { logo, showme, smallLogo } from '../../assets/images/images';

import { AiFillSetting, AiFillTag, AiFillTags, AiOutlineDashboard, AiOutlineLogout, AiOutlineNotification, AiOutlineUser, BiLineChart, BiLineChartDown, BsPersonWorkspace, BsViewStacked, FiHome, MdManageAccounts, MdOutlineShoppingCartCheckout, MdSpaceDashboard, MdViewStream, PiClipboardTextBold, RiCoupon2Fill, RiCouponLine, RxDashboard, TfiMenuAlt } from "../../assets/icons/index";
import { FaCircle, FaFirstOrderAlt } from 'react-icons/fa';
import { MdSportsKabaddi, MdFamilyRestroom, MdSchool, MdAdminPanelSettings, MdOutlineSubscriptions, MdSubscriptions, MdTopic, MdPayment, MdClass, MdCategory } from 'react-icons/md';
import userRoles from '../../pages/utils/userRoles';
import { SiLevelsdotfyi } from "react-icons/si";
import { RiSoundModuleFill } from 'react-icons/ri';
import { GiFireZone } from "react-icons/gi";
import { CiShoppingTag } from 'react-icons/ci';
import { toggleSidebar } from '../../Reducer/SidebarSlice';
import { useDispatch } from 'react-redux';

import { IoMagnet } from "react-icons/io5";

import { PiKanbanFill } from "react-icons/pi";

import { MdOutlineRepeat } from "react-icons/md";
import { useSelector } from 'react-redux';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  const {authData} = useSelector((state:any)=>state.auth);
  const userRole = authData?.data?.role;
  console.log("userRole",userRole);
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);
  // const dispatch = useDispatch();
  const onHoverOpenSidebar = () => {
    setSidebarOpen(false);
    // dispatch(toggleSidebar())
  }
  //   const onHoverCloseSidebar = () => {
  //   setSidebarOpen(true);
  // }
  useEffect(() => {
    setSidebarOpen(true);
  }, [])

  const currentUserRole = userRoles()
  console.log("userRole", currentUserRole);

  return (
    <aside
      ref={sidebar}
      style={{ zIndex: 1 }}
      className={`left-0 top-[0px] z-9999 flex w-72 rounded-3xl flex-col overflow-y-hidden bg-white duration-300 ease-linear absolute h-full lg:h-full min-h-[700px] shadow-xl ${sidebarOpen ? '-translate-x-full lg:static lg:w-24 lg:translate-x-0 ' : 'lg:translate-x-0 lg:static'
        }`}
      onMouseEnter={onHoverOpenSidebar}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-4 py-5 lg:py-[23px]">
        <NavLink className="text-center w-full" to="/crm-dashboard">
   
          {sidebarOpen ?
            <>
              <div className="text-center mb-8">
                <img src={showme} alt="smallLogo" className="inline-block w-6/12" />
              </div>
            </>
            :
            <>
              <div className="text-center mb-8">
                <img src={showme} alt="logo" className="inline-block w-7/12" />
              </div>
            </>
          }

          {/* &nbsp; */}
        </NavLink>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="sidebar_menu no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear overscroll-none">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-0 pb-4 px-4 lg:px-0">
          {/* <!-- Menu Group --> */}
          <div>

            <ul className="mb-6 flex flex-col gap-1.5">

              {/* <!-- Menu Item Calendar --> */}
              {/* <li>
                <NavLink
                  to="/transaction"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('transaction') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <TfiMenuAlt className='text-xl' />
                    </>
                    :
                    <>
                      <TfiMenuAlt className='text-xl' />
                      User List
                    </>
                  }
                </NavLink>
              </li> */}

              {/* <li>
                <NavLink
                  to="/manage-zone"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('coaches') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <GiFireZone className='text-xl' />
                    </>
                    :
                    <>
                      <GiFireZone className='text-xl' />
                      Manage Zone
                    </>
                  }
                </NavLink>
              </li> */}
              {/* Child menu for Coach Sessions */}


              {/* <li>
                <NavLink
                  to="/manage-parents"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('parents') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <MdFamilyRestroom className='text-xl' />
                    </>
                    :
                    <>
                      <MdFamilyRestroom className='text-xl' />
                      Manage User
                    </>
                  }
                </NavLink>
              </li> */}

              {/* CRM Dashboard - Only visible to manager and admin */}
              {(userRole === 'manager' || userRole === 'admin') && (
                <li>
                  <NavLink
                    to="/crm-dashboard"
                    className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('crm-dashboard') &&
                      'bg-graydark dark:bg-meta-4'
                      }`}
                  >
                    {sidebarOpen ?
                      <>
                        <MdCategory className='text-xl' />
                      </>
                      :
                      <>
                        <MdCategory className='text-xl' />
                        CRM Dashboard
                      </>
                    }
                  </NavLink>
                </li>
              )}

              {/* Rep Dashboard - Only visible to rep */}
              {userRole === 'rep' && (
                <li>
                  <NavLink
                    to="/rep-dashboard"
                    className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('rep-dashboard') &&
                      'bg-graydark dark:bg-meta-4'
                      }`}
                  >
                    {sidebarOpen ?
                      <>
                        <MdCategory className='text-xl' />
                      </>
                      :
                      <>
                        <MdCategory className='text-xl' />
                        Rep Dashboard
                      </>
                    }
                  </NavLink>
                </li>
              )}
             
              {/* Leads - Only visible to manager and admin */}
              {(userRole === 'manager' || userRole === 'admin') && (
                <li>
                  <NavLink
                    to="/leads"
                    className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('leads') &&
                      'bg-graydark dark:bg-meta-4'
                      }`}
                  >
                    {sidebarOpen ?
                      <>
                        <IoMagnet className='text-xl' />
                      </>
                      :
                      <>
                        <IoMagnet className='text-xl' />
                        Leads
                      </>
                    }
                  </NavLink>
                </li>
              )}

              {/* Reps - Only visible to manager and admin */}
              {(userRole === 'manager' || userRole === 'admin') && (
                <li>
                  <NavLink
                    to="/reps"
                    className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('reps') &&
                      'bg-graydark dark:bg-meta-4'
                      }`}
                  >
                    {sidebarOpen ?
                      <>
                        <MdOutlineRepeat className='text-xl' />
                      </>
                      :
                      <>
                        <MdOutlineRepeat className='text-xl' />
                        Reps
                      </>
                    }
                  </NavLink>
                </li>
              )}

              {/* Kanban - Only visible to manager and admin */}
              {(userRole === 'manager' || userRole === 'admin') && (
                <li>
                  <NavLink
                    to="/kanban"
                    className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('kanban') &&
                      'bg-graydark dark:bg-meta-4'
                      }`}
                  >
                    {sidebarOpen ?
                      <>
                        <PiKanbanFill className='text-xl' />
                      </>
                      :
                      <>
                        <PiKanbanFill className='text-xl' />
                        Kanban
                      </>
                    }
                  </NavLink>
                </li>
              )}

                 {/* <li>
                <NavLink
                  to="/task-manager"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('manage-mood-masters') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <PiKanbanFill className='text-xl' />
                    </>
                    :
                    <>
                      <PiKanbanFill className='text-xl' />
                      Task Manager
                    </>
                  }
                </NavLink>
              </li> */}

               {/* <li>
                <NavLink
                  to="/manage-question"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('manage-question') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <CiShoppingTag className='text-xl' />
                    </>
                    :
                    <>
                      <CiShoppingTag className='text-xl' />
                      Manage Question
                    </>
                  }
                </NavLink>
              </li> */}
               {/* <li>
                <NavLink
                  to="/manage-answer"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('manage-answer') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <CiShoppingTag className='text-xl' />
                    </>
                    :
                    <>
                      <CiShoppingTag className='text-xl' />
                      Manage Answer
                    </>
                  }
                </NavLink>
              </li> */}

               {/* <li>
                <NavLink
                  to="/manage-blog"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('manage-blog') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <CiShoppingTag className='text-xl' />
                    </>
                    :
                    <>
                      <CiShoppingTag className='text-xl' />
                      Manage Blog
                    </>
                  }
                </NavLink>
              </li> */}

{/* 
                  <li>
                <NavLink
                  to="/manage-mood-equilizer"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('manage-blog') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <CiShoppingTag className='text-xl' />
                    </>
                    :
                    <>
                      <CiShoppingTag className='text-xl' />
                      Manage Mood Equilizer
                    </>
                  }
                </NavLink>
              </li> */}
                
              {/* {
                currentUserRole==='SA'&&(
                  <>
              <li>
                <NavLink
                  to="/manage-roles"
                  className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('roles') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <MdAdminPanelSettings className='text-xl' />
                    </>
                    :
                    <>
                      <MdAdminPanelSettings className='text-xl' />
                      Manage Roles
                    </>
                  }
                </NavLink>
              </li>
                 </>
                )
              }

              {
                currentUserRole === 'SA' && (
                  <>
                    <li>
                      <NavLink
                        to="/manage-plans"
                        className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('roles') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        {sidebarOpen ?
                          <>
                            <MdSubscriptions className='text-xl' />
                          </>
                          :
                          <>
                            <MdSubscriptions className='text-xl' />
                            Manage Plans
                          </>
                        }
                      </NavLink>
                    </li>

                  </>
                )
              }


              {
                currentUserRole === 'SA' && (
                  <>
                    <li>
                      <NavLink
                        to="/manage-level"
                        className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('roles') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        {sidebarOpen ?
                          <>
                            <SiLevelsdotfyi className='text-xl' />
                          </>
                          :
                          <>
                            <SiLevelsdotfyi className='text-xl' />
                            Manage Level
                          </>
                        }
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/manage-topic"
                        className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('roles') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        {sidebarOpen ?
                          <>
                            <MdTopic className='text-xl' />
                          </>
                          :
                          <>
                            <MdTopic className='text-xl' />
                            Manage Topic
                          </>
                        }
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/manage-module"
                        className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('roles') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        {sidebarOpen ?
                          <>
                            <RiSoundModuleFill className='text-xl' />
                          </>
                          :
                          <>
                            <RiSoundModuleFill className='text-xl' />
                            Manage Module
                          </>
                        }
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/payment-method"
                        className={`group relative flex items-center gap-2 rounded-sm px-4 py-2 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('roles') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        {sidebarOpen ?
                          <>
                            <MdPayment className='text-xl' />
                          </>
                          :
                          <>
                            <MdPayment className='text-xl' />
                            Payment Method
                          </>
                        }
                      </NavLink>
                    </li>

                  </>
                )
              } */}


              {/* <li>
                <NavLink
                  to="/plan"
                  className={`group relative flex items-center gap-2 rounded-sm py-2 px-4 ${sidebarOpen ? 'justify-center' : 'justify-start'} font-normal text-sm text-gray-600 duration-300 ease-in-out hover:bg-graydark mb-2 ${pathname.includes('plan') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  {sidebarOpen ?
                    <>
                      <PiClipboardTextBold className='text-2xl' />
                    </>
                    :
                    <>
                      <PiClipboardTextBold className='text-2xl' />
                      Plans
                    </>
                  }
                </NavLink>
              </li>  */}
              {/* <!-- Menu Item Offer Request --> */}





            </ul>
          </div>

        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
