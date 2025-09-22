import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiSolidUser, BiSolidContact, AiFillSetting, AiOutlineLogout } from "../assets/icons/index";

import UserOne from '../assets/imagesource/user/user-01.png';
import { useDispatch } from 'react-redux';
import { logout } from '../Reducer/AuthSlice';
import { Base64 } from 'js-base64';
import { viewProfile } from '../Reducer/ProfileSlice';
import { useSelector } from 'react-redux';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { profileDetail } = useSelector((state) => state.profile);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    navigate("/");
  };
  // const userName = localStorage.getItem('adminType')
  // const decodedUserName = Base64.decode(userName)
  // const parseUserName = JSON.parse(decodedUserName)

  // useEffect(() => {
  //   dispatch(viewProfile())
  // }, [dispatch]);


  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-xs font-medium text-black">
            User Name
          </span>
          <span className="block text-xs text-gray-400">
            {/* {parseUserName?.user_type} */}
            Admin
          </span>
        </span>

        <span className="h-8 w-8 rounded-full">
          {/* <img src={profileDetail?.data?.avatar ? profileDetail?.data?.avatar : UserOne} alt="User" /> */}
        </span>

        <svg
          className={`hidden fill-current sm:block ${dropdownOpen ? 'rotate-180' : ''
            }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-3 flex w-52 flex-col rounded-sm border border-stroke bg-white shadow-md ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
      >
        <ul className="flex flex-col gap-3 border-b border-stroke px-4 py-4">
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm font-normal duration-300 ease-in-out text-[#2E2E2E] hover:text-[#f20c32]"
            >
              <BiSolidUser className='text-lg' />
              My Profile
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-sm font-normal duration-300 ease-in-out text-[#2E2E2E] hover:text-[#f20c32]"
            >
              <AiFillSetting className='text-lg' />
              Account Settings
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="flex items-center gap-2 py-3 px-4 text-sm font-normal duration-300 ease-in-out text-[#2E2E2E] hover:text-[#f20c32]">
          <AiOutlineLogout className='text-lg' />
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
