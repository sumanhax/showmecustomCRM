import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  changeStatus,
  getMoodMaster,
  getMoodMasterSingle,
} from "../../Reducer/MoodMasterSlice";
import { MdDelete } from "react-icons/md";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer } from "react-toastify";
import { Button } from "flowbite-react";
import AddMoodMeterModal from "../MoodMeter/AddMoodMeterModal";
import AddMoodMasterMdoal from "./AddMoodMasterMdoal";
import UpdateMoodMasterModal from "./UpdateMoodMasterModal";
import { SolarDashboard } from "../../components/Kanban/solar-dashboard";

const ManageMoodMaster = () => {
  const { moodsList, singleMoodMaster } = useSelector(
    (state) => state?.moodMastersData
  );
  const dispatch = useDispatch();
  const [openMoodMasterModal, setOpenMoodMasterModal] = useState(false);
  const [mood_masterId, setMoodMasterId] = useState();
  const [openUpdateMoodMasterModal, setOpenUpdateMoodMasterModal] =
    useState(false);

  useEffect(() => {
    dispatch(getMoodMaster());
  }, []);
  console.log("moodsList", moodsList);

  const rowData = useMemo(() => {
    return (
      moodsList?.data?.map((tags) => ({
        id: tags?.id,
        mood_master_name: tags?.mood_master_name,
        mood_master_description: tags?.mood_master_description,
        mood_master_color_code: tags?.mood_master_color_code,
        mood_master_icon:
          "https://goodmoodapi.bestworks.cloud/" + tags?.mood_master_icon,
        status: tags.status,
      })) || []
    );
  }, [moodsList?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: "mood_master_name",
        headerName: "Mood Master Name",
        sortable: true,
        filter: true,
      },
      {
        field: "mood_master_description",
        headerName: "Mood Master Description",
        sortable: true,
        filter: true,
      },
      {
        field: "mood_master_color_code",
        headerName: "Mood Master Color Code",
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
              changeStatus({ id: params.data.id, status: newStatus })
            ).then(() => {
              dispatch(getMoodMaster()); // refresh data after success
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
        field: "mood_master_icon",
        headerName: "Emoji",
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
                onClick={() => handleUpdateMoodMaster(params?.data?.id)}
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

  const handleUpdateMoodMaster = (id) => {
    console.log(id, "id");
    setOpenUpdateMoodMasterModal(true);
    setMoodMasterId(id);
    dispatch(getMoodMasterSingle({ user_input: id }));
  };

  return (
    <>
       <>
        <ToastContainer />
        <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
          <div className="h-full lg:h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Mood Master</h2>
              <Button
                onClick={() => setOpenMoodMasterModal(true)}
                className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add Mood Master
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
          {openMoodMasterModal && (
            <AddMoodMasterMdoal
              openMoodMasterModal={openMoodMasterModal}
              setOpenMoodMasterModal={setOpenMoodMasterModal}
            />
          )}
          {singleMoodMaster && openUpdateMoodMasterModal && (
            <UpdateMoodMasterModal
              openUpdateMoodMasterModal={openUpdateMoodMasterModal}
              setOpenUpdateMoodMasterModal={setOpenUpdateMoodMasterModal}
              mood_masterId={mood_masterId}
              singleMoodMaster={singleMoodMaster}
            />
          )}
        </div>
      </> 
    
    </>
  );
};
export default ManageMoodMaster;
