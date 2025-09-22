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
  gCurve,
  netRevenueImg,
  oCurve,
  rCurve,
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
import OrderStatus from "./OrderStatus/OrderStatus";
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
          <div className="flex gap-8 mb-4 lg:mb-8">
            <div className="w-4/12 p-4 bg-white rounded-3xl shadow-xl shadow-[#767676]/30">
              <div>
                <div className="flex justify-start items-center mb-4 lg:mb-6">
                  <div className="bg-[#0A9F86] w-10 h-10 mr-3 rounded-md flex justify-center items-center">
                    <AiOutlineTransaction className="text-white text-2xl" />
                  </div>
                  <p className="text-[#4B4C4D] text-[17px] leading-[20px] font-medium">
                    Total <br></br> Transactions
                  </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#4B4C4D] text-sm md:text-base lg:text-xl font-medium pb-3 lg:pb-0">
                    $000
                  </p>
                  <div className="flex justify-center items-center">
                    <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" />
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <img src={gCurve} alt="gCurve" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4/12 p-6 bg-white rounded-3xl shadow-xl shadow-[#767676]/30">
              <div>
                <div className="flex justify-start items-center mb-4 lg:mb-6">
                  <div className="bg-[#F53F09] w-10 h-10 mr-2 rounded-md flex justify-center items-center">
                    <MdSupervisorAccount className="text-white text-2xl" />
                  </div>
                  <p className="text-[#4B4C4D] text-[17px] leading-[20px] font-medium">
                    Total <br></br> Customers
                  </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#4B4C4D] text-sm md:text-base lg:text-xl font-medium pb-3 lg:pb-0">
                    000
                  </p>
                  <div className="flex justify-center items-center">
                    <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" />
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <img src={rCurve} alt="rCurve" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4/12 p-4 bg-white rounded-3xl shadow-xl shadow-[#767676]/30">
              <div>
                <div className="flex justify-start items-center mb-4 lg:mb-6">
                  <div className="bg-[#F99C30] w-10 h-10 mr-2 rounded-md flex justify-center items-center">
                    <AiOutlineTransaction className="text-white text-2xl" />
                  </div>
                  <p className="text-[#4B4C4D] text-[17px] leading-[20px] font-medium">
                    Conversion <br></br> Rate
                  </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#4B4C4D] text-sm md:text-base lg:text-xl font-medium pb-3 lg:pb-0">
                    00%
                  </p>
                  <div className="flex justify-center items-center">
                    <p className="text-[#F53F09] text-xs font-medium">JUN 10</p>
                    <FaCalendarDays className="text-[#F53F09] text-base font-medium ml-1" />
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <img src={oCurve} alt="oCurve" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl mb-9 py-6 px-6 shadow-xl shadow-[#767676]/30">
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
        </div>
        <div className="w-full lg:w-4/12">
          {/*  */}

          {/*  */}
          <div className="w-full p-8 bg-[#D261FC] rounded-3xl mb-8 shadow-xl shadow-[#767676]/30">
            <h2 className="text-white text-[30px] leading-[38px] font-bold pb-3">
              All New Features and Updates
            </h2>
            <p className="text-white text-base font-medium pb-3">
              Read more about our features who helps you manage, organize and
              control your assets safely
            </p>
            <button className="bg-[#515151] text-white hover:bg-black rounded-full px-4 py-2">
              Learn More
            </button>
          </div>
          {/*  */}

          {/*  */}
          <div className="w-full p-8 bg-white rounded-3xl mb-6 shadow-xl shadow-[#767676]/30">
            <h2 className="text-[#4B4C4D] text-xl font-medium pb-4">
              Order Status
            </h2>
            <OrderStatus />
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
