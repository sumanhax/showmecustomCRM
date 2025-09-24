import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeStatus, getMoodMaster } from "../../Reducer/MoodMasterSlice";
import { addManager } from "../../Reducer/AddSlice";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "flowbite-react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../components/Loader";
import { useForm } from "react-hook-form";
import { FaUsers, FaDollarSign, FaChartLine, FaUserTie } from "react-icons/fa";

const CRMdashboard = () => {
  const [leadData, setLeadData] = useState([]);
  const [repData, setRepData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isLoadingReps, setIsLoadingReps] = useState(true);
  const [openManagerModal, setOpenManagerModal] = useState(false);

  const {loading} = useSelector((state)=>state.add);
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  // Form submission handler for manager
  const onSubmitManager = (data) => {
   
    dispatch(addManager(data))
      .then((res) => {
        console.log("res", res);
        toast.success(res?.payload?.message);
        reset();
        setOpenManagerModal(false);
        axios.get("https://n8nnode.bestworks.cloud/webhook/airtable-lead-fetch")
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(res?.payload?.message);
      });
  };

  // Fetch data
  useEffect(() => {
    setIsLoadingLeads(true);
    axios
      .get("https://n8nnode.bestworks.cloud/webhook/airtable-lead-fetch")
      .then((res) => {
        console.log("res", res.data);
        setLeadData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setLeadData([]);
      })
      .finally(() => {
        setIsLoadingLeads(false);
      });
  }, []);

  useEffect(() => {
    setIsLoadingReps(true);
    axios
      .get("https://n8nnode.bestworks.cloud/webhook/airtable-rep-fetch")
      .then((res) => {
        console.log("res", res.data);
        setRepData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching reps:", error);
        setRepData([]);
      })
      .finally(() => {
        setIsLoadingReps(false);
      });
  }, []);

  // Calculate dynamic data for cards
  const totalLeads = leadData.length;
  const totalProfit = useMemo(() => {
    return leadData.reduce((sum, lead) => {
      const profit = parseFloat(lead["Profit 2"]) || 0;
      return sum + profit;
    }, 0);
  }, [leadData]);

  const totalRevenue = useMemo(() => {
    return leadData.reduce((sum, lead) => {
      const revenue = parseFloat(lead["Revenue"]) || 0;
      return sum + revenue;
    }, 0);
  }, [leadData]);

  const totalReps = repData.length;

  // Lead trends data by date
  const leadTrendsData = useMemo(() => {
    const now = new Date();
    const daysAgo = new Date(
      now.getTime() - selectedPeriod * 24 * 60 * 60 * 1000
    );

    const dateMap = {};

    // Initialize all dates in the period with 0 leads
    for (let i = 0; i < selectedPeriod; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      dateMap[dateStr] = 0;
    }

    // Count leads for each date
    leadData.forEach((lead) => {
      if (lead["Typeform Date"]) {
        const leadDate = lead["Typeform Date"];
        if (dateMap.hasOwnProperty(leadDate)) {
          dateMap[leadDate]++;
        }
      }
    });

    // Convert to array and sort by date, ensure round numbers
    return Object.entries(dateMap)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        leads: Math.round(count),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [leadData, selectedPeriod]);

  // Lead status distribution
  const leadStatusData = useMemo(() => {
    const statusCount = {};
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EF4444",
      "#EC4899",
      "#06B6D4",
      "#84CC16",
    ];

    leadData.forEach((lead) => {
      const status = lead["Lead Status"] || "Unknown";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [leadData]);

  // Lead by state distribution
  const leadStateData = useMemo(() => {
    const stateCount = {};
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EF4444",
      "#EC4899",
      "#06B6D4",
      "#84CC16",
    ];

    leadData.forEach((lead) => {
      const state = lead["State"] || "Unknown";
      stateCount[state] = (stateCount[state] || 0) + 1;
    });

    return Object.entries(stateCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [leadData]);

  // Hat Usage data with fixed colors
  const hatUsageData = useMemo(() => {
    const usageCount = {};
    const availableColors = [
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#06B6D4",
      "#EC4899",
      "#84CC16",
      "#3B82F6",
      "#F97316",
      "#6366F1",
      "#14B8A6",
      "#DC2626",
      "#059669",
      "#7C3AED",
      "#EA580C",
      "#BE185D",
      "#0D9488",
      "#1D4ED8",
      "#16A34A",
      "#9333EA",
      "#6B7280",
      "#374151",
    ];

    // First pass: collect all unique options
    leadData.forEach((lead) => {
      if (lead["Hat Usage"] && Array.isArray(lead["Hat Usage"])) {
        lead["Hat Usage"].forEach((usage) => {
          usageCount[usage] = (usageCount[usage] || 0) + 1;
        });
      }
    });

    // Create a consistent color mapping for each unique option
    const uniqueOptions = Object.keys(usageCount);
    const colorMap = {};
    uniqueOptions.forEach((option, index) => {
      colorMap[option] = availableColors[index % availableColors.length];
    });

    return Object.entries(usageCount).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || "#6B7280", // Fallback color
    }));
  }, [leadData]);

  // Past Headwear Issues data with fixed colors
  const headwearIssuesData = useMemo(() => {
    const issuesCount = {};
    const availableColors = [
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#06B6D4",
      "#EC4899",
      "#84CC16",
      "#3B82F6",
      "#F97316",
      "#6366F1",
      "#14B8A6",
      "#DC2626",
      "#059669",
      "#7C3AED",
      "#EA580C",
      "#BE185D",
      "#0D9488",
      "#1D4ED8",
      "#16A34A",
      "#9333EA",
      "#6B7280",
      "#374151",
    ];

    // First pass: collect all unique options
    leadData.forEach((lead) => {
      if (
        lead["Past Headwear Issues"] &&
        Array.isArray(lead["Past Headwear Issues"])
      ) {
        lead["Past Headwear Issues"].forEach((issue) => {
          issuesCount[issue] = (issuesCount[issue] || 0) + 1;
        });
      }
    });

    // Create a consistent color mapping for each unique option
    const uniqueOptions = Object.keys(issuesCount);
    const colorMap = {};
    uniqueOptions.forEach((option, index) => {
      colorMap[option] = availableColors[index % availableColors.length];
    });

    return Object.entries(issuesCount).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || "#6B7280", // Fallback color
    }));
  }, [leadData]);

  // What's Most Important data with fixed colors
  const mostImportantData = useMemo(() => {
    const importantCount = {};
    const availableColors = [
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#06B6D4",
      "#EC4899",
      "#84CC16",
      "#3B82F6",
      "#F97316",
      "#6366F1",
      "#14B8A6",
      "#DC2626",
      "#059669",
      "#7C3AED",
      "#EA580C",
      "#BE185D",
      "#0D9488",
      "#1D4ED8",
      "#16A34A",
      "#9333EA",
      "#6B7280",
      "#374151",
    ];

    // First pass: collect all unique options
    leadData.forEach((lead) => {
      if (
        lead["What's Most Important"] &&
        Array.isArray(lead["What's Most Important"])
      ) {
        lead["What's Most Important"].forEach((item) => {
          importantCount[item] = (importantCount[item] || 0) + 1;
        });
      }
    });

    // Create a consistent color mapping for each unique option
    const uniqueOptions = Object.keys(importantCount);
    const colorMap = {};
    uniqueOptions.forEach((option, index) => {
      colorMap[option] = availableColors[index % availableColors.length];
    });

    return Object.entries(importantCount).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || "#6B7280", // Fallback color
    }));
  }, [leadData]);

  // Rep performance data
  const repPerformanceData = useMemo(() => {
    return repData
      .map((rep) => {
        const assignedLeadsCount = rep["Assigned Leads"]
          ? rep["Assigned Leads"].length
          : 0;
        const assignedLeadNames = [];

        if (rep["Assigned Leads"] && Array.isArray(rep["Assigned Leads"])) {
          rep["Assigned Leads"].forEach((leadId) => {
            const lead = leadData.find((l) => l.id === leadId);
            if (lead && lead["Lead Name"]) {
              assignedLeadNames.push(lead["Lead Name"]);
            }
          });
        }

        return {
          repName: rep["Rep Name"] || "Unknown",
          assignedLeads: Math.round(assignedLeadsCount),
          leadNames: assignedLeadNames,
        };
      })
      .filter((rep) => rep.assignedLeads > 0);
  }, [repData, leadData]);

  // Helper function to get fixed color classes
  const getFixedColorClass = (color) => {
    const colorMap = {
      "#3B82F6": "bg-blue-100 text-blue-800",
      "#10B981": "bg-green-100 text-green-800",
      "#F59E0B": "bg-yellow-100 text-yellow-800",
      "#8B5CF6": "bg-purple-100 text-purple-800",
      "#EF4444": "bg-red-100 text-red-800",
      "#EC4899": "bg-pink-100 text-pink-800",
      "#06B6D4": "bg-cyan-100 text-cyan-800",
      "#84CC16": "bg-lime-100 text-lime-800",
      "#6B7280": "bg-gray-100 text-gray-800",
      "#F97316": "bg-orange-100 text-orange-800",
      "#6366F1": "bg-indigo-100 text-indigo-800",
      "#14B8A6": "bg-teal-100 text-teal-800",
      "#DC2626": "bg-red-100 text-red-800",
      "#059669": "bg-emerald-100 text-emerald-800",
      "#7C3AED": "bg-violet-100 text-violet-800",
      "#EA580C": "bg-orange-100 text-orange-800",
      "#BE185D": "bg-pink-100 text-pink-800",
      "#0D9488": "bg-teal-100 text-teal-800",
      "#1D4ED8": "bg-blue-100 text-blue-800",
      "#16A34A": "bg-green-100 text-green-800",
      "#9333EA": "bg-violet-100 text-violet-800",
      "#374151": "bg-gray-100 text-gray-800",
    };
    return colorMap[color] || "bg-gray-100 text-gray-800";
  };

  // Show loader while data is being fetched
  if (isLoadingLeads || isLoadingReps) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="h-full lg:h-full flex items-center justify-center">
          <Loader size="large" text="Loading CRM Dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="h-full lg:h-full">
          {/* Header with Add Manager Button */}
          <div className="lg:flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              CRM Dashboard
            </h1>
            <Button
              onClick={() => setOpenManagerModal(true)}
              className="bg-[#f20c32] hover:bg-black px-4 py-2 text-white text-base font-semibold flex justify-center items-center rounded-md "
            >
              <FaUserTie className="mr-2" />
             Add Manager
            </Button>
          </div>

          {/* Top Section - Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Leads Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Leads
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalLeads}
                  </p>
                  {/* <p className="text-sm text-green-600">+12% from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Total Profit Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Profit
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalProfit.toFixed(0)}
                  </p>
                  {/* <p className="text-sm text-green-600">+8% from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalRevenue.toFixed(0)}
                  </p>
                  {/* <p className="text-sm text-green-600">+15% from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Total Reps Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reps
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalReps}
                  </p>
                  {/* <p className="text-sm text-green-600">+2 from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <FaUserTie className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Lead by Date and Lead Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Lead by Date Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Lead by Date
                </h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={15}>Last 15 days</option>
                  <option value={30}>Last 30 days</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, "dataMax"]} allowDecimals={false} />
                  <Tooltip
                    formatter={(value) => [Math.round(value), "Leads"]}
                  />
                  <Bar dataKey="leads" fill="#3B82F6" name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Status Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Lead Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Third Row - Rep Performance and Leads by State */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Rep Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Rep Performance
              </h2>
              <div className="space-y-4">
                {repPerformanceData.map((rep, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {rep.repName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {rep.repName}
                        </p>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Assigned Leads:</p>
                          <p className="mt-1">
                            {rep.leadNames.length > 0
                              ? rep.leadNames.join(", ")
                              : "No assigned leads"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {rep.assignedLeads}
                      </p>
                      <p className="text-sm text-gray-600">Total Leads</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead by State Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Leads by State
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadStateData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadStateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fourth Row - Tag-style Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hat Usage */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Hat Usage
                </h2>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <div className="space-y-3">
                {hatUsageData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`px-3 py-1 text-sm font-medium ${getFixedColorClass(
                        item.color
                      )}`}
                    >
                      {item.name}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Headwear Issues */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Past Headwear Issues
                </h2>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <div className="space-y-3">
                {headwearIssuesData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`px-3 py-1 text-sm font-medium ${getFixedColorClass(
                        item.color
                      )}`}
                    >
                      {item.name}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Most Important */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  What's Most Important
                </h2>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <div className="space-y-3">
                {mostImportantData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`px-3 py-1 text-sm font-medium ${getFixedColorClass(
                        item.color
                      )}`}
                    >
                      {item.name}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Manager Modal */}
        {openManagerModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                width: "90%",
                maxWidth: "500px",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                position: "relative",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setOpenManagerModal(false);
                  reset();
                }}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "4px",
                }}
              >
                ×
              </button>

              {/* Modal Header */}
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1f2937",
                    margin: 0,
                  }}
                >
                  Add New Manager
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  Add a new manager to the system
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmitManager)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Full Name Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("full_name", {
                      required: "Full name is required",
                    })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: errors.full_name
                        ? "1px solid #ef4444"
                        : "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {errors.full_name && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: errors.email
                        ? "1px solid #ef4444"
                        : "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {errors.email && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Avatar Upload Field */}
                {/* <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Avatar (Image Upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('avatar')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div> */}

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenManagerModal(false);
                      reset();
                    }}
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      background: "white",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "white",
                      background:
                        "linear-gradient(135deg, #f20c32 0%, #dc2626 100%)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {loading?"Processing...":"Add Manager"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CRMdashboard;
