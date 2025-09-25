import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeStatus, getMoodMaster } from "../../Reducer/MoodMasterSlice";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer } from "react-toastify";
import { Button } from "flowbite-react";
import axios from "axios";
import Loader from "../../components/Loader";
import LeadsTaskModal from "./LeadsTaskModal";

const ManageLeads = () => {
  const { moodsList, singleMoodMaster } = useSelector(
    (state) => state?.moodMastersData
  );
  const dispatch = useDispatch();
  const [openMoodMasterModal, setOpenMoodMasterModal] = useState(false);
  const [mood_masterId, setMoodMasterId] = useState();
  const [openUpdateMoodMasterModal, setOpenUpdateMoodMasterModal] =
    useState(false);
  const [leadsId,setLeadsId]=useState()
  const [leadData, setLeadData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opentaskModal,setOpenTaskModal]=useState(false)

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://n8nnode.bestworks.cloud/webhook/airtable-lead-fetch")
      .then((res) => {
        console.log("res", res.data);
        setLeadData(res.data);
       
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setLeadData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  console.log("leadData", leadData);

  //   const rowData = useMemo(() => {
  //     return (
  //       moodsList?.data?.map((tags) => ({
  //         id: tags?.id,
  //         mood_master_name: tags?.mood_master_name,
  //         mood_master_description: tags?.mood_master_description,
  //         mood_master_color_code: tags?.mood_master_color_code,
  //         mood_master_icon:
  //           "https://goodmoodapi.bestworks.cloud/" + tags?.mood_master_icon,
  //         status: tags.status,
  //       })) || []
  //     );
  //   }, [moodsList?.data]);

  // Custom cell renderer for Lead Status
  const StatusRenderer = (params) => {
    const status = params.value;

    // Define vibrant colors for each status with white text
    const getStatusStyle = (status) => {
      const statusStyles = {
        "Sample Submitted": {
          backgroundColor: "#3B82F6", // Vibrant blue
          color: "#FFFFFF",
        },
        "Sample Art Approved": {
          backgroundColor: "#06B6D4", // Vibrant green
          color: "#FFFFFF",
        },
        "Sample Shipped": {
          backgroundColor: "#F59E0B", // Vibrant orange
          color: "#FFFFFF",
        },
        "Sample Delivered": {
          backgroundColor: "#10B981", // Vibrant cyan
          color: "#FFFFFF",
        },
        "Nurture Sequence": {
          backgroundColor: "#8B5CF6", // Vibrant purple
          color: "#FFFFFF",
        },
        "Warm Lead": {
          backgroundColor: "#EF4444", // Vibrant red
          color: "#FFFFFF",
        },
        "Cold Lead": {
          backgroundColor: "#EC4899", // Vibrant pink
          color: "#FFFFFF",
        },
      };

      return (
        statusStyles[status] || {
          backgroundColor: "#6B7280", // Default gray
          color: "#FFFFFF",
        }
      );
    };

    const style = getStatusStyle(status);

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "32px", // Fixed height
          padding: "0 16px",
          borderRadius: "16px", // More rounded for better pill shape
          fontSize: "12px",
          fontWeight: "700", // Bolder text
          textAlign: "center",
          minWidth: "140px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          ...style,
        }}
      >
        {status}
      </div>
    );
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "Lead Name",
        headerName: "Lead Name",
        sortable: true,
        filter: true,
      },
      {
        field: "Email",
        headerName: "Email",
        sortable: true,
        filter: true,
      },
      {
        field: "Phone",
        headerName: "Phone",
        sortable: true,
        filter: true,
      },
      {
        field: "Company Name",
        headerName: "Company Name",
        sortable: true,
        filter: true,
      },
      {
        field: "Lead Status",
        headerName: "Lead Status",
        sortable: true,
        filter: true,
        cellRenderer: StatusRenderer,
        width: 200,
      },
      {
        field: "Typeform Date",
        headerName: "Date",
        sortable: true,
        filter: true,
      },
      // {
      //   field: "mood_master_description",
      //   headerName: "Mood Master Description",
      //   sortable: true,
      //   filter: true,
      // },
      // {
      //   field: "mood_master_color_code",
      //   headerName: "Mood Master Color Code",
      //   sortable: true,
      //   filter: true,
      // },

      // {
      //   field: "status",
      //   headerName: "Status",
      //   cellRenderer: (params) => {
      //     const isChecked = params.value;

      //     const handleStatusChange = () => {
      //       const newStatus = isChecked ? 0 : 1;
      //       dispatch(
      //         changeStatus({ id: params.data.id, status: newStatus })
      //       ).then(() => {
      //         dispatch(getMoodMaster()); // refresh data after success
      //       });
      //     };

      //     return (
      //       <label className="inline-flex items-center cursor-pointer">
      //         <input
      //           type="checkbox"
      //           checked={isChecked}
      //           onChange={() => handleStatusChange(params.data.id, isChecked)}
      //           className="sr-only peer"
      //         />
      //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 relative"></div>
      //       </label>
      //     );
      //   },
      // },
      // {
      //   field: "mood_master_icon",
      //   headerName: "Emoji",
      //   cellRenderer: (params) => {
      //     return (
      //       <img
      //         src={params.value}
      //         alt="avatar"
      //         className="w-12 h-12 rounded-full object-cover"
      //       />
      //     );
      //   },
      // },
      // {
      //   width: 400,
      //   headerName: "Actions",
      //   field: "actions",
      //   cellRenderer: (params) => {
      //     return (
      //       <div className="flex gap-2">
      //         <button
      //           onClick={() => handleUpdateMoodMaster(params?.data?.id)}
      //           className="bg-[#10B981] hover:bg-black px-4 py-1 text-white text-base flex justify-center items-center rounded-full"
      //         >
      //           Update
      //         </button>

      //         {/* <button
      //         // onClick={() => handleDeleteZone(params?.data?.id)}
      //         >
      //           <MdDelete size={20} color="red" />
      //         </button> */}
      //       </div>
      //     );
      //   },
      // },
        {
        width: 400,
        headerName: "Task",
        field: "actions",
        cellRenderer: (params) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleAddTask(params?.data?.id)}
                className="bg-[#10B981] hover:bg-black px-4 py-1 text-white text-base flex justify-center items-center rounded-full"
              >
                Add Task
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

  const handleAddTask=(id)=>{
    console.log("Task_id",id)
    
    setLeadsId(id)
    setOpenTaskModal(true)
  }

  //   const handleUpdateMoodMaster = (id) => {
  //     console.log(id, "id");
  //     setOpenUpdateMoodMasterModal(true);
  //     setMoodMasterId(id);
  //     dispatch(getMoodMasterSingle({ user_input: id }));
  //   };

  // Show loader while data is being fetched
  if (isLoading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading Leads..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <>
        <ToastContainer />
        <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
          <div className="h-full lg:h-screen">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-2xl font-semibold">Leads</h2>
              <Button
                onClick={() => setOpenMoodMasterModal(true)}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Lead
              </Button> */}
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              <AgGridReact
                rowData={leadData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
                getRowHeight={() => 50}
              />
            </div>
          </div>
          {/* {openMoodMasterModal && (
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
          )} */}
          {
            opentaskModal&&(
              <LeadsTaskModal
              leadsId={leadsId}
              opentaskModal={opentaskModal}
              setOpenTaskModal={setOpenTaskModal}
              />
            )
          }
        </div>
      </>
    </>
  );
};
export default ManageLeads;
