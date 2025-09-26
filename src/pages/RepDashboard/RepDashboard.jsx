import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from "ag-grid-react";
import { actionList, repDashboard } from "../../Reducer/AddSlice";
import { toast } from "react-toastify";
import axios from "axios";

const RepDashboard = () => {
  const { loading, repDashboardData } = useSelector((state) => state.add);
  const {  authData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log("authData", authData);
  // const userId = authData?.data?.id;
  const userId = localStorage.getItem('user_id');
  console.log("userId", userId);
  console.log("repDashboardData", repDashboardData);

  // Action status options
  const actionStatusOptions = [
    "Pending",
    "Completed", 
    "Overdue"
  ];

  // Custom cell renderer for Status with dropdown
  const StatusRenderer = (params) => {
    const status = params.value;
    const actionId = params.data.id;
    
    // Define colors for each status
    const getStatusStyle = (status) => {
      const statusStyles = {
        "Pending": {
          backgroundColor: "#FEF3C7", // Light orange background
          color: "#D97706", // Dark orange text
          borderColor: "#F59E0B"
        },
        "Completed": {
          backgroundColor: "#D1FAE5", // Light green background
          color: "#059669", // Dark green text
          borderColor: "#10B981"
        },
        "Overdue": {
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
    console.log("Updating action status:", { actionId, newStatus });
    
    axios.post("https://n8nnode.bestworks.cloud/webhook/action-status-update", {
      id: actionId,
      status: newStatus
    })
    .then(() => {
      toast.success("Action status updated successfully");
      // Refresh the rep dashboard data
      dispatch(repDashboard(userId)).then((res) => {
        console.log("Rep dashboard refreshed:", res);
      }).catch((err) => {
        console.log("Error refreshing rep dashboard:", err);
      });
    })
    .catch((error) => {
      console.error("Error updating action status", error);
      toast.error("Failed to update action status. Please try again.");
    });
  };

  useEffect(() => {
    dispatch(repDashboard(userId)).then((res) => {
      console.log("actionlist", res);
    }).catch((err) => {
      console.log("actionlist err", err);
    });
  }, []);

  return (
    <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
      <div className="h-full lg:h-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rep Dashboard
          </h1>
        </div>

        {/* Actions List Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Actions List
          </h2>
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={repDashboardData?.data || []}
              columnDefs={[
                {
                  headerName: "ID",
                  field: "id",
                  width: 150,
                  sortable: true,
                  filter: true
                },
                {
                  headerName: "Action Description",
                  field: "action_description",
                  width: 250,
                  sortable: true,
                  filter: true,
                  cellRenderer: (params) => {
                    return params.value || "N/A";
                  }
                },
                {
                  headerName: "Due Date",
                  field: "due_date",
                  width: 120,
                  sortable: true,
                  filter: true,
                  cellRenderer: (params) => {
                    return params.value || "N/A";
                  }
                },
                {
                  headerName: "Status",
                  field: "status",
                  width: 120,
                  sortable: true,
                  filter: true,
                  cellRenderer: StatusRenderer
                },
                {
                  headerName: "Action Type",
                  field: "action_type",
                  width: 120,
                  sortable: true,
                  filter: true,
                  cellRenderer: (params) => {
                    return params.value || "N/A";
                  }
                },
                {
                  headerName: "Created By",
                  field: "created_by",
                  width: 120,
                  sortable: true,
                  filter: true
                },
                {
                  headerName: "Created Date",
                  field: "created_date",
                  width: 150,
                  sortable: true,
                  filter: true,
                  cellRenderer: (params) => {
                    if (!params.value) return "N/A";
                    return new Date(params.value).toLocaleDateString();
                  }
                },
                {
                  headerName: "Lead ID",
                  field: "lead",
                  width: 150,
                  sortable: true,
                  filter: true,
                  cellRenderer: (params) => {
                    if (!params.value || !Array.isArray(params.value)) return "N/A";
                    return params.value.join(", ");
                  }
                },
                {
                  headerName: "Assigned To",
                  field: "assigned_to",
                  width: 150,
                  sortable: true,
                  filter: true,
                  cellRenderer: (params) => {
                    if (!params.value || !Array.isArray(params.value) || params.value.length === 0) return "Unassigned";
                    return params.value.join(", ");
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