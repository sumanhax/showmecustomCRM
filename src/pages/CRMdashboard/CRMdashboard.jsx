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

const CRMdashboard = () => {
  // Sample data for charts
  const leadTrendsData = [
    { month: 'Jan', newLeads: 120, warmLeads: 80, coldLeads: 40 },
    { month: 'Feb', newLeads: 150, warmLeads: 90, coldLeads: 35 },
    { month: 'Mar', newLeads: 180, warmLeads: 110, coldLeads: 45 },
    { month: 'Apr', newLeads: 200, warmLeads: 130, coldLeads: 50 },
    { month: 'May', newLeads: 220, warmLeads: 140, coldLeads: 55 },
    { month: 'Jun', newLeads: 250, warmLeads: 160, coldLeads: 60 },
    { month: 'Jul', newLeads: 280, warmLeads: 180, coldLeads: 65 },
    { month: 'Aug', newLeads: 300, warmLeads: 200, coldLeads: 70 },
    { month: 'Sep', newLeads: 320, warmLeads: 220, coldLeads: 75 },
    { month: 'Oct', newLeads: 350, warmLeads: 240, coldLeads: 80 },
    { month: 'Nov', newLeads: 380, warmLeads: 260, coldLeads: 85 },
    { month: 'Dec', newLeads: 400, warmLeads: 280, coldLeads: 90 }
  ];

  const leadSourcesData = [
    { day: 'Monday', website: 12, referrals: 8 },
    { day: 'Wednesday', website: 15, referrals: 12 },
    { day: 'Friday', website: 18, referrals: 15 },
    { day: 'Sunday', website: 10, referrals: 6 }
  ];

  const leadStatusData = [
    { name: 'Sample Submitted', value: 35, color: '#3B82F6' },
    { name: 'Sample Art Approved', value: 25, color: '#10B981' },
    { name: 'Sample Shipped', value: 20, color: '#F59E0B' },
    { name: 'Sample Delivered', value: 15, color: '#8B5CF6' },
    { name: 'Warm Lead', value: 3, color: '#EF4444' },
    { name: 'Cold Lead', value: 2, color: '#EC4899' }
  ];

  const leadSourcesPieData = [
    { name: 'Website', value: 45, color: '#3B82F6' },
    { name: 'Referrals', value: 30, color: '#10B981' },
    { name: 'Social Media', value: 15, color: '#F59E0B' },
    { name: 'Email Campaign', value: 10, color: '#8B5CF6' }
  ];

  return (
    <>
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="h-full lg:h-full">
          {/* Header */}
          {/* <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads Dashboard</h1>
            <p className="text-gray-600">Monitor and analyze your lead generation performance</p>
          </div> */}

          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Today's Leads Summary Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Today's Leads</h2>
                  <p className="text-gray-600">Lead Summary</p>
                </div>
                {/* <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  Export
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Button> */}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Total Leads Card */}
                <div className="bg-pink-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">1.2k</div>
                  <div className="text-sm text-blue-600">Last day +8%</div>
                </div>

                {/* New Leads Card */}
                <div className="bg-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">300</div>
                  <div className="text-sm text-blue-600">Last day +5%</div>
                </div>

                {/* Converted Leads Card */}
                <div className="bg-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">45</div>
                  <div className="text-sm text-blue-600">Last day +1.2%</div>
                </div>

                {/* Active Reps Card */}
                <div className="bg-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-sm text-blue-600">Last day +0.5%</div>
                </div>
              </div>
            </div>

            {/* Lead Trends Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={leadTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newLeads" stroke="#8B5CF6" strokeWidth={2} name="New Leads" />
                  <Line type="monotone" dataKey="warmLeads" stroke="#EF4444" strokeWidth={2} name="Warm Leads" />
                  <Line type="monotone" dataKey="coldLeads" stroke="#10B981" strokeWidth={2} name="Cold Leads" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead Sources Bar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Sources</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadSourcesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="website" fill="#3B82F6" name="Website" />
                  <Bar dataKey="referrals" fill="#10B981" name="Referrals" />
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

            {/* Lead Sources Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Sources</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadSourcesPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadSourcesPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CRMdashboard;
