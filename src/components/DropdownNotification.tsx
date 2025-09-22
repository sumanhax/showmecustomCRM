import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineBell } from "react-icons/ai";
import { FaBell } from 'react-icons/fa';
import { BiBell } from 'react-icons/bi';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

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
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        to="#"
        className="relative flex h-8 w-8 items-center justify-center"
      >
        <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>
        <BiBell className='text-2xl text-[#5E5E5E] hover:text-[#ab54db]' />
      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4 py-3">
          <h5 className="text-sm font-medium text-gray-400">Notification</h5>
        </div>

        <ul className="flex h-80 flex-col overflow-y-auto">
          <li>
            <Link
              className="flex flex-col gap-2 border-t border-stroke px-4 py-3 hover:bg-gray-2 text-gray-600"
              to="/"
            >
              <p className="text-sm">
                Edit your information in a swipe Sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim.
              </p>

              <p className="text-xs text-black">12 May, 2025</p>
            </Link>
          </li>
          <li>
            <Link
              className="flex flex-col gap-2 border-t border-stroke px-4 py-3 hover:bg-gray-2 text-gray-600"
              to="/"
            >
              <p className="text-sm">
                It is a long established fact that a reader will be distracted by the readable.
              </p>

              <p className="text-xs text-black">24 Feb, 2025</p>
            </Link>
          </li>
          <li>
            <Link
              className="flex flex-col gap-2 border-t border-stroke px-4 py-3 hover:bg-gray-2 text-gray-600"
              to="#"
            >
              <p className="text-sm">
                There are many variations of passages of Lorem Ipsum available, but the majority have
                suffered
              </p>

              <p className="text-xs text-black">04 Jan, 2025</p>
            </Link>
          </li>
          <li>
            <Link
              className="flex flex-col gap-2 border-t border-stroke px-4 py-3 hover:bg-gray-2 text-gray-600"
              to="#"
            >
              <p className="text-sm">
                There are many variations of passages of Lorem Ipsum available, but the majority have
                suffered
              </p>

              <p className="text-xs text-black">01 Dec, 2024</p>
            </Link>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default DropdownNotification;
