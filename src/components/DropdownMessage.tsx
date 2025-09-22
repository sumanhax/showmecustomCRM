import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMessage } from "react-icons/ai";

import UserOne from '../assets/imagesource/user/user-01.png';
import UserTwo from '../assets/imagesource/user/user-02.png';
import UserThree from '../assets/imagesource/user/user-03.png';
import UserFour from '../assets/imagesource/user/user-04.png';

const DropdownMessage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <li className="relative" x-data="{ dropdownOpen: false, notifying: true }">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray-100 hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        to="#"
      >
        <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-meta-1">
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>
        <AiOutlineMessage className='text-xl text-blue-700' />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4 py-3">
          <h5 className="text-sm font-medium text-gray-400">Messages</h5>
        </div>

        <ul className="flex h-80 flex-col overflow-y-auto">
          <li>
            <Link
              className="flex gap-4 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12 w-12 rounded-full">
                <img src={UserTwo} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black">
                  Mariya Desoja
                </h6>
                <p className="text-sm text-gray-600">I like your confidence 💪</p>
                <p className="text-xs text-gray-600">2min ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12 w-12 rounded-full">
                <img src={UserOne} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Robert Jhon
                </h6>
                <p className="text-sm text-gray-600">Can you share your offer?</p>
                <p className="text-xs text-gray-600">10min ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12 w-12 rounded-full">
                <img src={UserThree} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Henry Dholi
                </h6>
                <p className="text-sm text-gray-600">I cam across your profile</p>
                <p className="text-xs text-gray-600">1day ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12 w-12 rounded-full">
                <img src={UserFour} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Cody Fisher
                </h6>
                <p className="text-sm text-gray-600">I’m waiting for you response!</p>
                <p className="text-xs text-gray-600">5days ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12 w-12 rounded-full">
                <img src={UserTwo} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Mariya Desoja
                </h6>
                <p className="text-sm text-gray-600">I like your confidence 💪</p>
                <p className="text-xs text-gray-600">2min ago</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      {/* <!-- Dropdown End --> */}
    </li>
  );
};

export default DropdownMessage;
