import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { KanbanBoard } from "../../components/Kanban/kanban-board";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { KanbanBoardBulkOrder } from "../../components/Kanban/kanban-board-bulkOrder";
import axios from "axios";
import { FaCheckCircle, FaDollarSign } from "react-icons/fa";

const ManageKanbanBulkOrder = () => {
  const sidebarOpen = useSelector((state) => state.sidebar.isOpen);
  console.log("sidebarOpen", sidebarOpen);
  const [orders, setOrders] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [period, setPeriod] = useState("all"); // all | day | week | month | quarter | year | custom
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const api = "https://n8n.bestworks.cloud/webhook/get-kanbanbukorder";

  const fetchOrders = () => {
    setIsLoadingStats(true);
    axios
      .get(api)
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log("Error fetching kanban orders", err);
        setOrders([]);
      })
      .finally(() => setIsLoadingStats(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getDateRange = () => {
    const now = new Date();
    let start = null;
    let end = null;
    if (period === "all") {
      // no filtering
      start = null;
      end = null;
    } else if (period === "day") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = now;
    } else if (period === "week") {
      // last 7 days backwards from now (inclusive)
      start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0,0,0,0);
      end = now;
    } else if (period === "month") {
      // last 30 days backwards from now
      start = new Date(now);
      start.setDate(now.getDate() - 29);
      start.setHours(0,0,0,0);
      end = now;
    } else if (period === "quarter") {
      // last 90 days backwards from now
      start = new Date(now);
      start.setDate(now.getDate() - 89);
      start.setHours(0,0,0,0);
      end = now;
    } else if (period === "year") {
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
    } else if (period === "custom") {
      start = fromDate ? new Date(fromDate) : null;
      end = toDate ? new Date(toDate) : null;
    } else {
      // default week
      const day = now.getDay();
      const diff = (day === 0 ? 6 : day - 1);
      start = new Date(now);
      start.setDate(now.getDate() - diff);
      start.setHours(0,0,0,0);
      end = now;
    }
    return { start, end };
  };

  const isInRange = (dateStr) => {
    const { start, end } = getDateRange();
    if (!start && !end) return true;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  };

  const { completedCount, totalRevenue, totalProfit, totalExpense } = useMemo(() => {
    const delivered = (orders || []).filter(
      (o) => o?.["Order Stage"] === "Order delivered" && isInRange(o?.["Order Date"] || o?.createdTime)
    );
    const sum = (arr, key) =>
      arr.reduce((acc, item) => acc + (Number(item?.[key]) || 0), 0);
    return {
      completedCount: delivered.length,
      totalRevenue: sum(delivered, "Order Amount"),
      totalProfit: sum(delivered, "Profit"),
      totalExpense: sum(delivered, "Order Expense"),
    };
  }, [orders, period, fromDate, toDate]);
  return (
    <>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Leads</h2>
            {/* <Button
                onClick={() => setOpenMoodMasterModal(true)}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add Mood Master
              </Button> */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Filter</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All time</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
                <option value="custom">Custom</option>
              </select>
              {period === "custom" && (
                <>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <span className="text-gray-500 text-sm">to</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </>
              )}
            </div>
          </div>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Completed Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? "—" : completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            {/* Revenue */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? "—" : `$${Math.round(totalRevenue).toLocaleString()}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            {/* Profit */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? "—" : `$${Math.round(totalProfit).toLocaleString()}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            {/* Expense */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expense</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? "—" : `$${Math.round(totalExpense).toLocaleString()}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`overflow-x-auto ${
              sidebarOpen ? "sidebarOpenWidth" : "sidebarCloseWidth"
            }`}
          >
            <KanbanBoardBulkOrder onRefresh={fetchOrders} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageKanbanBulkOrder;
