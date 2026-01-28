import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from "ag-grid-react";
import { actionList, repDashboard, getLeadNote, leadList, actionListbyRep, leadListbyRep, actionStatusChange } from "../../Reducer/AddSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUsers, FaTasks, FaBell } from "react-icons/fa";

const RepDashboard = () => {
  const { loading,leadListbyRepData, actionListbyRepData, getLeadNoteData } = useSelector((state) => state.add);
  const {  authData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  console.log("authData", authData);
  // const userId = authData?.data?.id;
  const userId = localStorage.getItem('user_id');
  console.log("userId", userId);
  console.log("actionListbyRepData", actionListbyRepData);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotificationDropdown && !event.target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationDropdown]);

  // Action status options
  const actionStatusOptions = [
    "PENDING",
    "COMPLETED", 
    "OVERDUE"
  ];

  // Custom cell renderer for Status with dropdown
  const StatusRenderer = (params) => {
    const status = params.value;
    const actionId = params.data.id;
    
    // Define colors for each status
    const getStatusStyle = (status) => {
      const statusStyles = {
        "PENDING": {
          backgroundColor: "#FEF3C7", // Light orange background
          color: "#D97706", // Dark orange text
          borderColor: "#F59E0B"
        },
        "COMPLETED": {
          backgroundColor: "#D1FAE5", // Light green background
          color: "#059669", // Dark green text
          borderColor: "#10B981"
        },
        "OVERDUE": {
          backgroundColor: "#FEE2E2", // Light red background
          color: "#DC2626", // Dark red text
          borderColor: "#EF4444"
        },
      };
      return statusStyles[status] || {
        backgroundColor: "#F3F4F6", // Default light gray
        color: "#6B7280", // Default gray text
        borderColor: "#D1D5DB"
      };
    };

    const style = getStatusStyle(status);

    const handleDropdownChange = (event) => {
      const newStatus = event.target.value;
      handleActionStatusChange(actionId, newStatus);
    };
    
    return (
      <select
        value={status}
        onChange={handleDropdownChange}
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          border: `1px solid ${style.borderColor}`,
          fontSize: "12px",
          fontWeight: "500",
          textAlign: "center",
          minWidth: "100px",
          cursor: "pointer",
          backgroundColor: style.backgroundColor,
          color: style.color
        }}
      >
        {actionStatusOptions.map((option) => {
          const optionStyle = getStatusStyle(option);
          return (
            <option 
              key={option} 
              value={option}
              style={{ 
                backgroundColor: optionStyle.backgroundColor, 
                color: optionStyle.color,
                fontWeight: "500"
              }}
            >
              {option}
            </option>
          );
        })}
      </select>
    );
  };

  // Handler for action status change
  const handleActionStatusChange = (actionId, newStatus) => {
    console.log("Updating action status:", actionId, newStatus);
    
    dispatch(actionStatusChange({ id: actionId,status: newStatus}))
     
    .then((res) => {
      toast.success(res?.message || "Action status updated successfully");
      // Refresh the rep dashboard data
      dispatch(actionListbyRep(authData?.token)).then((res) => {
        console.log("actionlist", res);
      }).catch((err) => {
        console.log("actionlist err", err);
      });
    })
    .catch((error) => {
      console.error("Error updating action status", error);
      toast.error("Failed to update action status. Please try again.");
    });
  };

  // Fetch lead data and filter by current rep
  useEffect(() => {
    setIsLoadingLeads(true);
    dispatch(leadListbyRep())
      .then((res) => {
        console.log("All leads fetched:", res?.data?.leads);
        // Filter leads by current rep ID
        // const filteredLeads = res.data.filter(lead => {
        //   // Check if the lead's Rep field contains the current user ID
        //   return lead.Rep && lead.Rep.includes(userId);
        // });
        // console.log("Filtered leads for rep:", filteredLeads);
        // setLeadData(res?.data?.leads);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setLeadData([]);
      })
      .finally(() => {
        setIsLoadingLeads(false);
      });
  }, [userId]);

  // useEffect(() => {
  //   dispatch(repDashboard(userId)).then((res) => {
  //     console.log("actionlist", res);
  //   }).catch((err) => {
  //     console.log("actionlist err", err);
  //   });
  // }, [])
  useEffect(() => {
    dispatch(actionListbyRep(authData?.token)).then((res) => {
      console.log("actionlist", res);
    }).catch((err) => {
      console.log("actionlist err", err);
    });
  }, [])

  // Fetch lead notes for rep
  // const fetchLeadNotes = () => {
  //   if (userId) {
  //     dispatch(getLeadNote({ rep_id: userId })).then((res) => {
  //       console.log("getLeadNote for rep", res);
  //     }).catch((err) => {
  //       console.log("getLeadNote err", err);
  //     });
  //   }
  // };

  // useEffect(() => {
  //   fetchLeadNotes();
  // }, [userId]);

  // Handle marking notification as read
  const handleMarkAsRead = (noteId) => {
    console.log("Marking note as read:", noteId);
    axios.post('https://n8n.bestworks.cloud/webhook/notes-isread', {
      id: noteId,
      isRead: true
    })
    .then(res => {
      console.log("Note marked as read successfully:", res.data);
      toast.success("Notification marked as read");
      // Refresh notes to update the count and UI
      fetchLeadNotes();
    })
    .catch(err => {
      console.error("Error marking note as read:", err);
      toast.error("Failed to mark notification as read");
    });
  };

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return (
      getLeadNoteData?.data?.today?.items?.filter((item) => {
        const isRead =
          item?.isRead === true ||
          item?.isRead === 1 ||
          item?.isRead === "true" ||
          item?.isRead === "True" ||
          item?.isRead === "TRUE";
        return !isRead;
      })?.length || 0
    );
  }, [getLeadNoteData]);

  // Lead table column definitions
  const leadColumnDefs = useMemo(
    () => [
      {
        field: "name", // Updated from "Lead Name"
        headerName: "Lead Name",
        sortable: true,
        filter: true,
        width: 200,
        pinned: 'left'
      },
      {
        field: "email", // Updated from "Email"
        headerName: "Email",
        sortable: true,
        filter: true,
        width: 250,
      },
      {
        field: "phone", // Updated from "Phone"
        headerName: "Phone",
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        field: "company_name", // Updated from "Company Name"
        headerName: "Company Name",
        sortable: true,
        filter: true,
        width: 200,
      },
      {
        headerName: "Lead Status",
        field: "lead_status.name", // Access nested object
        sortable: true,
        filter: true,
        width: 180,
        cellRenderer: (params) => {
          // Use the nested status name from the new response
          const status = params.data.lead_status?.name;
          if (!status) return "N/A";
  
          const getStatusStyle = (statusName) => {
            const statusStyles = {
              "Sample Submitted": {
                backgroundColor: "#DBEAFE",
                color: "#1E40AF",
                borderColor: "#93C5FD"
              },
              "Sample Art Approved": {
                backgroundColor: "#D1FAE5",
                color: "#059669",
                borderColor: "#6EE7B7"
              },
              "Sample Shipped": {
                backgroundColor: "#FEF3C7",
                color: "#D97706",
                borderColor: "#FCD34D"
              },
              "Sample Delivered": {
                backgroundColor: "#E0E7FF",
                color: "#3730A3",
                borderColor: "#A5B4FC"
              },
              "Nurture Sequence": {
                backgroundColor: "#F3E8FF",
                color: "#7C3AED",
                borderColor: "#C4B5FD"
              },
              "Warm Lead": {
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                borderColor: "#FCA5A5"
              },
              "Cold Lead": {
                backgroundColor: "#FCE7F3",
                color: "#BE185D",
                borderColor: "#F9A8D4"
              },
            };
            return statusStyles[statusName] || {
              backgroundColor: "#F3F4F6",
              color: "#6B7280",
              borderColor: "#D1D5DB"
            };
          };
  
          const style = getStatusStyle(status);
  
          return (
            <span
              style={{
                display: "inline-block",
                padding: "3px 12px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "600",
                textAlign: "center",
                minWidth: "100px",
                border: `1px solid ${style.borderColor}`,
                backgroundColor: style.backgroundColor,
                color: style.color,
                lineHeight: "normal"
              }}
            >
              {status}
            </span>
          );
        }
      },
      {
        field: "created_at", // Updated from "Typeform Date"
        headerName: "Date Created",
        sortable: true,
        filter: true,
        width: 150,
        cellRenderer: (params) => {
          if (!params.value) return "N/A";
          return new Date(params.value).toLocaleDateString();
        }
      },
    ],
    []
  );

  return (
    <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
      <div className="h-full lg:h-full">
        {/* Header */}
        <div className="lg:flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rep Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative notification-dropdown">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              >
                <FaBell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {unreadCount} Unread
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">Today's reminders</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {getLeadNoteData?.data?.today?.items?.length > 0 ? (
                      getLeadNoteData.data.today.items.map((item, index) => {
                        const isRead =
                          item?.isRead === true ||
                          item?.isRead === 1 ||
                          item?.isRead === "true" ||
                          item?.isRead === "True" ||
                          item?.isRead === "TRUE";
                        const isUnread = !isRead;
                        return (
                          <div 
                            key={index} 
                            className={`p-4 border-b border-gray-100 transition-all ${
                              isUnread 
                                ? 'bg-blue-50 hover:bg-blue-100' 
                                : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  isUnread ? 'bg-blue-500' : 'bg-gray-300'
                                }`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className={`text-sm ${isUnread ? 'font-bold' : 'font-semibold'} text-gray-900`}>
                                    {item.lead_name}
                                  </div>
                                  {isUnread && (
                                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <div className={`text-sm mt-1 ${
                                  isUnread ? 'text-red-700 font-semibold' : 'text-red-600 font-medium'
                                }`}>
                                  {item.note_description}
                                </div>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>Status: {item.status}</span>
                                  <span>Date: {new Date(item.reminder_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {/* Mark as Read Button */}
                              {isUnread && (
                                <div className="flex-shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsRead(item.id);
                                    }}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                    title="Mark as read"
                                  >
                                    <svg 
                                      className="w-5 h-5" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }).reverse()
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications for today
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setShowNotificationDropdown(false)}
                      className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Section - Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Total Assigned Leads Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Your Assigned Leads
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {leadListbyRepData?.data?.leads?.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#f20c32] rounded-lg flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Actions Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Your Actions List
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {actionListbyRepData?.actions?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#f20c32] rounded-lg flex items-center justify-center">
                <FaTasks className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
  <h2 className="text-xl font-semibold text-gray-900 mb-6">
    Your Assigned Leads
  </h2>
  {isLoadingLeads ? (
    <div className="flex justify-center items-center h-32">
       {/* ... existing loader ... */}
    </div>
  ) : (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={leadListbyRepData?.data?.leads || []} // Assuming leadData is the array from your "Updated response"
        columnDefs={leadColumnDefs}
        pagination={true}
        paginationPageSize={10}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          flex: 1, // Added flex to make columns fill the space
          minWidth: 100
        }}
        suppressRowClickSelection={true}
        animateRows={true}
      />
    </div>
  )}
</div>

        {/* Actions List Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
  <h2 className="text-xl font-semibold text-gray-900 mb-6">
    Your Actions List
  </h2>
  <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
    <AgGridReact
      // Updated to match the new nested response structure
      rowData={actionListbyRepData?.actions || []} 
      columnDefs={[
        {
          headerName: "Title",
          field: "title",
          width: 150,
          cellRenderer: (params) => params.value || "No Title"
        },
        {
          headerName: "Action Description",
          field: "description", // Updated from action_description
          width: 250,
          sortable: true,
          filter: true,
          cellRenderer: (params) => params.value || "N/A"
        },
        {
          headerName: "Due Date",
          field: "due_at", // Updated from due_date
          width: 150,
          sortable: true,
          filter: true,
          cellRenderer: (params) => {
            return params.value ? new Date(params.value).toLocaleDateString() : "N/A";
          }
        },
        {
          headerName: "Status",
          field: "action_status", // Updated from status
          width: 120,
          sortable: true,
          filter: true,
          cellRenderer: StatusRenderer
        },
        {
          headerName: "Priority",
          field: "priority",
          width: 110,
          cellClassRules: {
            'font-bold text-red-600': (params) => params.value === 'HIGH',
            'text-orange-500': (params) => params.value === 'MEDIUM',
          }
        },
        {
          headerName: "Lead Name",
          field: "lead.name", // Direct access to nested object
          width: 200,
          sortable: true,
          filter: true,
          valueGetter: (params) => params.data.lead?.name || "N/A"
        },
        {
          headerName: "Lead Company",
          field: "lead.company_name",
          width: 180,
          valueGetter: (params) => params.data.lead?.company_name || "N/A"
        },
        {
          headerName: "Created Date",
          field: "created_at", // Updated from created_date
          width: 150,
          sortable: true,
          filter: true,
          cellRenderer: (params) => {
            if (!params.value) return "N/A";
            return new Date(params.value).toLocaleDateString();
          }
        }
      ]}
      defaultColDef={{
        resizable: true,
        sortable: true,
        filter: true
      }}
      pagination={true}
      paginationPageSize={10}
      suppressRowClickSelection={true}
      rowSelection="multiple"
      animateRows={true}
    />
  </div>
</div>
      </div>
    </div>
  );
};

export default RepDashboard;