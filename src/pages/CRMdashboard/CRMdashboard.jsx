import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  changeStatus,
  getMoodMaster
} from "../../Reducer/MoodMasterSlice";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer } from "react-toastify";
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
  ResponsiveContainer
} from "recharts";
import Loader from "../../components/Loader";

const CRMdashboard = () => {
   const [leadData, setLeadData] = useState([]);
   const [repData, setRepData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isLoadingReps, setIsLoadingReps] = useState(true);

  // Fetch data
  useEffect(() => {
    setIsLoadingLeads(true);
    axios.get("https://n8nnode.bestworks.cloud/webhook/airtable-lead-fetch")
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
    axios.get("https://n8nnode.bestworks.cloud/webhook/airtable-rep-fetch")
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
    const daysAgo = new Date(now.getTime() - selectedPeriod * 24 * 60 * 60 * 1000);
    
    const dateMap = {};
    
    // Initialize all dates in the period with 0 leads
    for (let i = 0; i < selectedPeriod; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }
    
    // Count leads for each date
    leadData.forEach(lead => {
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
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        leads: Math.round(count)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [leadData, selectedPeriod]);

  // Lead status distribution
  const leadStatusData = useMemo(() => {
    const statusCount = {};
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];
    
    leadData.forEach(lead => {
      const status = lead["Lead Status"] || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [leadData]);

  // Lead by state distribution
  const leadStateData = useMemo(() => {
    const stateCount = {};
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];
    
    leadData.forEach(lead => {
      const state = lead["State"] || 'Unknown';
      stateCount[state] = (stateCount[state] || 0) + 1;
    });
    
    return Object.entries(stateCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [leadData]);

  // Hat Usage data
  const hatUsageData = useMemo(() => {
    const usageCount = {};
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
    
    leadData.forEach(lead => {
      if (lead["Hat Usage"] && Array.isArray(lead["Hat Usage"])) {
        lead["Hat Usage"].forEach(usage => {
          usageCount[usage] = (usageCount[usage] || 0) + 1;
        });
      }
    });
    
    return Object.entries(usageCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [leadData]);

  // Past Headwear Issues data
  const headwearIssuesData = useMemo(() => {
    const issuesCount = {};
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
    
    leadData.forEach(lead => {
      if (lead["Past Headwear Issues"] && Array.isArray(lead["Past Headwear Issues"])) {
        lead["Past Headwear Issues"].forEach(issue => {
          issuesCount[issue] = (issuesCount[issue] || 0) + 1;
        });
      }
    });
    
    return Object.entries(issuesCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [leadData]);

  // What's Most Important data
  const mostImportantData = useMemo(() => {
    const importantCount = {};
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
    
    leadData.forEach(lead => {
      if (lead["What's Most Important"] && Array.isArray(lead["What's Most Important"])) {
        lead["What's Most Important"].forEach(item => {
          importantCount[item] = (importantCount[item] || 0) + 1;
        });
      }
    });
    
    return Object.entries(importantCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [leadData]);

  // Rep performance data
  const repPerformanceData = useMemo(() => {
    return repData.map(rep => {
      const assignedLeadsCount = rep["Assigned Leads"] ? rep["Assigned Leads"].length : 0;
      const assignedLeadNames = [];
      
      if (rep["Assigned Leads"] && Array.isArray(rep["Assigned Leads"])) {
        rep["Assigned Leads"].forEach(leadId => {
          const lead = leadData.find(l => l.id === leadId);
          if (lead && lead["Lead Name"]) {
            assignedLeadNames.push(lead["Lead Name"]);
          }
        });
      }
      
      return {
        repName: rep["Rep Name"] || 'Unknown',
        assignedLeads: Math.round(assignedLeadsCount),
        leadNames: assignedLeadNames
      };
    }).filter(rep => rep.assignedLeads > 0);
  }, [repData, leadData]);

  // Helper function to generate random colors
  const getRandomColor = () => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800', 
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-cyan-100 text-cyan-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
          {/* Top Section - Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Leads Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                  {/* <p className="text-sm text-green-600">+12% from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              </div>
              
            {/* Total Profit Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-gray-900">${totalProfit.toFixed(0)}</p>
                  {/* <p className="text-sm text-green-600">+8% from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>

            {/* Total Revenue Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(0)}</p>
                  {/* <p className="text-sm text-green-600">+15% from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                </div>
              </div>
            </div>

            {/* Total Reps Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reps</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReps}</p>
                  {/* <p className="text-sm text-green-600">+2 from last month</p> */}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Lead by Date and Lead Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Lead by Date Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Lead by Date</h2>
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
                  <YAxis domain={[0, 'dataMax']} allowDecimals={false} />
                  <Tooltip formatter={(value) => [Math.round(value), 'Leads']} />
                  <Bar dataKey="leads" fill="#3B82F6" name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Status Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Rep Performance</h2>
              <div className="space-y-4">
                {repPerformanceData.map((rep, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {rep.repName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{rep.repName}</p>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Assigned Leads:</p>
                          <p className="mt-1">
                            {rep.leadNames.length > 0 ? rep.leadNames.join(', ') : 'No assigned leads'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{rep.assignedLeads}</p>
                      <p className="text-sm text-gray-600">Total Leads</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead by State Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Leads by State</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadStateData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                <h2 className="text-xl font-semibold text-gray-900">Hat Usage</h2>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div className="space-y-3">
                {hatUsageData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRandomColor()}`}>
                      {item.name}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Headwear Issues */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Past Headwear Issues</h2>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div className="space-y-3">
                {headwearIssuesData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRandomColor()}`}>
                      {item.name}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Most Important */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">What's Most Important</h2>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div className="space-y-3">
                {mostImportantData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRandomColor()}`}>
                      {item.name}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CRMdashboard;