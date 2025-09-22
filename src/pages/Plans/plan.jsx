import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { TbCheck } from "react-icons/tb";
import {
  EconomicIcon,
  PremiumIcon,
  staterIcon,
} from "../../assets/images/images";
import { BiMessageSquareEdit } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { planList, planStatus } from "../../Reducer/PlanSlice";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import EditModal from "./EditModal";
import AddDetailsModal from "./AddDetailsModal";
import ShowPlanDetailsModal from "./ShowPlanDetailsModal";
const Plan = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editId, setEditId] = useState();
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const { planListData } = useSelector((state) => state?.plan);
  console.log("planListData", planListData);

  useEffect(() => {
    dispatch(planList());
  }, []);
  const handleStatusChange = (id) => {
    dispatch(planStatus({ id: id })).then((res) => {
      console.log("Res:", res);
      if (res?.payload?.status_code === 200) {
        dispatch(planList());
      }
    });
  };
  const handleCreatePlan = () => {
    nevigate("/create-plan");
  };
  const handleEdit = (id) => {
    // nevigate(`/edit-plan-details/${id}`);
    console.log("Hello", editId);

    setEditId(id);
    if (id) {
      setOpenEditModal(true);
    }
  };
  const handleAddDetails = (id) => {
    setEditId(id);
    if (id) {
      setOpenAddModal(true);
    }
  };

  const handleShowDetails = (id) => {
    setEditId(id);
    if (id) {
      setOpenDetailsModal(true);
    }
  };

  const StatusCellRenderer = (props) => {
    const isActive = props.value === 1;
    const statusText = isActive ? "Active" : "Inactive";
    const statusColor = isActive ? "#52b69a" : "#EF4444"; // Green for active, Red for inactive

    return (
      <div className="flex items-center h-full">
        <span
          className="px-3 py-1 rounded-md text-white text-sm font-medium"
          style={{ backgroundColor: statusColor }}
        >
          {statusText}
        </span>
      </div>
    );
  };

  // Edit Button Cell Renderer Component
  const EditButtonRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleEdit(props.data.id)}
          className="bg-black hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </button>
      </div>
    );
  };

  const DetailsButtonRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleShowDetails(props.data.id)}
          className="bg-black hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Details
        </button>
      </div>
    );
  };

  const AddButtonRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleAddDetails(props.data.id)}
          className="bg-black hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Add Plan Details
        </button>
      </div>
    );
  };

  // Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Plan Name",
        field: "plan_name",
        flex: 1,
        minWidth: 200,
        cellClass: "flex items-center",
      },
      {
        headerName: "",
        field: "details",
        width: 120,
        cellRenderer: DetailsButtonRenderer,
        cellClass: "flex items-center",
      },
      {
        headerName: "",
        field: "add_details",
        width: 200,
        cellRenderer: AddButtonRenderer,
        cellClass: "flex items-center",
      },
      {
        headerName: "Status",
        field: "status",
        width: 120,
        cellRenderer: StatusCellRenderer,
        cellClass: "flex items-center",
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 100,
        cellRenderer: EditButtonRenderer,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
      },
    ],
    []
  );

  // Default Column Definition
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Grid Options
  const gridOptions = {
    domLayout: "autoHeight",
    suppressHorizontalScroll: false,
    rowHeight: 60,
  };
  return (
    <div>
      {/* Choose your plan section start here */}
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Plan Details</h2>
            {/* <button
              type="button"
              onClick={() => handleCreatePlan()}
              className="bg-[#52b69a] hover:bg-black px-6 py-2.5 text-white text-sm font-semibold flex justify-center items-center rounded-md"
            >
              Add Plans
            </button> */}
          </div>
          <div
            className="plan_tab_area"
            data-aos="zoom-in"
            data-aos-duration="1500"
          >
            <div>
              <div>
                <div className="plan_list_area">
                  {/* <div className="flex-none md:flex justify-center gap-4">
                    {planListData?.results?.length > 0 &&
                      planListData?.results?.map((list) => {
                    

                        return (
                          <div
                            key={list?.id}
                            className="w-full md:w-5/12 lg:w-4/12 mx-0 md:mx-2 mb-4 lg:mb-0"
                          >
                            <div
                              className={`${
                                list?.id === 2
                                  ? "bg-[#AB54DB] text-white"
                                  : "bg-white text-black"
                              } py-10 px-10 rounded-2xl shadow-xl mt-0`}
                            >
                              <div className="flex justify-end relative top-[-10px] right-[-10px]">
                                <button
                                
                                  onClick={() => {
                                    handleEdit(list?.id);
                                  }}
                                  className={`text-xl ${
                                    list?.id === 2
                                      ? "text-white hover:text-gray-300"
                                      : "text-[#AB54DB] hover:text-black"
                                  }`}
                                >
                                  <BiMessageSquareEdit />
                                </button>
                              </div>
                              <div className="text-center mb-6">
                                <img
                                  src={
                                    list?.id === 2 ? EconomicIcon : staterIcon
                                  }
                                  alt="staterIcon"
                                  className="inline-block"
                                />
                              </div>
                              <h2 className="text-center text-2xl lg:text-[22px] font-semibold pb-8 block">
                                {list?.plan_name}
                              </h2>
                              <h3 className="text-center text-lg font-medium pb-0 block">
                                <span className="text-center text-[50px] font-semibold pb-6 block">
                              
                                  <span
                                    className={`text-center text-sm font-normal ${
                                      list?.id === 2
                                        ? "text-gray-200"
                                        : "text-[#ADADAD]"
                                    }`}
                                  >
                                 
                                  </span>
                                </span>
                              </h3>
                       
                              <div className="rounded-2xl p-0">
                                <div className="text-center pt-4 pb-0">
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(list?.id)}
                                    className={`border-2 inline rounded-lg text-sm lg:text-base font-medium px-6 lg:px-10 py-3 lg:py-2 
        ${
          list?.is_active === 1
            ? "bg-white hover:bg-[#AB54DB] border-[#AB54DB] text-[#AB54DB] hover:text-white"
            : "bg-gray-300 hover:bg-gray-500 border-gray-500 text-gray-700 hover:text-white"
        }`}
                                  >
                                    {list?.is_active === 1
                                      ? "Active"
                                      : "Deactive"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })} 
                  </div> */}

                  <div className="ag-theme-alpine" style={{ width: "100%" }}>
                    <AgGridReact
                      rowData={planListData?.results || []}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      gridOptions={gridOptions}
                      animateRows={true}
                      rowSelection="single"
                      suppressMenuHide={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Choose your plan section ends here */}
      {openEditModal && (
        <EditModal
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          editId={editId}
        />
      )}
      {openAddModal && (
        <AddDetailsModal
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          editId={editId}
        />
      )}
      {openDetailsModal && (
        <ShowPlanDetailsModal
          openDetailsModal={openDetailsModal}
          setOpenDetailsModal={setOpenDetailsModal}
          editId={editId}
        />
      )}
    </div>
  );
};

export default Plan;
