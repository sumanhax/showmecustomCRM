import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  changeStatus,
  getMoodMaster
} from "../../Reducer/MoodMasterSlice";
import { addRep } from "../../Reducer/AddSlice";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "flowbite-react";
import axios from "axios";
import Loader from "../../components/Loader";
import { useForm } from "react-hook-form";


const ManageReps = () => {
  // const { moodsList, singleMoodMaster } = useSelector(
  //   (state) => state?.moodMastersData
  // );
  const dispatch = useDispatch();
  const [openMoodMasterModal, setOpenMoodMasterModal] = useState(false);
  const [mood_masterId, setMoodMasterId] = useState();
  const [openUpdateMoodMasterModal, setOpenUpdateMoodMasterModal] =
    useState(false);

    const [repData, setRepData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

  // React Hook Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const {loading} = useSelector((state)=>state.add);
  // Form submission handler
  const onSubmit = (data)=>{
    dispatch(addRep(data))
    .then((res) => {
      console.log("res", res);
      toast.success(res?.payload?.message);
      reset();
      setOpenMoodMasterModal(false);
      axios.get("https://n8nnode.bestworks.cloud/webhook/airtable-rep-fetch")
    })
    .catch((err) => {
      console.log("err", err);
      toast.error(res?.payload?.message);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    axios.get("https://n8nnode.bestworks.cloud/webhook/airtable-rep-fetch")
      .then((res) => {
        console.log("res", res.data);
        setRepData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching reps:", error);
        setRepData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  console.log("repData", repData);

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
          color: "#FFFFFF"
        },
        "Sample Art Approved": {
          backgroundColor: "#06B6D4", // Vibrant green
          color: "#FFFFFF"
        },
        "Sample Shipped": {
          backgroundColor: "#F59E0B", // Vibrant orange
          color: "#FFFFFF"
        },
        "Sample Delivered": {
          backgroundColor: "#10B981", // Vibrant cyan
          color: "#FFFFFF"
        },
        "Nurture Sequence": {
          backgroundColor: "#8B5CF6", // Vibrant purple
          color: "#FFFFFF"
        },
        "Warm Lead": {
          backgroundColor: "#EF4444", // Vibrant red
          color: "#FFFFFF"
        },
        "Cold Lead": {
          backgroundColor: "#EC4899", // Vibrant pink
          color: "#FFFFFF"
        }
      };
      
      return statusStyles[status] || {
        backgroundColor: "#6B7280", // Default gray
        color: "#FFFFFF"
      };
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
          ...style
        }}
      >
        {status}
      </div>
    );
  };

  // Custom cell renderer for Assigned Leads array
  const AssignedLeadsRenderer = (params) => {
    const assignedLeads = params.value;
    
    // Check if it's an array
    if (!Array.isArray(assignedLeads)) {
      return <div>No leads assigned</div>;
    }

    // Single color for all lead badges
    const badgeStyle = {
      backgroundColor: "#3B82F6", // Vibrant blue
      color: "#FFFFFF"
    };

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {assignedLeads.map((leadId, index) => {
          return (
            <div
              key={leadId}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "28px",
                padding: "0 12px",
                borderRadius: "14px",
                fontSize: "11px",
                fontWeight: "600",
                textAlign: "center",
                minWidth: "80px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                ...badgeStyle
              }}
            >
              {leadId.substring(0, 8)}...
            </div>
          );
        })}
      </div>
    );
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "Rep Name",
        headerName: "Rep Name",
        sortable: true,
        filter: true,
      },
      {
        field: "Email Address",
        headerName: "Email Address",
        sortable: true,
        filter: true,
      },
      {
        field: "Phone Number",
        headerName: "Phone Number",
        sortable: true,
        filter: true,
      },
      // {
      //   field: "Assigned Leads",
      //   headerName: "Assigned Leads",
      //   sortable: false,
      //   filter: false,
      //   cellRenderer: AssignedLeadsRenderer,
      //   width: 300,
      // },
      {
        field: "# of Assigned Leads",
        headerName: "# of Assigned Leads",
        sortable: true,
        filter: true,
      },
      // {
      //   field: "Typeform Date",
      //   headerName: "Date",
      //   sortable: true,
      //   filter: true,
      // },
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
      {
        width: 400,
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateMoodMaster(params?.data?.id)}
                className="bg-[#10B981] hover:bg-black px-4 py-1 text-white text-base flex justify-center items-center rounded-full"
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
          <Loader size="large" text="Loading Reps..." />
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
              <h2 className="text-2xl font-semibold">Reps</h2>
              <Button
                onClick={() => setOpenMoodMasterModal(true)}
                className="bg-[#f20c32] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add New Rep
              </Button>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              <AgGridReact
                rowData={repData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
                getRowHeight={() => 50}
              />
            </div>
          </div>
          {/* Add Rep Modal */}
          {openMoodMasterModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}>
                {/* Close Button */}
                <button
                  onClick={() => {
                    setOpenMoodMasterModal(false);
                    reset();
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  ×
                </button>

                {/* Modal Header */}
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Add New Rep
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '4px 0 0 0'
                  }}>
                    Add a new sales representative to the system
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Rep Name Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Rep Name *
                    </label>
                    <input
                      type="text"
                      {...register('rep_name', { required: 'Rep name is required' })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors.rep_name ? '1px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.rep_name && (
                      <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.rep_name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.email && (
                      <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.phone && (
                      <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Rep Address Field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Rep Address
                    </label>
                    <textarea
                      {...register('rep_address')}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    marginTop: '8px'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMoodMasterModal(false);
                        reset();
                      }}
                      style={{
                        padding: '10px 20px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                        background: 'linear-gradient(135deg, #f20c32 0%, #dc2626 100%)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {loading?"Processing...":"Add Rep"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </> 
    
    </>
  );
};
export default ManageReps;
