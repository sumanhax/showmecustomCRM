import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "flowbite-react";
import axios from "axios";
import Loader from "../../components/Loader";
import LeadsTaskModal from "./LeadsTaskModal";
import AddLeadModal from "./AddLeadModal";
import UpdateLeadModal from "./UpdateLeadModal";
import AddNoteModal from "./AddNoteModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePartnerClassification, leadList } from "../../Reducer/AddSlice";
import { FaSearch, FaTimes } from "react-icons/fa";

const ManageLeads = () => {
  // const { moodsList, singleMoodMaster } = useSelector(
  //   (state) => state?.moodMastersData
  // );
  const dispatch = useDispatch();
  const { leadListData, loading } = useSelector((state) => state.add);
  // const [openMoodMasterModal, setOpenMoodMasterModal] = useState(false);
  // const [mood_masterId, setMoodMasterId] = useState();
  // const [openUpdateMoodMasterModal, setOpenUpdateMoodMasterModal] =
    useState(false);
  const navigate = useNavigate();
  const [leadsId,setLeadsId]=useState()
  const [leadData, setLeadData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [opentaskModal,setOpenTaskModal]=useState(false)
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openAddLeadModal, setOpenAddLeadModal] = useState(false);
  const [openUpdateLeadModal, setOpenUpdateLeadModal] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [partnerFilter, setPartnerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const api2 = "https://n8n.bestworks.cloud/webhook/lead-status-update";
  const partnerOptions = ["Whale", "Tuna", "Shrimp"];

  const getPartnerStyle = (option) => {
    const styles = {
      Whale: {
        backgroundColor: "#06B6D4", // Vibrant green
        color: "#ffffff",
        borderColor: "#D1D5DB",
      },
      Tuna: {
        backgroundColor: "#3B82F6", // Vibrant blue
        color: "#ffffff",
        borderColor: "#D1D5DB",
      },
      Shrimp: {
        backgroundColor: "#F59E0B", // Vibrant orange
        color: "#ffffff",
        borderColor: "#D1D5DB",
      },
    };
    return (
      styles[option] || {
        backgroundColor: "#F3F4F6",
        color: "#374151",
        borderColor: "#D1D5DB",
      }
    );
  };

  const handlePartnerChange = (leadId, option) => {
    const payload = { lead_id: leadId, partner_option: option };
    dispatch(updatePartnerClassification(payload))
      .unwrap()
      .then(() => {
        toast.success("Partner classification updated");
        fetchLeads();
      })
      .catch(() => {
        toast.error("Failed to update partner classification");
      });
  };
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
    dispatch(leadList());
  };

  useEffect(() => {
    fetchLeads();
  }, [dispatch]);

  // Transform leadListData to match the expected format
  useEffect(() => {
    if (leadListData?.data) {
      console.log("Lead list data from Redux:", leadListData.data);
      // Transform API response to match existing format
      const transformed = leadListData.data.map((lead) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company_name: lead.company_name,
        "Lead Name": lead.name,
        "Company Name": lead.company_name,
        "Email": lead.email,
        "Phone": lead.phone,
        "Lead Status": lead.lead_status?.name || "Unknown",
        "Typeform Date": lead.typeform_date ? new Date(lead.typeform_date).toLocaleDateString() : "",
        "Partner Classification": lead.partner_classification || "",
        "Orders": lead.orders || [],
      }));
      setLeadData(transformed);
    }
  }, [leadListData]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  console.log("leadData", leadData);

  // Filter leads based on search term + partner + lead status
  const filteredLeadData = leadData.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      (lead["Lead Name"] && lead["Lead Name"].toLowerCase().includes(searchLower)) ||
      (lead["Email"] && lead["Email"].toLowerCase().includes(searchLower)) ||
      (lead["Typeform Date"] && lead["Typeform Date"].toLowerCase().includes(searchLower)) ||
      (lead["Lead Status"] && lead["Lead Status"].toLowerCase().includes(searchLower))
    );

    // Apply partner filter when selected (only for leads that have orders)
    const matchesPartner = partnerFilter
      ? (Array.isArray(lead?.Orders) && lead.Orders.length > 0 && (lead?.["Partner Classification"] || "") === partnerFilter)
      : true;

    // Apply lead status filter when selected
    const matchesStatus = statusFilter ? (lead?.["Lead Status"] || "") === statusFilter : true;

    return matchesSearch && matchesPartner && matchesStatus;
  });

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

  const handleAddNote=(id)=>{
    console.log("Note_id",id)
    
    setLeadsId(id)
    setOpenNoteModal(true)
  }

  const handleStatusChange = (leadId, newStatus) => {
    // TODO: Implement status update using kanbanDragnDrop or a new action
    // For now, keeping the existing API call until a proper Redux action is created
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
        console.log("Deleting lead:", leadId);
        
        const response = await axios.post("https://n8n.bestworks.cloud/webhook/delete-lead", {
          id: leadId
        });
        
        console.log("Delete response:", response.data);
        toast.success("Lead deleted successfully!");
        
        // Refresh the leads data
        fetchLeads();
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead. Please try again.");
      }
    }
  };

  const handleViewLead = (leadId) => {
    console.log("Viewing lead:", leadId);
    navigate(`/lead-details/${leadId}`);
  };


  // Custom cell renderer for Lead Name with click navigation
  const LeadNameRenderer = (params) => {
    const leadName = params.value;
    const leadId = params.data.id;
    
    return (
      <button
        onClick={() => handleViewLead(leadId)}
        className="cursor-pointer"
        style={{ 
          background: 'none', 
          border: 'none', 
          padding: 0, 
          textAlign: 'left',
          fontSize: 'inherit',
          color: 'inherit',
          textDecoration: 'none'
        }}
      >
        {leadName}
      </button>
    );
  };

  const columnDefs = [
    {
      field: "name",
      headerName: "Lead Name",
      sortable: true,
      filter: true,
      cellRenderer: LeadNameRenderer,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      filter: true,
    },
    // {
    //   field: "Phone",
    //   headerName: "Phone",
    //   sortable: true,
    //   filter: true,
    // },
    // {
    //   field: "Company Name",
    //   headerName: "Company Name",
    //   sortable: true,
    //   filter: true,
    // },
    {
      field: "Typeform Date",
      headerName: "Date",
      sortable: true,
      filter: true,
    },
    {
      field: "Partner Classification",
      headerName: "Partner",
      width: 200,
      cellRenderer: (params) => {
        const lead = params.data;
        const hasOrders = Array.isArray(lead?.Orders) && lead.Orders.length > 0;
        if (!hasOrders) {
          return (
            <span style={{ fontSize: '12px', color: '#6B7280' }}>N/A</span>
          );
        }
        const current = lead?.["Partner Classification"] || "";
        const style = getPartnerStyle(current);
        return (
          <select
            value={current}
            onChange={(e) => handlePartnerChange(lead.id, e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "16px",
              border: `1px solid ${style.borderColor}`,
              fontSize: "12px",
              fontWeight: 700,
              minWidth: "140px",
              cursor: "pointer",
              background: style.backgroundColor,
              color: style.color,
            }}
          >
            <option value="" disabled>
              Select option
            </option>
            {partnerOptions.map((opt) => {
              const optStyle = getPartnerStyle(opt);
              return (
                <option
                  key={opt}
                  value={opt}
                  style={{
                    backgroundColor: optStyle.backgroundColor,
                    color: optStyle.color,
                    fontWeight: 700,
                  }}
                >
                  {opt}
                </option>
              );
            })}
          </select>
        );
      },
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
      width: 300,
      headerName: "Task",
      field: "task",
      cellRenderer: (params) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAddTask(params?.data?.id)}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] px-3 py-1 text-white text-sm flex justify-center items-center rounded-full"
              style={{ fontSize: '12px' }}
            >
              Add Task
            </button>
            <button
              onClick={() => handleAddNote(params?.data?.id)}
              className="bg-[#10B981] hover:bg-[#059669] px-3 py-1 text-white text-sm flex justify-center items-center rounded-full"
              style={{ fontSize: '12px' }}
            >
              Add Note
            </button>
          </div>
        );
      },
    },
    {
      width: 250,
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
  ];

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
            <div className="flex justify-between items-center mb-4 gap-4 relative">
              <h2 className="text-2xl font-semibold">Leads</h2>
              
              {/* Search Bar in the middle */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search leads by name, email, date, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="w-4 h-4 text-gray-400" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <FaTimes className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter + Add */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="bg-gray-500 hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
                >
                  {partnerFilter || statusFilter
                    ? `${partnerFilter || 'All Partners'} • ${statusFilter || 'All Statuses'}`
                    : 'Filter'}
                </button>
                <Button
                  onClick={() => setOpenAddLeadModal(true)}
                  className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
                >
                  Add New Lead
                </Button>
                {showFilter && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Partner</label>
                      <select
                        value={partnerFilter}
                        onChange={(e) => setPartnerFilter(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                      >
                        <option value="">All</option>
                        {partnerOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Lead Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                      >
                        <option value="">All</option>
                        {leadStatusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setPartnerFilter("");
                          setStatusFilter("");
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setShowFilter(false)}
                        className="px-3 py-1 bg-[#f20c32] text-white rounded-md text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Search Results Counter */}
            {searchTerm && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredLeadData.length} of {leadData.length} leads
                </p>
              </div>
            )}
            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              <AgGridReact
                rowData={filteredLeadData}
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
          {
            openNoteModal&&(
              <AddNoteModal
              leadsId={leadsId}
              openNoteModal={openNoteModal}
              setOpenNoteModal={setOpenNoteModal}
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
