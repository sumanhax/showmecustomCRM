

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
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function KanbanBoardBulkOrder() {
  const navigate = useNavigate();
  const api = "https://n8nnode.bestworks.cloud/webhook/get-kanbanbukorder";
  const api2 = "https://n8nnode.bestworks.cloud/webhook/post-kanbanbukorder";

  const [leadData, setLeadData] = useState<any[]>([]);
  const [reload, setReload] = useState<any[]>([]);
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

  // Fetch lead data
  useEffect(() => {
    axios
      .get(api)
      .then((res: any) => {
        console.log("res", res.data);
        // Transform new Order schema → Kanban format
        const transformed = res.data.map((order: any) => ({
          Id: order.id,
          Title: order["Order Name"],
          Status: order["Order Stage"] || "Order received from customer",
          Summary:
            `Status: ${order.Status ?? "Open"} | Created: ${order["Created Date"] ?? order.createdTime}`,
          Company: order.Rep?.[0] || "",
          Email: order["Lead Email"] ?? "",
          Phone: "",
          Industry: "",
          Assignee: order.Rep?.[0] || "Unassigned",
        }));
        setLeadData(transformed);
        // Set minimum width for proper column spacing
        setkanbanWidth(columns.length * 350)
      })
      .catch((err) => {
        console.error("err", err);
      });
  }, [reload]);

  // Remove license error
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll('.syncfusion-license-error').forEach(el => el.remove());
    }, 500);
  
    return () => clearInterval(interval);
  }, []);
  

const handleStatusUpdate = (leadInfo: { id: string; leadEmail: string; orderStage: string }) => {
  console.log("trigger",leadInfo)
  axios.post(api2, { id: leadInfo.id, leadEmail: leadInfo.leadEmail, orderStage: leadInfo.orderStage })
    .then(() => {
      toast.success("Status updated successfully");
      setReload([1])
      console.log("Status updated successfully");
    })
    .catch((error) => {
      console.error("Error updating status", error);
      toast.error("Failed to update status. Please try again.");
    });
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
    sender: 'noreply@company.com', // You can replace this with actual sender email
    subject: emailForm.subject,
    replyBody: emailForm.message,
  };

  axios.post('https://n8nnode.bestworks.cloud/webhook/email-sender', payload)
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
  console.log('leadData.id',leadData)
  const find=leadData.find(x=>x.Id==args?.data[0]?.Id)
  console.log("find",find)
  if(find.Status != args?.data[0]?.Status){
    handleStatusUpdate({
    id: cardData.Id,
    leadEmail: cardData.Email,
    orderStage: cardData.Status, // This is the new column after drop
  });
  }

  // Optional: Log to confirm
  console.log("DragDrop Status Update Triggered:", cardData);
}




  // Custom Card Template
  const cardTemplate = (props: any) => {
    return (
      <div className="e-card-content" style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        margin: '8px',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        minWidth: '230px',
        width: '230px'
      }}>
        <div className="e-card-header" style={{ padding: '16px', position: 'relative' }}>
          {/* View Icon - Top Right Corner */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewLead(props.Id);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '18px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out',
              zIndex: 10
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
              // (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              // (e.target as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <TbEyeShare    size={16} />
          </button>
          
          <div className="e-card-header-caption">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="e-card-header-title font-bold text-xl text-gray-900 mb-1">
                  {props.Title}
                </div>
                <div className="text-sm text-gray-600">
                  {props.Company}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="e-card-content" style={{ padding: '0 16px 16px 16px' }}>
          <div className="text-sm text-gray-600 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {props.Email}
          </div>
          <div className="text-sm text-gray-500 flex items-center mb-4">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {props.Phone}
          </div>
          
          {/* HR Bar */}
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEmailClick(props.Email, props.Title);
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flex: 1,
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.target as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCallClick(props.Phone, props.Title);
              }}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flex: 1,
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.target as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <IoDocumentTextOutline />
              Text
            </button>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
  { headerText: "📨 Order received from customer", keyField: "Order received from customer" },
  { headerText: "📤 Order submitted", keyField: "Order submitted" },
  { headerText: "🧾 Customer Invoice sent", keyField: "Customer Invoice sent" },
  { headerText: "💰 Payment Received", keyField: "Payment Received" },
  { headerText: "📄 Terms Given", keyField: "Terms Given" },
  { headerText: "🚚 Order Shipped", keyField: "Order Shipped" },
  { headerText: "🎁 Order delivered", keyField: "Order delivered" },
];



  return (
    <div style={{ 
      padding: '5px',
      backgroundColor: '#fff'
    }}>
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
    </div>
  );
}
