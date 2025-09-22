import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, TextInput, Label, ToggleSwitch } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllCourse } from "../../Reducer/CourseSlice";
import { useSelector } from "react-redux";
import { MdDelete, MdDeleteForever, MdEditNote } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import {
  getActiveDeactiveDesc,
  getCateGory,
  getCateGoryDes,
  getSingleCateGory,
} from "../../Reducer/CategorySlice";
import UpdateModal from "./UpdateModal";
import CateDeleteModal from "./CateDeleteModal";

const ManageCateDes = () => {
  // const [openModal, setOpenModal] = useState(false);
  const { singleCate, loading } = useSelector((state) => state?.cate);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id;
  const [openDesModal, setOpenDesModal] = useState(false);
  const [desId, setDesId] = useState();
  const [openDeleteManModal, setOpenDeleteManModal] = useState(false);
  useEffect(() => {
    dispatch(getSingleCateGory({ category_id: id }));
  }, []);
  console.log("allDes", singleCate);

  const handleCourseDetails = (id) => {
    // console.log("id",id)
    navigate(`/course-details/${id}`);
  };

  const handleAddCourse = () => {
    navigate("/add-course");
  };

  const handleStatus = (id, status) => {
    console.log("rid", id);
    // if (status) {
    //   alert("Status changed to inactive");
    // } else {
    //   setSwitchStatus(true);
    //   alert("Status changed to active");
    // }
  };

  const handleDeleteZone = (id) => {
    setZoneId(id);
    setOpenDeleteModal(true);
  };

  const transformedRowData = useMemo(() => {
    return singleCate?.result?.[0]?.CategoryDesc?.map((batch) => ({
      id: batch.id,
      content_type: batch?.content_type,
      target_vibes: batch?.target_vibes,
      status: batch?.status,
    }));
  }, [singleCate]);

  const columnDefs = useMemo(() => {
    const columns = [
      {
        field: "content_type",
        headerName: "Content Type",
        sortable: true,
        filter: true,
      },
      {
        field: "target_vibes",
        headerName: "Target Vibes",
        sortable: true,
        filter: true,
      },
      {
        field: "status",
        headerName: "Status",
        cellRenderer: (params) => {
          const isChecked = params.value;

          const handleStatusChange = () => {
            const newStatus = isChecked ? 0 : 1;
            dispatch(
              getActiveDeactiveDesc({
                category_desc_id: params.data.id,
                status: newStatus,
              })
            ).then(() => {
              dispatch(getSingleCateGory({ category_id: id })); // refresh data
            });
          };

          return (
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleStatusChange(params.data.id, isChecked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 relative"></div>
            </label>
          );
        },
      },
      {
        headerName: "Action",
        field: "details",
        cellRenderer: (params) => (
          <div className="flex gap-2">
            <div>
              <Button
                onClick={() => updateDes(params?.data?.id)}
                className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-sm px-4 py-1"
              >
                Update
              </Button>
            </div>
            <div>
              <div>
                <button
                  type="button"
                  onClick={() => handleDeleteZoneM(params?.data?.id)}
                >
                  <MdDelete size={20} color="red" />
                </button>
              </div>
            </div>
          </div>
        ),
      },
    ];

    return columns;
  }, []);

  const updateDes = (id) => {
    setOpenDesModal(true);
    setDesId(id);
  };
  const handleDeleteZoneM = (id) => {
    console.log("Hello");

    setOpenDeleteManModal(true);
    setDesId(id);
  };

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Category Description Details
            </h2>
          </div>
          {transformedRowData && (
            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              {loading ? (
                "Loading..."
              ) : (
                <AgGridReact
                  rowData={transformedRowData}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  domLayout="autoHeight"
                />
              )}
            </div>
          )}
        </div>
      </div>
      {openDesModal && (
        <UpdateModal
          openDesModal={openDesModal}
          setOpenDesModal={setOpenDesModal}
          desId={desId}
          cateId={id}
        />
      )}
      {openDeleteManModal && (
        <CateDeleteModal
          openDeleteManModal={openDeleteManModal}
          setOpenDeleteManModal={setOpenDeleteManModal}
          desId={desId}
          cateId={id}
        />
      )}
    </div>
  );
};

export default ManageCateDes;
