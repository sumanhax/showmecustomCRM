import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { getActiveDeactive, getZoneList } from "../../Reducer/ZoneSlice";
import { useSelector } from "react-redux";
import AddZoneModal from "./AddZoneModal";
import UpdateZoneModal from "./UpdateZoneModal";
import AddCategoryModal from "./AddCategoryModal";
import { MdDelete } from "react-icons/md";
import DeleteZoneModal from "./DeleteZoneModal";

const ManageZones = () => {
  const { allZone } = useSelector((state) => state?.zone);
  const [openModal, setOpenModal] = useState(false);
  const [zoneId, setZoneId] = useState();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openCateGoryModal, setOpenCateGoryModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getZoneList());
  }, []);
  console.log("allZone", allZone);

  // Sample data - in real app, this would come from your API
  const rowData = useMemo(() => {
    return (
      allZone?.result?.map((zone) => ({
        id: zone?.id,
        zone: zone?.zone,
        status: zone.status,
      })) || []
    );
  }, [allZone?.result]);

  const columnDefs = useMemo(
    () => [
      {
        field: "zone",
        headerName: "Zone",
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
              getActiveDeactive({
                zone_id: params.data.id,
                status: newStatus,
              })
            ).then(() => {
              dispatch(getZoneList()); // refresh data
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
        width: 400,
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateZone(params?.data?.id)}
                className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => handleAddCategory(params?.data?.id)}
                className="bg-[#2868c2] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add Category
              </button>

              <button onClick={() => handleDeleteZone(params?.data?.id)}>
                <MdDelete size={20} color="red" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleUpdateZone = (id) => {
    console.log(id, "id");

    setZoneId(id);
    setOpenUpdateModal(true);
  };
  const handleAddCategory = (id) => {
    setZoneId(id);
    setOpenCateGoryModal(true);
  };
  const handleDeleteZone = (id) => {
    setZoneId(id);
    setOpenDeleteModal(true);
  };
  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Zone Details</h2>
            <Button
              onClick={() => setOpenModal(true)}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add Zone
            </Button>
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
            />
          </div>
        </div>
      </div>

      {openModal && (
        <AddZoneModal openModal={openModal} setOpenModal={setOpenModal} />
      )}
      {openUpdateModal && (
        <UpdateZoneModal
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          zoneId={zoneId}
        />
      )}

      {openCateGoryModal && (
        <AddCategoryModal
          openCateGoryModal={openCateGoryModal}
          setOpenCateGoryModal={setOpenCateGoryModal}
          zoneId={zoneId}
        />
      )}
      {openDeleteModal && (
        <DeleteZoneModal
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          zoneId={zoneId}
        />
      )}
    </div>
  );
};

export default ManageZones;
