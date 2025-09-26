import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeStatus, getMoodMaster } from "../../Reducer/MoodMasterSlice";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "flowbite-react";
import axios from "axios";
import Loader from "../../components/Loader";
import LeadsTaskModal from "./LeadsTaskModal";
import AddLeadModal from "./AddLeadModal";
import UpdateLeadModal from "./UpdateLeadModal";

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
  const [openAddLeadModal, setOpenAddLeadModal] = useState(false);
  const [openUpdateLeadModal, setOpenUpdateLeadModal] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState(null);

  const api2 = "https://n8nnode.bestworks.cloud/webhook/lead-status-update";
  // Lead status options
  const leadStatusOptions = [
    "Sample Submitted",
    "Sample Art Approved", 
    "Sample Shipped",
    "Sample Delivered",
    "Nurture Sequence",
    "Warm Lead",
    "Cold Lead"
  ];

  const fetchLeads = () => {
    console.log("fetchLeads called - refreshing leads data");
    setIsLoading(true);
    axios
      .get("https://n8nnode.bestworks.cloud/webhook/airtable-lead-fetch")
      .then((res) => {
        console.log("Leads data refreshed:", res.data);
        setLeadData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setLeadData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
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

  // Custom cell renderer for Lead Status with dropdown
  const StatusRenderer = (params) => {
    const status = params.value;
    const leadId = params.data.id;
    

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

    const handleDropdownChange = (event) => {
      const newStatus = event.target.value;
      handleStatusChange(leadId, newStatus);
    };

    return (
      <select
        value={status}
        onChange={handleDropdownChange}
        style={{
          padding: "8px 12px",
          borderRadius: "16px",
          border: "none",
          fontSize: "12px",
          fontWeight: "700",
          textAlign: "center",
          minWidth: "160px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          ...style,
        }}
      >
        {leadStatusOptions.map((option) => (
          <option key={option} value={option} style={{ backgroundColor: "white", color: "#374151" }}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  const handleAddTask=(id)=>{
    console.log("Task_id",id)
    
    setLeadsId(id)
    setOpenTaskModal(true)
  }

  const handleStatusChange = (leadId, newStatus) => {
    // Find the lead data to get the email
    const lead = leadData.find(l => l.id === leadId);
    if (!lead) {
      console.error("Lead not found");
      toast.error("Lead not found");
      return;
    }

    const leadEmail = lead["Email"] || lead["email"];
    if (!leadEmail) {
      console.error("Lead email not found");
      toast.error("Lead email not found");
      return;
    }

    axios.post(api2, { 
      id: leadId, 
      email: leadEmail, 
      status: newStatus 
    })
    .then(() => {
      toast.success("Status updated successfully");
      fetchLeads(); // Refresh the leads data
      console.log("Status updated successfully");
    })
    .catch((error) => {
      console.error("Error updating status", error);
      toast.error("Failed to update status. Please try again.");
    });
  };

  const handleUpdateLead = (leadId) => {
    console.log("handleUpdateLead called with leadId:", leadId);
    console.log("leadData:", leadData);
    const lead = leadData.find(l => l.id === leadId);
    console.log("Found lead:", lead);
    if (lead) {
      setSelectedLeadData(lead);
      setOpenUpdateLeadModal(true);
      console.log("Modal should be opening now");
    } else {
      console.log("Lead not found");
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        // You can implement API call here to delete the lead
        console.log("Deleting lead:", leadId);
        
        // For now, just update the local state
        setLeadData(prevData => prevData.filter(lead => lead.id !== leadId));
        
        toast.success("Lead deleted successfully!");
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead. Please try again.");
      }
    }
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
      {
        width: 200,
        headerName: "Task",
        field: "task",
        cellRenderer: (params) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleAddTask(params?.data?.id)}
                className="bg-[#10B981] hover:bg-black px-4 py-1 text-white text-base flex justify-center items-center rounded-full"
              >
                Add Task
              </button>
            </div>
          );
        },
      },
      {
        width: 200,
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateLead(params?.data?.id)}
                className="bg-[#3B82F6] hover:bg-[#2563EB] px-3 py-1 text-white text-sm flex justify-center items-center rounded-full"
                style={{ fontSize: '12px' }}
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteLead(params?.data?.id)}
                className="bg-[#EF4444] hover:bg-[#DC2626] px-3 py-1 text-white text-sm flex justify-center items-center rounded-full"
                style={{ fontSize: '12px' }}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [handleAddTask, handleUpdateLead, handleDeleteLead]
  );

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
               <h2 className="text-2xl font-semibold">Leads</h2>
              <Button
                onClick={() => setOpenAddLeadModal(true)}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Lead
              </Button> 
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
          {openAddLeadModal && (
            <AddLeadModal
              openAddLeadModal={openAddLeadModal}
              setOpenAddLeadModal={setOpenAddLeadModal}
              onLeadAdded={fetchLeads}
            />
          )}
          {openUpdateLeadModal && selectedLeadData && (
            <UpdateLeadModal
              openUpdateLeadModal={openUpdateLeadModal}
              setOpenUpdateLeadModal={setOpenUpdateLeadModal}
              leadData={selectedLeadData}
              onLeadUpdated={fetchLeads}
            />
          )}
        </div>
      </>
    </>
  );
};
export default ManageLeads;
