import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from "ag-grid-react";
import { actionList } from "../../Reducer/AddSlice";

const RepDashboard = () => {
  const { loading, actionListData } = useSelector((state) => state.add);
  const dispatch = useDispatch();

  // Custom cell renderer for Status
  const StatusRenderer = (params) => {
    const status = params.value;
    if (!status) return "N/A";
    
    let statusClass = "px-2 py-1 rounded-full text-xs font-medium ";
    switch (status.toLowerCase()) {
      case "overdue":
        statusClass += "bg-red-100 text-red-800";
        break;
      case "completed":
        statusClass += "bg-green-100 text-green-800";
        break;
      case "in progress":
        statusClass += "bg-yellow-100 text-yellow-800";
        break;
      default:
        statusClass += "bg-gray-100 text-gray-800";
    }
    
    return (
      <span className={statusClass}>
        {status}
      </span>
    );
  };

  useEffect(() => {
    dispatch(actionList()).then((res) => {
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
              rowData={actionListData?.data || []}
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