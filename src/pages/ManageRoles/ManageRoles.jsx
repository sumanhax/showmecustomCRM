// import React, { useEffect, useState } from "react";
// import { Modal, Button, TextInput, Label } from "flowbite-react";
// import { ToastContainer } from "react-toastify";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { getRoles } from "../../Reducer/RoleSlice";

// const ManageRoles = () => {
//   const { roleData } = useSelector((state) => state?.role);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getRoles());
//   }, []);

//   console.log("Role Data", roleData);

//   return (
//     <div>
//       <ToastContainer />
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//         <div className="h-full lg:h-screen">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold">Role Details</h2>
//             {/* <Button
//               onClick={() => setOpenModal(true)}
//               className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
//             >
//               Add Role
//             </Button> */}
//           </div>
//           <div
//             className="ag-theme-alpine"
//             style={{ height: 600, width: "100%" }}
//           >
//             <AgGridReact
//               rowData={rowData}
//               columnDefs={columnDefs}
//               pagination={true}
//               paginationPageSize={10}
//               domLayout="autoHeight"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageRoles;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer } from "react-toastify";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getRoles } from "../../Reducer/RoleSlice"; // Update path if needed

const ManageRoles = () => {
  const { roleData } = useSelector((state) => state?.role);
  const dispatch = useDispatch();

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    dispatch(getRoles());
  }, []);

  useEffect(() => {
    if (roleData?.results?.length) {
      const mappedData = roleData.results.map((role) => ({
        role_name: role.role_name,
        role_short_name: role.role_short_name,
        status: role.status,
      }));
      setRowData(mappedData);
    }
  }, [roleData]);

  const columnDefs = [
    {
      headerName: "Role Name",
      field: "role_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Short Name",
      field: "role_short_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params) => {
        const isActive = params.value === 1;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
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
            <h2 className="text-2xl font-semibold">Role Details</h2>
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
              suppressFieldDotNotation={true}
              suppressAutoColumns={true}
              defaultColDef={{ resizable: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRoles;
