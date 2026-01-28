

import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-layouts/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-kanban/styles/material.css";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbEyeShare  } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { kanbanBulkOrderDragnDrop } from "../../Reducer/AddSlice";
import AddProjectModal from "../../pages/ManageLeads/AddProjectModal";

type StageColumn = {
  stage: {
    id: string | number;
    name: string;
    sort_order: number;
  };
  orders: any[];
};

export function KanbanBoardBulkOrder({
  onRefresh,
  columnsData = [],
  source,
}: {
  onRefresh?: () => void;
  columnsData: StageColumn[];
  source: "ONLINE" | "OFFLINE";
}) {
  const navigate = useNavigate();
  const dispatch: any = useDispatch();

  const [leadData, setLeadData] = useState<any[]>([]);
  const [kanbanWidth, setkanbanWidth] = useState<number>(0);
  const [emailModal, setEmailModal] = useState<{isOpen: boolean, leadEmail: string, leadName: string}>({
    isOpen: false,
    leadEmail: '',
    leadName: ''
  });
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [callModal, setCallModal] = useState<{isOpen: boolean, phoneNumber: string, leadName: string}>({
    isOpen: false,
    phoneNumber: '',
    leadName: ''
  });
  const [callForm, setCallForm] = useState({
    phone: '',
    message: ''
  });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isCallSending, setIsCallSending] = useState(false);
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);

  // Function to get color for order type tags
  const getOrderTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Screenprint': '#fce7f3', // Light blue
      'Embroidery': '#fef3c7', // Light teal/mint green
      'Promo': '#bbf7d0', // Light green
      'Custom': '#fef3c7', // Light yellow
      'Bulk': '#e0e7ff', // Light indigo
      'Sample': '#fce7f3', // Light pink
      'Headwear': '#e0e7ff', // Light gray
    };
    return colors[type] || '#f3f4f6'; // Default light gray
  };

  const columns = useMemo(() => {
    if (!columnsData || !Array.isArray(columnsData)) return [];

    const sorted = [...columnsData].sort(
      (a, b) => (a?.stage?.sort_order || 0) - (b?.stage?.sort_order || 0)
    );

    return sorted.map((col) => ({
      headerText: col?.stage?.name || "",
      keyField: col?.stage?.name || "",
      stageId: col?.stage?.id,
    }));
  }, [columnsData]);

  // Transform API columns + orders into Kanban card data
  useEffect(() => {
    if (!columnsData || !Array.isArray(columnsData)) {
      setLeadData([]);
      setkanbanWidth(0);
      return;
    }

    const cards: any[] = [];

    columnsData.forEach((col) => {
      const stageName = col?.stage?.name;
      const stageId = col?.stage?.id;

      col?.orders?.forEach((order) => {
        if (source === "ONLINE") {
          const customer = order.customer || {};
          cards.push({
            Id: order.id,
            // Title: order.order_number,
            Title: "Order",
            LeadName: customer.name,
            Status: stageName,
            Summary: `Status: ${order.status} | Payment: ${
              order.payment_status
            } | Created: ${order.created_at}`,
            Company: customer.company_name,
            Email: customer.email,
            Phone: customer.phone,
            OrderType: [], // online orders don't have explicit order types in payload
            OrderAmount: Number(order.order_amount || 0),
            LeadId: customer.id,
            StageId: stageId,
            Source: "ONLINE",
          });
        } else {
          const lead = order.lead || {};
          cards.push({
            Id: order.id,
            Title: "Order",
            LeadName: lead.name,
            Status: stageName,
            Summary: `Status: ${order.order_status} | Origin: ${
              order.order_origin
            } | Start: ${order.start_date}`,
            Company: lead.company_name,
            Email: lead.email,
            Phone: lead.phone,
            OrderType: order.order_types || [],
            OrderAmount: Number(order.order_amount || 0),
            LeadId: order.lead_id,
            StageId: stageId,
            Source: "OFFLINE",
          });
        }
      });
    });

    setLeadData(cards);
    setkanbanWidth((columns || []).length * 350);
  }, [columnsData, source, columns]);

  // Remove license error
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll('.syncfusion-license-error').forEach(el => el.remove());
    }, 500);
  
    return () => clearInterval(interval);
  }, []);
  

