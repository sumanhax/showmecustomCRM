import React, { useCallback, useEffect } from "react";

import { Checkbox, Pagination, Table, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { visaIcon } from "../../assets/images/images";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import {
  loginToUser,
  searchUser,
  userList,
  userStatus,
} from "../../Reducer/TransactionSlice";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils/FormatData";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Base64 } from "js-base64";
import debounce from "lodash.debounce";
import AddUserModal from "./AddUserModal";

const Transaction = () => {
  // const [switch1, setSwitch1] = useState(false);
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddNewProjectModal, setOpenAddNewProjectModal] = useState(false);
  const { userListData, userStatusData, userSearchData } = useSelector(
    (state) => state?.transaction
  );
  console.log("userList", userListData);
  console.log("userStatusData", userStatusData);
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    dispatch(
      userList({
        page: currentPage,
        limit: 10,
      })
    ).then((res) => {
      console.log("res", res);
      const total = res?.payload?.total_page;
      setTotalPage(Number.isInteger(total) && total > 0 ? total : 1);
    });
  }, [currentPage, limit]);
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  console.log("userSearchData");

  const handleToggle = (userid) => {
    console.log("userid", userid);
    dispatch(userStatus({ id: userid })).then((res) => {
      console.log("res", res);
      if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(
          userList({
            page: currentPage,
            limit: 10,
          })
        );
      } else {
        toast.error(res?.payload?.response?.data?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        dispatch(searchUser({ content: query })).then((res) => {
          // if (res?.payload?.status_code === 200) {
          //   toast.success("Search results loaded", { position: "top-right" });
          // } else {
          //   toast.error("Failed to fetch search results", {
          //     position: "top-right",
          //   });
          // }
        });
      }
    }, 500),
    [dispatch]
  );

  // const handleInputChange = (e) => {
  //   const value = e.target.value;
  //   setSearchInput(value);
  //   debouncedSearch(value);
  // };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() === "") {
      // Fetch all users if search input is cleared
      dispatch(userList());
    } else {
      // Call debounced search for other input
      debouncedSearch(value);
    }
  };
  const handleAddUser = () => {
    setOpenAddNewProjectModal(true);
  };
  const handleWallet = (id) => {
    nevigate(`/user-wallet/${id}`);
  };
  const handleVideo = (id) => {
    nevigate(`/user-video/${id}`);
  };
  const handleTransaction = (id) => {
    nevigate(`/user-transaction/${id}`);
  };
  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between mb-4">
            <div className="w-full max-w-sm min-w-[200px]">
              {/* <div className="relative">
                <input
                  className="w-full bg-[#F9EFFF] placeholder:text-black text-black text-[15px] border border-[#AB54DB] rounded-md pl-3 pr-28 py-2.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleInputChange}
                />
                <button
                  className="absolute top-1 right-1 flex items-center rounded py-1 px-2.5 border border-transparent text-center text-2xl text-black transition-all focus:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  <CiSearch />
                </button>
              </div> */}
            </div>
            {/* <div>
              <button
                onClick={() => handleAddUser()}
                className="bg-[#AB54DB] hover:bg-black px-6 py-2 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add User
              </button>
            </div> */}
          </div>
          <div className="overflow-x-auto  max-h-[800px]">
            <Table hoverable>
              <Table.Head>
                {/* <Table.HeadCell className="bg-[#F9EFFF]">
                  Order ID
                </Table.HeadCell> */}
                <Table.HeadCell className="bg-[#f3f2f7] rounded-tl-lg">
                  Full Name
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#f3f2f7]">
                  Email ID
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#f3f2f7]">Mobile</Table.HeadCell>
                <Table.HeadCell className="bg-[#f3f2f7]">Status</Table.HeadCell>
                <Table.HeadCell className="bg-[#f3f2f7]">Wallet</Table.HeadCell>
                <Table.HeadCell className="bg-[#f3f2f7]">
                  Transaction
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#f3f2f7] rounded-tr-lg">
                  Videos
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y ">
                {userListData?.data?.map((userData) => (
                  <Table.Row
                    key={userData?.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 border-b border-[#DFDFDF]"
                  >
                    <Table.Cell>
                      {userData?.first_name} {userData?.last_name}
                    </Table.Cell>
                    <Table.Cell>{userData?.email}</Table.Cell>
                    <Table.Cell>{userData?.phone}</Table.Cell>
                    <Table.Cell>
                      <ToggleSwitch
                        checked={userData?.is_active === 1}
                        label=""
                        onChange={() => handleToggle(userData?.id)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => handleWallet(userData?.id)}
                        className="bg-[#52b69a]  p-2 rounded-lg text-white"
                      >
                        View Details
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => handleTransaction(userData?.id)}
                        className="bg-[#52b69a]  p-2 rounded-lg text-white"
                      >
                        View Details
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => handleVideo(userData?.id)}
                        className="bg-[#52b69a]  p-2 rounded-lg text-white"
                      >
                        View Details
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          {userListData?.total_page > 1 && (
            <div className="flex justify-center items-center mt-4 pagination_sec">
              <Pagination
                layout="pagination"
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={onPageChange}
                previousLabel=""
                nextLabel=""
                showIcons
              />
            </div>
          )}
        </div>
      </div>
      {openAddNewProjectModal && (
        <AddUserModal
          openAddNewProjectModal={openAddNewProjectModal}
          setOpenAddNewProjectModal={setOpenAddNewProjectModal}
        />
      )}
    </div>
  );
};

export default Transaction;
