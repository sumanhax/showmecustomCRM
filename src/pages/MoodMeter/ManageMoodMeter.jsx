import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getActiveDeactiveMoodMeter,
  getMoodMeter,
} from "../../Reducer/MoodMeterSlice";

import { ToastContainer } from "react-toastify";
import AddMoodMeterModal from "./AddMoodMeterModal";
import UpdateMoodMeterModal from "./UpdateMoodMeterModal";

const ManageMoodMeter = () => {
  const dispatch = useDispatch();
  const { allMoodMeter } = useSelector((state) => state?.moodData);
  const [openAddTagModal, setOpenTagModal] = useState(false);
  const [openUpdateTagModal, setOpenUpdateTagModal] = useState(false);
  const [moodmeterId, setMoodMeterId] = useState();
  useEffect(() => {
    dispatch(getMoodMeter());
  }, []);
  console.log("allTags", allMoodMeter);

  const rowData = useMemo(() => {
    return (
      allMoodMeter?.res?.map((tags) => ({
        id: tags?.id,
        mood_meter_name: tags?.mood_meter_name,
        mood_meter_avatar: tags?.mood_meter_avatar,
        status: tags.status,
      })) || []
    );
  }, [allMoodMeter?.res]);

  const columnDefs = useMemo(
    () => [
      {
        field: "mood_meter_name",
        headerName: "Mood Meter Name",
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
              getActiveDeactiveMoodMeter({
                mood_meter_id: params.data.id,
                status: newStatus,
              })
            ).then(() => {
              dispatch(getMoodMeter()); // refresh data
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
        field: "mood_meter_avatar",
        headerName: "Avatar",
        cellRenderer: (params) => {
          return (
            <img
              src={params.value}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
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
                onClick={() => handleUpdateTags(params?.data?.id)}
                className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Update
              </button>

              {/* <button
              // onClick={() => handleDeleteZone(params?.data?.id)}
              >
                <MdDelete size={20} color="red" />
              </button> */}
            </div>
          );
        },
      },
    ],
    []
  );

  const handleUpdateTags = (id) => {
    console.log(id, "id");
    setOpenUpdateTagModal(true);
    setMoodMeterId(id);
  };

  return (
    <>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Mood Meter</h2>
            <Button
              onClick={() => setOpenTagModal(true)}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add Mood Meter
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
              getRowHeight={() => 50}
            />
          </div>
        </div>
        {openAddTagModal && (
          <AddMoodMeterModal
            openAddTagModal={openAddTagModal}
            setOpenTagModal={setOpenTagModal}
          />
        )}
        {openUpdateTagModal && (
          <UpdateMoodMeterModal
            openUpdateTagModal={openUpdateTagModal}
            setOpenUpdateTagModal={setOpenUpdateTagModal}
            moodmeterId={moodmeterId}
          />
        )}
      </div>
    </>
  );
};
export default ManageMoodMeter;