const handleStatusUpdate = async (cardData: any) => {
  try {
    const targetColumn = columns.find(
      (col: any) => col.keyField === cardData.Status
    );

    if (!targetColumn || !targetColumn.stageId) {
      console.warn("Target column / stage not found for drag-and-drop");
      return;
    }

    const payload: any = {
      id: cardData.Id,
      order_stage_id: targetColumn.stageId,
      source: cardData.Source || source,
    };

    await dispatch(kanbanBulkOrderDragnDrop(payload)).unwrap();

    toast.success("Status updated successfully");
    if (onRefresh) {
      try {
        onRefresh();
      } catch (e) {
        console.log("onRefresh error", e);
      }
    }
  } catch (error) {
    console.error("Error updating status", error);
    toast.error("Failed to update status. Please try again.");
  }
};

// Email handler functions
const handleEmailClick = (leadEmail: string, leadName: string) => {
  setEmailModal({
    isOpen: true,
    leadEmail,
    leadName
  });
  setEmailForm({
    to: leadEmail,
    subject: `Follow up - ${leadName}`,
    message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`
  });
};

const handleEmailSend = () => {
  if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) {
    toast.error('Please fill in all fields.');
    return;
  }

  setIsEmailSending(true);
  const payload = {
    reciepent: emailForm.to,
    sender: 'teams@showmecustomapparel', // You can replace this with actual sender email
    subject: emailForm.subject,
    replyBody: emailForm.message,
  };

  axios.post('https://n8n.bestworks.cloud/webhook/email-sender', payload)
    .then(res => {
      if (res.status === 200) {
        toast.success('Email Sent Successfully!');
        setEmailModal({ isOpen: false, leadEmail: '', leadName: '' });
        setEmailForm({ to: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send email. Please try again.');
      }
    })
    .catch(err => {
      console.error("Error sending email:", err);
      toast.error('An error occurred while sending the email.');
    })
    .finally(() => {
      setIsEmailSending(false);
    });
};

const handleEmailModalClose = () => {
  setEmailModal({ isOpen: false, leadEmail: '', leadName: '' });
  setEmailForm({ to: '', subject: '', message: '' });
};

// Call modal handler functions
const handleCallClick = (phoneNumber: string, leadName: string) => {
  setCallModal({
    isOpen: true,
    phoneNumber,
    leadName
  });
  setCallForm({
    phone: phoneNumber,
    message: `Hi ${leadName},\n\nI hope this call finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`
  });
};

const handleCallSend = () => {
  if (!callForm.phone.trim() || !callForm.message.trim()) {
    toast.error('Please fill in all fields.');
    return;
  }

  setIsCallSending(true);
  // Sample handler function - you can replace this with actual API call
  console.log("Sending call message:", callForm);
  
  // Simulate API call
  setTimeout(() => {
    toast.success("Call message sent successfully!");
    setCallModal({ isOpen: false, phoneNumber: '', leadName: '' });
    setCallForm({ phone: '', message: '' });
    setIsCallSending(false);
  }, 2000);
};

const handleCallModalClose = () => {
  setCallModal({ isOpen: false, phoneNumber: '', leadName: '' });
  setCallForm({ phone: '', message: '' });
};

// View lead handler function
const handleViewLead = (leadId: string) => {
  navigate(`/lead-details/${leadId}`);
};

// Add project handler function
const handleAddProject = (leadId: string) => {
  console.log("Adding project for lead:", leadId);
  setOpenAddProjectModal(true);
};

const handleProjectAdded = (projectData: any) => {
  console.log("Project added:", projectData);
  // Refresh kanban board after project is added
  if (onRefresh) {
    try {
      onRefresh();
    } catch (e) {
      console.log("onRefresh error after project add", e);
    }
  }
};
  // Prevent incorrect drags
  // function onDragStart(args: any) {
  //   if (args.data.Status === "Closed Won" || args.data.Status === "Closed Lost") {
  //     args.cancel = true;
  //   }
  // }

function onDragStop(args: any) {
  // let cardData = Array.isArray(args.data) ? args.data : args.data;
 const cardData = Array.isArray(args.data) ? args.data[0] : args.data;
console.log('args',args)
  // If cardData.Status is already the target column status after drop

  if (!cardData) return;

  // Now call handleStatusUpdate with the updated status
  console.log("leadData.id", leadData);
  const existing = leadData.find((x) => x.Id === cardData.Id);
  console.log("find", existing);

  // Only trigger if status actually changed
  if (!existing || existing.Status === cardData.Status) {
    return;
  }

  handleStatusUpdate(cardData);
}




  // Custom Card Template
  const cardTemplate = (props: any) => {
    return (
      <div
  className="e-card-content"
  style={{
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    margin: '5px',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    minWidth: '240px',
    width: '240px',
    overflow: 'hidden'
  }}
>
  {/* Header */}
  <div
    style={{
      padding: '10px 12px 8px 12px',
      position: 'relative',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderBottom: '1px solid #e2e8f0'
    }}
  >
    {/* View Icon */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleViewLead(props.LeadId || props.Id);



      }}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'all 0.2s ease-in-out',
        zIndex: 10
      }}
      onMouseOver={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(1.06)';
      }}
      onMouseOut={(e) => {
        (e.target as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      aria-label="View"
      title="View"
    >
      <TbEyeShare size={14} />
    </button>

    {/* Lead Info */}
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
      <div
        style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          marginRight: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '2px',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {props.LeadName || 'Unknown Lead'}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, lineHeight: 1.2 }}>
          {props.Company || 'No Company'}
        </div>
      </div>
    </div>

    {/* Order Info */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        padding: '6px 8px',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}
    >
      <div>
        <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, marginBottom: '1px' }}>Order</div>
        <div style={{ fontSize: '12px', color: '#1f2937', fontWeight: 600, lineHeight: 1.2 }}>
          {props.Title || 'N/A'}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, marginBottom: '1px' }}>Amount</div>
        <div style={{ fontSize: '13px', color: '#059669', fontWeight: 700, lineHeight: 1.2 }}>
          ${props.OrderAmount ? props.OrderAmount.toLocaleString() : '0'}
        </div>
      </div>
    </div>
  </div>

  {/* Contact */}
  <div style={{ padding: '8px 12px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '4px',
        padding: '2px 0'
      }}
    >
      <svg
        style={{ width: '13px', height: '13px', marginRight: '5px', color: '#6b7280' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500, lineHeight: 1.2 }}>
        {props.Email || 'No email provided'}
      </span>
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '6px',
        padding: '2px 0'
      }}
    >
      <svg
        style={{ width: '13px', height: '13px', marginRight: '5px', color: '#6b7280' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500, lineHeight: 1.2 }}>
        {props.Phone || 'No phone provided'}
      </span>
    </div>

    {/* Actions */}
    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEmailClick(props.Email, props.LeadName || props.Title);
        }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 8px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          flex: 1,
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Email
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCallClick(props.Phone, props.LeadName || props.Title);
        }}
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 8px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          flex: 1,
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Text
      </button>
    </div>

    {/* Tags */}
    {props.OrderType && props.OrderType.length > 0 && (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          paddingTop: '4px',
          borderTop: '1px solid #e5e7eb'
        }}
      >
        {props.OrderType.map((type: string, index: number) => (
          <span
            key={index}
            style={{
              background: getOrderTypeColor(type),
              color: '#374151',
              padding: '3px 7px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 700,
              display: 'inline-block',
              border: '1px solid rgba(0,0,0,0.04)',
              lineHeight: 1.1
            }}
          >
            {type}
          </span>
        ))}
      </div>
    )}
  </div>
</div>


    );
  };

  return (
    <div style={{ 
      padding: '5px',
      backgroundColor: '#fff'
    }}>
      {/* Header Section with Add Project Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '10px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0
        }}>
          Bulk Orders Kanban Board
        </h2>
        
        <button
          onClick={() => setOpenAddProjectModal(true)}
          style={{
            backgroundColor: '#f20c32',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.3)';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.2)';
          }}
        >
          <FaPlus size={14} />
          Add Project
        </button>
      </div>

      <div style={{ 
        overflowX: "auto", 
        width: "100%", 
        whiteSpace: "nowrap",
        padding: '10px 0'
      }}>
        <style>
          {`
            .e-kanban .e-kanban-column {
              background: #ffffff !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 8px !important;
              margin: 0 12px !important;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
              min-height: 500px !important;
              min-width: 320px !important;
              width: 320px !important;
            }
            
            .e-kanban .e-kanban-column-header {
              background: #f20c32 !important;
              color: white !important;
              font-weight: 700 !important;
              font-size: 14px !important;
              padding: 16px !important;
              border-radius: 8px 8px 0 0 !important;
              text-align: center !important;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            }
            
            .e-kanban .e-kanban-column-content {
              padding: 16px !important;
              background: transparent !important;
            }
            
            .e-kanban .e-kanban-card {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              margin: 0 !important;
            }
            
            .e-kanban .e-kanban-card:hover {
              transform: translateY(-2px) !important;
              box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            }
            
            .e-kanban .e-kanban-dragged-card {
              transform: rotate(2deg) !important;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            }
            
            .e-kanban .e-kanban-column-header .e-header-text {
              color: white !important;
              font-weight: 700 !important;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
            }
            
            .e-kanban .e-kanban-column-header .e-header-count {
              background: rgba(255, 255, 255, 0.2) !important;
              color: white !important;
              border-radius: 12px !important;
              padding: 4px 8px !important;
              font-weight: 600 !important;
              margin-left: 8px !important;
            }
            
            .e-kanban {
              width: 100% !important;
              min-width: 2000px !important;
            }
          `}
        </style>
        <KanbanComponent
          id="kanban"
          keyField="Status"
          dataSource={leadData}
          dragStop={onDragStop}
          cardSettings={{
            contentField: "Summary",
            headerField: "Title",
            template: cardTemplate,
          }}
          style={{ width: '100%', minWidth: '2000px' }}
        >
          <ColumnsDirective>
            {columns.map(({ headerText, keyField }) => (
              <ColumnDirective key={keyField} headerText={headerText} keyField={keyField} />
            ))}
          </ColumnsDirective>
        </KanbanComponent>
      </div>

      {/* Email Modal */}
      {emailModal.isOpen && (
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
              onClick={handleEmailModalClose}
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
                Send Email
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                Send an email to {emailModal.leadName}
              </p>
            </div>

            {/* Email Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* To Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  To
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#3b82f6'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Subject Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#3b82f6'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Message Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Message
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  rows={6}
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
                  onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#3b82f6'}
                  onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#d1d5db'}
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
                  onClick={handleEmailModalClose}
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
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailSend}
                  disabled={isEmailSending}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    background: isEmailSending 
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    cursor: isEmailSending ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isEmailSending ? 0.7 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isEmailSending) {
                      (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                      (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                >
                  {isEmailSending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {callModal.isOpen && (
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
              onClick={handleCallModalClose}
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
                Text Message
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                Send a text message to {callModal.leadName}
              </p>
            </div>

            {/* Call Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Phone Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={callForm.phone}
                  onChange={(e) => setCallForm({...callForm, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#3b82f6'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Message Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Message
                </label>
                <textarea
                  value={callForm.message}
                  onChange={(e) => setCallForm({...callForm, message: e.target.value})}
                  rows={6}
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
                  onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#3b82f6'}
                  onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#d1d5db'}
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
                  onClick={handleCallModalClose}
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
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCallSend}
                  disabled={isCallSending}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    background: isCallSending 
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    cursor: isCallSending ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isCallSending ? 0.7 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isCallSending) {
                      (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                      (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                >
                  {isCallSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {openAddProjectModal && (
        <AddProjectModal
          isOpen={openAddProjectModal}
          onClose={() => setOpenAddProjectModal(false)}
          onProjectAdded={handleProjectAdded}
        />
      )}
    </div>
  );
}
