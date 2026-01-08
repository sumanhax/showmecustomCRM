import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { updatePartnerClassification } from "../../Reducer/AddSlice";
import Loader from "../../components/Loader";

const ManagePartner = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.add);
  const [leadData, setLeadData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = () => {
    setIsLoading(true);
    axios
      .get("https://n8n.bestworks.cloud/webhook/airtable-lead-fetch")
      .then((res) => {
        // Filter only leads with Orders and Orders length > 0
        const withOrders = (res.data || []).filter((lead) => Array.isArray(lead?.Orders) && lead.Orders.length > 0);
        setLeadData(withOrders);
      })
      .catch(() => {
        setLeadData([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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

  const columnDefs = useMemo(
    () => [
      {
        field: "Lead Name",
        headerName: "Lead Name",
        sortable: true,
        filter: true,
        width: 220,
      },
      {
        field: "Email",
        headerName: "Email",
        sortable: true,
        filter: true,
        width: 260,
      },
      {
        field: "Typeform Date",
        headerName: "Date",
        sortable: true,
        filter: true,
        width: 140,
        cellRenderer: (params) => {
          const val = params.value;
          if (!val) return "N/A";
          try {
            return new Date(val).toLocaleDateString();
          } catch {
            return val;
          }
        },
      },
      {
        headerName: "Action",
        field: "action",
        width: 220,
        cellRenderer: (params) => {
          const lead = params.data;
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
                minWidth: "160px",
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
    ], []
  );

  if (isLoading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading Partner Leads..." />
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
      <ToastContainer />
      <div className="h-full lg:h-screen">
        <div className="flex justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold">Partner</h2>
        </div>
        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
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
    </div>
  );
};

export default ManagePartner;


