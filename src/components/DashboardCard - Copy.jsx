import { Link } from "react-router-dom";

import { Datepicker, Label, Select } from "flowbite-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

import {
  activeSubscriptionIcon,
  ConversionRateImg,
  netRevenueImg,
  TotalCustomerImg,
} from "../assets/images/images";
import { BsDatabaseFill } from "react-icons/bs";
import { FaBoxesStacked, FaCalendarDays } from "react-icons/fa6";
import { MdCancel, MdSubscriptions, MdSupervisorAccount } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import { HiReceiptRefund } from "react-icons/hi2";
import { RiHandCoinFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Base64 } from "js-base64";
import { useEffect, useState } from "react";
import { getAllCouponProduct } from "../Reducer/CouponSlice";
import { useDispatch } from "react-redux";
import { getRevenue } from "../Reducer/RevenueSlice";
import { convertToSubmitFormat } from "../utils/DateSubmitFormatter";
import { dashboardCards } from "../Reducer/DashBoardSlice";
const DashboardCard = () => {
  const { revenueData } = useSelector((state) => state?.rev);
  const { dashboardData } = useSelector((state) => state?.dash);

  const { productDropDownList } = useSelector((state) => state?.coupon);
  const [productId, setProductId] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setTodate] = useState(null);
  const dispatch = useDispatch();
  const jsonObject = localStorage.getItem("userId");
  const userIdDeocoded = Base64.decode(jsonObject);
  const useridjson = JSON.parse(userIdDeocoded);
  const userid = useridjson.user_id;
  const handleProductSelect = (event) => {
    const selectedId = event.target.value;
    // This stores the selected user's id
    setProductId(selectedId);
    console.log("selectedUserid", selectedId);
  };
  const handleFromDate = (date) => {
    setFromDate(convertToSubmitFormat(date));
  };
  const handleToDate = (date) => {
    setTodate(convertToSubmitFormat(date));
  };
  useEffect(() => {
    dispatch(getAllCouponProduct({ user_id: userid }));
    dispatch(dashboardCards());
    dispatch(
      getRevenue({
        start_date: fromDate,
        end_date: toDate,
        user_id: parseInt(userid),
        product_id: parseInt(productId),
      })
    );
  }, [dispatch, userid, toDate, fromDate, productId]);

  console.log("dashboardData", dashboardData);

  const data = revenueData?.revenueByMonth?.map((rData) => {
    return {
      name: rData?.yearMonth,
      revenue: rData?.revenue,
    };
  });
  return (
    <div>
      <div className="lg:flex gap-8">
        <div className="w-full lg:w-8/12">
          <div className="bg-white rounded-lg mb-9 py-6 px-6 shadow-xl shadow-[#767676]/30">
            <div className="lg:flex justify-between mb-8">
              <div className="w-full lg:w-4/12 mb-4 lg:mb-0 product_select">
                <Select required onChange={handleProductSelect}>
                  <option>All products</option>
                  {productDropDownList?.data?.map((dropList) => {
                    return (
                      <>
                        <option value={dropList?.id}>
                          {dropList?.product_name}
                        </option>
                      </>
                    );
                  })}
                </Select>
              </div>
              <div className="w-full lg:w-6/12 md:flex items-center product_calendar_section">
                <div className="flex items-center lg:mr-4 mb-4 md:mb-0">
                  <p className="text-[#808080] font-normal text-base pr-2 w-2/12 lg:w-auto">
                    From
                  </p>
                  <Datepicker onSelectedDateChanged={handleFromDate} />
                </div>
                <div className="flex items-center">
                  <p className="text-[#808080] font-normal text-base pr-2 w-2/12 lg:w-auto">
                    To
                  </p>
                  <Datepicker onSelectedDateChanged={handleToDate} />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-8">
              <p className="text-[#818181] text-xs lg:text-sm font-medium">
                {/* Monthly Total : $00000 */}
              </p>
              <h2 className="text-[#E37B5C] text-sm lg:text-xl font-semibold">
                {fromDate && toDate ? `${fromDate}to ${toDate}` : <></>}
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex gap-4 mb-4 lg:mb-0">
            <div className="w-6/12 p-4 bg-[#FFFBFF] rounded-lg shadow-xl shadow-[#9D3488]/30">
              <div>
                <div className="flex justify-between items-center mb-4 lg:mb-8">
                  <div className="bg-[#FDEEFF] w-14 h-14 rounded-md flex justify-center items-center">
                    <BsDatabaseFill className="text-[#9D3488] text-3xl" />
                  </div>
                  <div className="flex justify-center items-center">
                    <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" />
                  </div>
                </div>
                <p className="text-[#4B4C4D] text-sm md:text-base lg:text-xl font-normal pb-3 lg:pb-6">
                  Net Revenue
                </p>
                <div className="flex justify-between items-center">
                  <div className="mr-4 lg:mr-0">
                    <h3 className="text-[#AE1688] text-xl lg:text-3xl font-semibold">
                      $
                      <span className="text-xl">
                        {parseFloat(revenueData?.revenue)}
                      </span>
                    </h3>
                  </div>
                  <div>
                    <img src={netRevenueImg} alt="netRevenueImg" />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="w-6/12 p-4 bg-[#F9FEFF] rounded-lg shadow-xl shadow-[#17B5FB]/30">
              <div>
                <div className="flex justify-between items-center mb-4 lg:mb-8">
                  <div className="bg-[#E7FBFF] w-14 h-14 rounded-md flex justify-center items-center">
                    <MdSubscriptions className="text-[#17B5FB] text-3xl" />
                  </div>
                  <div className="flex justify-center items-center">
                    <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" />
                  </div>
                </div>
                <p className="text-[#4B4C4D] text-sm md:text-base lg:text-xl font-normal pb-3 lg:pb-6">
                  Active Subscription
                </p>
                <div className="flex justify-between items-center">
                  <div className="mr-4 lg:mr-0">
                    <h3 className="text-[#17B5FB] text-xl lg:text-3xl font-semibold">
                      000
                    </h3>
                  </div>
                  <div>
                    <img
                      src={activeSubscriptionIcon}
                      alt="activeSubscriptionIcon"
                    />
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="w-full lg:w-4/12">
          {/*  */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4 lg:mb-0">
              <div className="w-6/12 p-4 bg-[#EAF8FF] rounded-lg shadow-xl shadow-[#068BC6]/30">
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-[#CCEFFF] w-10 h-10 rounded-md flex justify-center items-center">
                    <AiOutlineTransaction className="text-[#17B5FB] text-2xl" />
                  </div>
                  <div className="flex justify-center items-center">
                    {/* <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" /> */}
                  </div>
                </div>
                <p className="text-[#4B4C4D] text-sm md:text-base font-normal pb-4">
                  Total Transactions
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[#068BC6] text-xl lg:text-3xl font-semibold">
                      {dashboardData?.totalTransactionsAmount}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="w-6/12 p-4 bg-[#FFF5EB] rounded-lg shadow-xl shadow-[#EEBA55]/30">
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-[#FFECC8] w-10 h-10 rounded-md flex justify-center items-center">
                    <MdCancel className="text-[#EEBA55] text-2xl" />
                  </div>
                  <div className="flex justify-center items-center">
                    {/* <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" /> */}
                  </div>
                </div>
                <p className="text-[#4B4C4D] text-sm md:text-base font-normal pb-4">
                  Cancellation
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[#EEBA55] text-xl lg:text-3xl font-semibold">
                      {dashboardData?.cancellationCount}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}

          {/*  */}
          <div className="w-full p-4 bg-[#FFF8F9] rounded-lg mb-6 shadow-xl shadow-[#F95A79]/30">
            <div>
              <div className="flex justify-between items-center mb-8">
                <p className="text-[#4B4C4D] text-base font-normal pb-0">
                  Total Customers
                </p>
                <div className="flex justify-center items-center">
                  {/* <p className="text-[#F53F09] text-xs font-medium">JUN 10</p> */}
                  {/* <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" /> */}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex justify-center items-center">
                  <div className="bg-[#FFE3E9] w-14 h-14 rounded-md flex justify-center items-center mr-4">
                    <MdSupervisorAccount className="text-[#F05472] text-3xl" />
                  </div>
                  <h3 className="text-[#F95A79] text-xl lg:text-3xl font-semibold">
                    {dashboardData?.totalCustomer}
                  </h3>
                </div>
                <div>
                  <img src={TotalCustomerImg} alt="TotalCustomerImg" />
                </div>
              </div>
            </div>
          </div>
          {/*  */}

          {/*  */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4 lg:mb-0">
              <div className="w-6/12 p-4 bg-[#F4FFF7] rounded-lg shadow-xl shadow-[#4CAF4F]/30">
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-[#D0FDDC] w-10 h-10 rounded-md flex justify-center items-center">
                    <FaBoxesStacked className="text-[#4CAF4F] text-2xl" />
                  </div>
                  <div className="flex justify-center items-center">
                    {/* <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" /> */}
                  </div>
                </div>
                <p className="text-[#4B4C4D] text-base font-normal pb-4">
                  Orders
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[#4CAF4F] text-xl lg:text-3xl font-semibold">
                      {dashboardData?.totalOrderCount}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="w-6/12 p-4 bg-[#FAFAFF] rounded-lg shadow-xl shadow-[#6463D6]/30">
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-[#EEF0FF] w-10 h-10 rounded-md flex justify-center items-center">
                    <HiReceiptRefund className="text-[#6463D6] text-2xl" />
                  </div>
                  <div className="flex justify-center items-center">
                    {/* <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" /> */}
                  </div>
                </div>
                <p className="text-[#4B4C4D] text-base font-normal pb-4">
                  Refunds
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[#6463D6] text-xl lg:text-3xl font-semibold">
                      {dashboardData?.refundedCount}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}

          {/*  */}
          {/* <div className="w-full p-4 bg-[#FFF7F4] rounded-lg mb-6 shadow-xl shadow-[#FF7C53]/30">
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-[#4B4C4D] text-sm md:text-base font-normal pb-0">
                  Conversion Rate
                </p>
                <div className="flex justify-center items-center">
                  <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                  <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex justify-center items-center">
                  <div className="bg-[#FFDDD3] w-14 h-14 rounded-md flex justify-center items-center mr-4">
                    <RiHandCoinFill className="text-[#FF7C53] text-3xl" />
                  </div>
                  <h3 className="text-[#FF7C53] text-xl lg:text-3xl font-semibold">
                    00%
                  </h3>
                </div>
                <div>
                  <img src={ConversionRateImg} alt="ConversionRateImg" />
                </div>
              </div>
            </div>
          </div> */}
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
