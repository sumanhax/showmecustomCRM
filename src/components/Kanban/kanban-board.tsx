

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

import axios from "axios";
import { useEffect, useState } from "react";

export function KanbanBoard() {
  const api = "https://n8nnode.bestworks.cloud/webhook/react-dashboard";
  const api2 = "https://n8nnode.bestworks.cloud/webhook/lead-status-update";

  const [leadData, setLeadData] = useState<any[]>([]);
  const [reload, setReload] = useState<any[]>([]);
  const [kanbanWidth, setkanbanWidth] = useState<number>(0);

  // Fetch lead data
  useEffect(() => {
    axios
      .get(api)
      .then((res: any) => {
        console.log("res", res.data);
        // Transform Airtable-style schema → Kanban format
        const transformed = res.data.map((lead: any) => ({
          Id: lead.id,
          Title: lead["Lead Name"],
          Status: lead["Lead Status"] || "New Lead",
          Summary:
            lead.Notes ||
            (lead["Lead Summary (AI)"]?.value ?? "No summary available"),
          Company: lead["Company Name"],
          Email: lead.Email,
          Phone: lead.Phone,
          Industry: lead.Industry,
          Assignee: lead.Rep?.[0] || "Unassigned",
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
  

const handleStatusUpdate = (leadInfo: { id: string; email: string; status: string }) => {
  console.log("trigger",leadInfo)
  axios.post(api2, { id: leadInfo.id, email: leadInfo.email, status: leadInfo.status })
    .then(() => {
      alert("Status updated successfully")
      setReload([1])
      console.log("Status updated successfully");
    })
    .catch((error) => {
      console.error("Error updating status", error);
    });
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
    email: cardData.Email,
    status: cardData.Status, // This is the new column after drop
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
        minWidth: '280px',
        width: '280px'
      }}>
        <div className="e-card-header" style={{ padding: '16px' }}>
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
            <div className="text-xs text-gray-500">
              {props.Industry}
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
          <div className="text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {props.Phone}
          </div>
        </div>
      </div>
    );
  };

  const columns = [
  { headerText: "🆕 Sample Submitted", keyField: "Sample Submitted" },
  { headerText: "🎨Sample Art Approved", keyField: "Sample Art Approved" },
  // { headerText: "👌Artwork Submitted", keyField: "Artwork Submitted" },
  // { headerText: "📦 Sample Submitted", keyField: "Sample Sent" },
  { headerText: "🚚 Sample Shipped", keyField: "Sample Shipped" },
  { headerText: "🎁 Sample Delivered", keyField: "Sample Delivered" },
  { headerText: "🔥 Warm Lead", keyField: "Warm Lead" },
  { headerText: "❄️ Cold Lead", keyField: "Cold Lead" },

];



  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#f8fafc'
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
    </div>
  );
}
