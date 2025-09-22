import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer } from "react-toastify";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getUsers, userActiveDeactive } from "../../Reducer/UserSlice"; // Adjust path

const ManageParents = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state?.user);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    if (userData?.data?.length) {
      const mappedData = userData.data.map((user) => ({
        id: user.id,
        f_name: user.f_name,
        l_name: user.l_name,
        email: user.email,
        status: user.status === 1,
      }));
      setRowData(mappedData);
    }
  }, [userData]);

  const handleToggleStatus = (id, currentStatus) => {
    const updatedRows = rowData.map((row) =>
      row.id === id ? { ...row, status: !currentStatus } : row
    );
    setRowData(updatedRows);
    const encodedId = btoa(id.toString()); // Base64 encode the ID
    dispatch(userActiveDeactive(encodedId)).then((res) => {
      console.log("res", res);
    });

    // Optionally call API to update status here
    // api.patch(`/user/${id}/status`, { status: !currentStatus });
  };

  const columnDefs = [
    {
      headerName: "First Name",
      field: "f_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Last Name",
      field: "l_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params) => {
        const isActive = params.value;
        return (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => handleToggleStatus(params.data.id, isActive)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 relative"></div>
          </label>
        );
      },
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">User Details</h2>
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              suppressAutoColumns={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageParents;
