import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { TbEyeShare } from "react-icons/tb";
import { kanbanBulkOrderDragnDrop, sendOfflineOrderEmail, updateFromAdminStages} from "../../Reducer/AddSlice";
import AddProjectModal from "../../pages/ManageLeads/AddProjectModal";
import axios from "axios";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";

// ─── Types ────────────────────────────────────────────────────────────────────
type StageColumn = {
  stage: { id: string | number; name: string; sort_order: number };
  orders: any[];
};

interface CardData {
  Id: string;
  Title: string;
  LeadName: string;
  Status: string;
  Summary: string;
  Company: string;
  Email: string;
  Phone: string;
  OrderType: string[];
  OrderAmount: number;
  LeadId: string;
  StageId: string | number;
  Source: "ONLINE" | "OFFLINE";
}

// ─── Drag state ───────────────────────────────────────────────────────────────
interface DragState {
  cardId: string;
  fromStatus: string;
  cardData: CardData;
}

// ─── Order type tag colors (doc2 exact) ──────────────────────────────────────
const getOrderTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    Screenprint: "#fce7f3",
    Embroidery:  "#fef3c7",
    Promo:       "#bbf7d0",
    Custom:      "#fef3c7",
    Bulk:        "#e0e7ff",
    Sample:      "#fce7f3",
    Headwear:    "#e0e7ff",
    HEADWEAR:    "#e0e7ff",
  };
  return colors[type] || "#f3f4f6";
};

// ═══════════════════════════════════════════════════════════════════════════════
export function KanbanBoardBulkOrder({
  onRefresh,
  columnsData = [],
  source,
}: {
  onRefresh?: () => void;
  columnsData: StageColumn[];
  source: "ONLINE" | "OFFLINE";
}) {
  const navigate      = useNavigate();
  const dispatch: any = useDispatch();

  const [leadData,     setLeadData]     = useState<CardData[]>([]);
  const [dragging,     setDragging]     = useState<DragState | null>(null);
  const [dragOverCol,  setDragOverCol]  = useState<string | null>(null);
  const [dragOverCard, setDragOverCard] = useState<string | null>(null);
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [emailModal, setEmailModal] = useState<{ isOpen: boolean; leadEmail: string; leadName: string }>({ isOpen: false, leadEmail: "", leadName: "" });
  const [emailForm,   setEmailForm]   = useState({ to: "", subject: "", message: "" });
  const [callModal,   setCallModal]   = useState<{ isOpen: boolean; phoneNumber: string; leadName: string }>({ isOpen: false, phoneNumber: "", leadName: "" });
  const [callForm,    setCallForm]    = useState({ phone: "", message: "" });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isCallSending,  setIsCallSending]  = useState(false);

  // ─── Stage change confirmation modal ──────────────────────────────────────
  interface ConfirmMove {
    card: CardData;
    toStatus: string;
    toStageName: string;
    fromStageName: string;
    isForward: boolean;
  }
  const [confirmMove, setConfirmMove] = useState<ConfirmMove | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimer    = useRef<number | null>(null);
  const ghostRef           = useRef<HTMLDivElement | null>(null);
  const dragXRef           = useRef<number>(0);

  // ─── Build columns ──────────────────────────────────────────────────────────
  const columns = useMemo(() => {
    if (!Array.isArray(columnsData)) return [];
    return [...columnsData]
      .sort((a, b) => (a?.stage?.sort_order || 0) - (b?.stage?.sort_order || 0))
      .map((col) => ({
        headerText: col?.stage?.name || "",
        keyField:   col?.stage?.name || "",
        stageId:    col?.stage?.id,
      }));
  }, [columnsData]);

  // ─── Build card data ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!Array.isArray(columnsData)) { setLeadData([]); return; }
    const cards: CardData[] = [];
    columnsData.forEach((col) => {
      const stageName = col?.stage?.name;
      const stageId   = col?.stage?.id;
      col?.orders?.forEach((order) => {
        if (source === "ONLINE") {
          const c = order.customer || {};
          cards.push({
            Id: String(order.id), Title: "Order", LeadName: c.name || "Unknown",
            Status: stageName, Summary: `Status: ${order.status} | Payment: ${order.payment_status} | Created: ${order.created_at}`,
            Company: c.company_name || "", Email: c.email || "", Phone: c.phone || "",
            OrderType: [], OrderAmount: Number(order.order_amount || 0),
            LeadId: String(c.id), StageId: stageId, Source: "ONLINE",
          });
        } else {
          const lead = order.lead || {};
          cards.push({
            Id: String(order.id), Title: "Order", LeadName: lead.name || "Unknown",
            Status: stageName, Summary: `Status: ${order.order_status} | Origin: ${order.order_origin} | Start: ${order.start_date}`,
            Company: lead.company_name || "", Email: lead.email || "", Phone: lead.phone || "",
            OrderType: order.order_types || [], OrderAmount: Number(order.order_amount || 0),
            LeadId: String(order.lead_id), StageId: stageId, Source: "OFFLINE",
          });
        }
      });
    });
    setLeadData(cards);
  }, [columnsData, source]);

  // ─── Status update (Optimistic UI) ──────────────────────────────────────────
  // const executeStatusUpdate = useCallback(async (card: CardData, newStatus: string) => {
  //   const targetCol = columns.find((c) => c.keyField === newStatus);
  //   if (!targetCol?.stageId) return;
  //   const prevStatus  = card.Status;
  //   const prevStageId = card.StageId;

  //   // Optimistic update — move card immediately
  //   setLeadData((prev) => prev.map((c) => c.Id === card.Id ? { ...c, Status: newStatus, StageId: targetCol.stageId } : c));

  //   try {
  //     await dispatch(kanbanBulkOrderDragnDrop({ id: card.Id, order_stage_id: targetCol.stageId, source: card.Source })).unwrap();
  //     toast.success("Stage updated successfully!");
  //     onRefresh?.();
  //   } catch (error: any) {
  //   setLeadData((prev) => prev.map((c) =>
  //     c.Id === card.Id ? { ...c, Status: prevStatus, StageId: prevStageId } : c
  //   ));

  //   const errMsg =
  //     typeof error === "string"
  //       ? error
  //       : error?.message || "Failed to update status. Please try again.";

  //   toast.error(
  //     <div>
  //       <p style={{ fontWeight: 700, marginBottom: 4 }}>Stage Change Failed</p>
  //       <p style={{ fontSize: 13, lineHeight: 1.5 }}>{errMsg}</p>
  //     </div>,
  //     { autoClose: 6000 }
  //   );
  // }
  // }, [columns, dispatch, onRefresh]);

  const executeStatusUpdate = useCallback(async (card: CardData, newStatus: string) => {
    const targetCol = columns.find((c) => c.keyField === newStatus);
    if (!targetCol?.stageId) return;
    const prevStatus  = card.Status;
    const prevStageId = card.StageId;

    // Optimistic update
    setLeadData((prev) => prev.map((c) => c.Id === card.Id ? { ...c, Status: newStatus, StageId: targetCol.stageId } : c));

    try {
      const stageRes = await dispatch(kanbanBulkOrderDragnDrop({ 
        id: card.Id, 
        order_stage_id: targetCol.stageId, 
        source: card.Source 
      })).unwrap();

      // ── Webhook call after successful stage change ──
   if (stageRes) {
       const orderData = stageRes?.data || stageRes;

const webhookPayload = {
  customer: {
    name: card.LeadName,
    email: card.Email,
    phone: card.Phone,
    company_name: card.Company,
  },
  order_id: orderData?.order_id ?? card.Id,
  source: orderData?.source ?? card.Source,
  old_order_stage_id: orderData?.old_order_stage_id,
  new_order_stage_id: orderData?.new_order_stage_id,
  history_id: orderData?.history_id,
  new_stage_name: newStatus,
  old_stage_name: card.Status,
};

        // try {
        //   await dispatch(updateFromAdminStages(webhookPayload)).unwrap();
        // } catch (webhookErr) {
        //   console.error("Webhook failed (non-blocking):", webhookErr);
        // }

        if (card.Source === "ONLINE") {
          try {
            await dispatch(updateFromAdminStages(webhookPayload)).unwrap();
          } catch (webhookErr) {
            console.error("Webhook failed (non-blocking):", webhookErr);
          }
        } else {
          try {
            await dispatch(sendOfflineOrderEmail(webhookPayload)).unwrap();
          } catch (emailErr) {
            console.error("Offline order email failed (non-blocking):", emailErr);
          }
        }
      }

      toast.success("Stage updated successfully!");
      onRefresh?.();
    } catch (error: any) {
      // Rollback on failure
      setLeadData((prev) => prev.map((c) =>
        c.Id === card.Id ? { ...c, Status: prevStatus, StageId: prevStageId } : c
      ));

      const errMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to update status. Please try again.";

      toast.error(
        <div>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Stage Change Failed</p>
          <p style={{ fontSize: 13, lineHeight: 1.5 }}>{errMsg}</p>
        </div>,
        { autoClose: 6000 }
      );
    }
  }, [columns, dispatch, onRefresh]);

  // ─── Show confirmation popup before move ────────────────────────────────────
  const handleStatusUpdate = useCallback((card: CardData, newStatus: string) => {
    const fromCol = columns.find((c) => c.keyField === card.Status);
    const toCol   = columns.find((c) => c.keyField === newStatus);
    if (!fromCol || !toCol) return;

    const fromOrder = fromCol.stageId;
    const toOrder   = toCol.stageId;

    // Find sort_order from columnsData
    const fromSort = columnsData.find((c) => String(c.stage.id) === String(fromOrder))?.stage.sort_order ?? 0;
    const toSort   = columnsData.find((c) => String(c.stage.id) === String(toOrder))?.stage.sort_order ?? 0;

    const isForward = toSort > fromSort;

    // Show confirmation modal regardless of direction (backward will show stronger warning)
    setConfirmMove({
      card,
      toStatus: newStatus,
      toStageName: toCol.headerText,
      fromStageName: fromCol.headerText,
      isForward,
    });
  }, [columns, columnsData]);

  // ─── Auto-scroll (requestAnimationFrame loop, triggered by dragover) ─────────
  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      cancelAnimationFrame(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  const startAutoScrollLoop = useCallback(() => {
    if (autoScrollTimer.current) return;
    const ZONE  = 120; // 120px edge zone
    const SPEED = 14;

    const tick = () => {
      const el = scrollContainerRef.current;
      if (!el) { autoScrollTimer.current = null; return; }
      const rect = el.getBoundingClientRect();
      const x    = dragXRef.current - rect.left;

      if (x < ZONE && x > 0) {
        el.scrollLeft -= Math.round(SPEED * (1 - x / ZONE));
      } else if (x > rect.width - ZONE && x < rect.width) {
        el.scrollLeft += Math.round(SPEED * (1 - (rect.width - x) / ZONE));
      }
      autoScrollTimer.current = requestAnimationFrame(tick);
    };
    autoScrollTimer.current = requestAnimationFrame(tick);
  }, []);

  // Track mouse X during drag via dragover (mousemove doesn't fire during HTML5 drag)
  const handleBoardDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    dragXRef.current = e.clientX;
  }, []);

  useEffect(() => () => stopAutoScroll(), [stopAutoScroll]);

  // ─── Drag handlers ──────────────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, card: CardData) => {
    setDragging({ cardId: card.Id, fromStatus: card.Status, cardData: card });
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("div");
    ghost.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    ghostRef.current = ghost;
    startAutoScrollLoop();
  };

  const onDragEnd = useCallback(() => {
    setDragging(null);
    setDragOverCol(null);
    setDragOverCard(null);
    stopAutoScroll();
    if (ghostRef.current) { document.body.removeChild(ghostRef.current); ghostRef.current = null; }
  }, [stopAutoScroll]);

  const onColDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colKey);
  };

  const onColDrop = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    if (!dragging || dragging.fromStatus === colKey) { onDragEnd(); return; }

    const fromCol = columns.find((c) => c.keyField === dragging.fromStatus);
    const toCol   = columns.find((c) => c.keyField === colKey);
    if (fromCol && toCol) {
      const fromSort = columnsData.find((c) => String(c.stage.id) === String(fromCol.stageId))?.stage.sort_order ?? 0;
      const toSort   = columnsData.find((c) => String(c.stage.id) === String(toCol.stageId))?.stage.sort_order ?? 0;
      if (toSort < fromSort) {
        toast.error("Moving back to a previous stage is not permitted.");
        onDragEnd();
        return;
      }
    }

    handleStatusUpdate(dragging.cardData, colKey);
    onDragEnd();
  };

  const onCardDragOver = (e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCard(cardId);
  };

  const onCardDrop = (e: React.DragEvent, targetCard: CardData) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) { onDragEnd(); return; }
    if (dragging.fromStatus !== targetCard.Status) {
      const fromCol = columns.find((c) => c.keyField === dragging.fromStatus);
      const toCol   = columns.find((c) => c.keyField === targetCard.Status);
      if (fromCol && toCol) {
        const fromSort = columnsData.find((c) => String(c.stage.id) === String(fromCol.stageId))?.stage.sort_order ?? 0;
        const toSort   = columnsData.find((c) => String(c.stage.id) === String(toCol.stageId))?.stage.sort_order ?? 0;
        if (toSort < fromSort) {
          toast.error("Moving back to a previous stage is not permitted.");
          onDragEnd();
          return;
        }
      }
      handleStatusUpdate(dragging.cardData, targetCard.Status);
    }
    onDragEnd();
  };

  // ─── Email ──────────────────────────────────────────────────────────────────
  const handleEmailClick = (leadEmail: string, leadName: string) => {
    setEmailModal({ isOpen: true, leadEmail, leadName });
    setEmailForm({ to: leadEmail, subject: `Follow up - ${leadName}`, message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,` });
  };

  const handleEmailSend = () => {
    if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) { toast.error("Please fill in all fields."); return; }
    setIsEmailSending(true);
    axios.post("https://n8n.bestworks.cloud/webhook/email-sender", { reciepent: emailForm.to, sender: "teams@showmecustomapparel", subject: emailForm.subject, replyBody: emailForm.message })
      .then((res) => { if (res.status === 200) { toast.success("Email Sent Successfully!"); setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); } else toast.error("Failed to send email. Please try again."); })
      .catch(() => toast.error("An error occurred while sending the email."))
      .finally(() => setIsEmailSending(false));
  };

  // ─── Call ───────────────────────────────────────────────────────────────────
  const handleCallClick = (phoneNumber: string, leadName: string) => {
    setCallModal({ isOpen: true, phoneNumber, leadName });
    setCallForm({ phone: phoneNumber, message: `Hi ${leadName},\n\nI hope this call finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,` });
  };

  const handleCallSend = () => {
    if (!callForm.phone.trim() || !callForm.message.trim()) { toast.error("Please fill in all fields."); return; }
    setIsCallSending(true);
    setTimeout(() => { toast.success("Call message sent successfully!"); setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); setIsCallSending(false); }, 2000);
  };

  // ─── Cards per column ────────────────────────────────────────────────────────
  const cardsByStatus = useMemo(() => {
    const map: Record<string, CardData[]> = {};
    columns.forEach((c) => { map[c.keyField] = []; });
    leadData.forEach((card) => { if (map[card.Status] !== undefined) map[card.Status].push(card); });
    return map;
  }, [leadData, columns]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "5px", backgroundColor: "#fff" }}>
      <style>{`
        @keyframes kb-pop-in { from { opacity:0; transform:scale(0.97) translateY(4px); } to { opacity:1; transform:none; } }
        .kb-scroll::-webkit-scrollbar { height: 8px; }
        .kb-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .kb-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .kb-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .kb-kanban-col {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          margin: 0 12px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          min-width: 320px !important;
          width: 320px !important;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
          transition: box-shadow 0.15s, background 0.15s;
        }
        .kb-kanban-col.drop-active {
          box-shadow: 0 0 0 2.5px #f20c32, 0 2px 4px rgba(0,0,0,0.1) !important;
          background: #fff5f5 !important;
        }
        .kb-col-header {
          background: #f20c32 !important;
          color: white !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          padding: 16px !important;
          border-radius: 8px 8px 0 0 !important;
          text-align: center !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .kb-col-body {
          padding: 16px !important;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 80px;
        }
        .kb-col-body::-webkit-scrollbar { width: 5px; }
        .kb-col-body::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .kb-col-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .kb-col-body::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .kb-card-wrap {
          animation: kb-pop-in 0.18s ease-out;
          cursor: grab;
        }
        .kb-card-wrap:active { cursor: grabbing; }
        .kb-card-wrap:hover .kb-card-inner {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) !important;
        }
        .kb-card-wrap.is-dragging .kb-card-inner {
          transform: rotate(2deg) !important;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
          opacity: 0.45;
        }
        .kb-card-wrap.drag-over .kb-card-inner {
          outline: 2px dashed #f20c32;
          outline-offset: 2px;
        }
        .kb-drop-placeholder {
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 13px;
          font-style: italic;
          transition: background 0.15s, border-color 0.15s;
        }
        .kb-drop-placeholder.active {
          border-color: #f20c32;
          background: rgba(242,12,50,0.04);
          color: #f20c32;
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 15px", backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0", marginBottom: "10px",
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
          Bulk Orders Kanban Board
        </h2>

        {/* Right side: Arrow buttons + Add Project */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Scroll Left */}
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
              }
            }}
            title="Scroll Left"
            style={{
              width: "36px", height: "36px", borderRadius: "8px",
              border: "1px solid #e2e8f0", background: "white", color: "#374151",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: "700", transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
            onMouseOver={(e) => { (e.currentTarget).style.background = "#f1f5f9"; (e.currentTarget).style.borderColor = "#cbd5e1"; }}
            onMouseOut={(e)  => { (e.currentTarget).style.background = "white";    (e.currentTarget).style.borderColor = "#e2e8f0"; }}
          >
            ◀
          </button>

          {/* Scroll Right */}
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
              }
            }}
            title="Scroll Right"
            style={{
              width: "36px", height: "36px", borderRadius: "8px",
              border: "1px solid #e2e8f0", background: "white", color: "#374151",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: "700", transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
            onMouseOver={(e) => { (e.currentTarget).style.background = "#f1f5f9"; (e.currentTarget).style.borderColor = "#cbd5e1"; }}
            onMouseOut={(e)  => { (e.currentTarget).style.background = "white";    (e.currentTarget).style.borderColor = "#e2e8f0"; }}
          >
            ▶
          </button>

          {/* Add Project */}
          <button
            onClick={() => setOpenAddProjectModal(true)}
            style={{
              backgroundColor: "#f20c32", color: "white", border: "none", borderRadius: "8px",
              padding: "10px 16px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.2s ease-in-out", boxShadow: "0 2px 4px rgba(139,92,246,0.2)",
            }}
            onMouseOver={(e) => { (e.currentTarget).style.transform = "translateY(-1px)"; (e.currentTarget).style.boxShadow = "0 4px 8px rgba(139,92,246,0.3)"; }}
            onMouseOut={(e)  => { (e.currentTarget).style.transform = "translateY(0)";    (e.currentTarget).style.boxShadow = "0 2px 4px rgba(139,92,246,0.2)"; }}
          >
            <FaPlus size={14} /> Add Project
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div
        ref={scrollContainerRef}
        className="kb-scroll"
        onDragOver={handleBoardDragOver}
        style={{
          overflowX: "auto", width: "100%",
          whiteSpace: "nowrap", padding: "10px 0",
          display: "flex", alignItems: "stretch",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {columns.map((col) => {
          const cards      = cardsByStatus[col.keyField] || [];
          const isDropCol  = dragOverCol === col.keyField;

          return (
            <div
              key={col.keyField}
              className={`kb-kanban-col${isDropCol ? " drop-active" : ""}`}
              onDragOver={(e) => onColDragOver(e, col.keyField)}
              onDragLeave={(e) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setDragOverCol(null); }}
              onDrop={(e) => onColDrop(e, col.keyField)}
            >
              {/* Column Header */}
              <div className="kb-col-header">
                <span style={{ color: "white", fontWeight: 700, fontSize: 14, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                  {col.headerText}
                </span>
                <span style={{ background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 12, padding: "4px 8px", fontWeight: 600, fontSize: 13, marginLeft: 8 }}>
                  {cards.length}
                </span>
              </div>

              {/* Column Body */}
              <div className="kb-col-body">
                {cards.length === 0 ? (
                  <div className={`kb-drop-placeholder${isDropCol ? " active" : ""}`}>
                    Drop here
                  </div>
                ) : (
                  cards.map((card) => (
                    <div
                      key={card.Id}
                      className={`kb-card-wrap${dragging?.cardId === card.Id ? " is-dragging" : ""}${dragOverCard === card.Id ? " drag-over" : ""}`}
                      draggable
                      onDragStart={(e) => onDragStart(e, card)}
                      onDragEnd={onDragEnd}
                      onDragOver={(e) => onCardDragOver(e, card.Id)}
                      onDrop={(e) => onCardDrop(e, card)}
                    >
                      {/* ── Card Inner (exact doc2 style) ── */}
                      <div
                        className="kb-card-inner"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                          transition: "all 0.2s ease-in-out",
                          // minWidth: "240px",
                          // width: "240px",
                          overflow: "hidden",
                        }}
                      >
                        {/* Header */}
                        <div style={{ padding: "10px 12px 8px 12px", position: "relative", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", borderBottom: "1px solid #e2e8f0" }}>
                          {/* View button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/order/${card.LeadId}`, { state: { openOrderId: card.Id } }); }}
                            style={{ position: "absolute", top: "8px", right: "8px", width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.12)", transition: "all 0.2s ease-in-out", zIndex: 10 }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)"; }}
                            onMouseOut={(e)  => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                            title="View"
                          >
                            <TbEyeShare size={14} />
                          </button>

                          {/* Lead info */}
                          <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", marginRight: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.08)", flexShrink: 0 }}>
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "15px", fontWeight: "700", color: "#1f2937", marginBottom: "2px", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {card.LeadName || "Unknown Lead"}
                              </div>
                              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500, lineHeight: 1.2 }}>
                                {card.Company || "No Company"}
                              </div>
                            </div>
                          </div>

                          {/* Order / Amount pill */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "6px 8px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                            <div>
                              <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, marginBottom: "1px" }}>Order</div>
                              <div style={{ fontSize: "12px", color: "#1f2937", fontWeight: 600, lineHeight: 1.2 }}>{card.Title || "N/A"}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, marginBottom: "1px" }}>Amount</div>
                              <div style={{ fontSize: "13px", color: "#059669", fontWeight: 700, lineHeight: 1.2 }}>${card.OrderAmount ? card.OrderAmount.toLocaleString() : "0"}</div>
                            </div>
                          </div>
                        </div>

                        {/* Contact */}
                        <div style={{ padding: "8px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px", padding: "2px 0" }}>
                            <svg style={{ width: "13px", height: "13px", marginRight: "5px", color: "#6b7280", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {card.Email || "No email provided"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", marginBottom: "6px", padding: "2px 0" }}>
                            <svg style={{ width: "13px", height: "13px", marginRight: "5px", color: "#6b7280", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500, lineHeight: 1.2 }}>
                              {card.Phone || "No phone provided"}
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div style={{ display: "flex", gap: "6px", marginBottom: card.OrderType?.length ? "8px" : "0" }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEmailClick(card.Email, card.LeadName); }}
                              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", flex: 1, transition: "all 0.2s ease-in-out" }}
                              onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                              onMouseOut={(e)  => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                            >
                              Email
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCallClick(card.Phone, card.LeadName); }}
                              style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", border: "none", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", flex: 1, transition: "all 0.2s ease-in-out" }}
                              onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                              onMouseOut={(e)  => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                            >
                              Text
                            </button>
                          </div>

                          {/* Order type tags */}
                          {card.OrderType && card.OrderType.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingTop: "4px", borderTop: "1px solid #e5e7eb" }}>
                              {card.OrderType.map((type: string, index: number) => (
                                <span key={index} style={{ background: getOrderTypeColor(type), color: "#374151", padding: "3px 7px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, display: "inline-block", border: "1px solid rgba(0,0,0,0.04)", lineHeight: 1.1 }}>
                                  {type}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* ── End Card Inner ── */}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Email Modal ── */}
      {emailModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", width: "90%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => { setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); }} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Send Email</h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>Send an email to {emailModal.leadName}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[{ label: "To", type: "email", val: emailForm.to, key: "to" }, { label: "Subject", type: "text", val: emailForm.subject, key: "subject" }].map(({ label, type, val, key }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>{label}</label>
                  <input type={type} value={val} onChange={(e) => setEmailForm({ ...emailForm, [key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Message</label>
                <textarea value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} rows={6} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={() => { setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); }} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#374151", background: "white", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleEmailSend} disabled={isEmailSending} style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "white", background: isEmailSending ? "linear-gradient(135deg,#9ca3af,#6b7280)" : "linear-gradient(135deg,#667eea,#764ba2)", cursor: isEmailSending ? "not-allowed" : "pointer", opacity: isEmailSending ? 0.7 : 1 }}>
                  {isEmailSending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Call/Text Modal ── */}
      {callModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", width: "90%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => { setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); }} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Text Message</h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>Send a text message to {callModal.leadName}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Phone Number</label>
                <input type="tel" value={callForm.phone} onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Message</label>
                <textarea value={callForm.message} onChange={(e) => setCallForm({ ...callForm, message: e.target.value })} rows={6} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={() => { setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); }} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#374151", background: "white", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleCallSend} disabled={isCallSending} style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "white", background: isCallSending ? "linear-gradient(135deg,#9ca3af,#6b7280)" : "linear-gradient(135deg,#f093fb,#f5576c)", cursor: isCallSending ? "not-allowed" : "pointer", opacity: isCallSending ? 0.7 : 1 }}>
                  {isCallSending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stage Change Confirmation Modal ── */}
      {confirmMove && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000,
          backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "16px", width: "100%", maxWidth: "480px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.18)", overflow: "hidden",
            animation: "kb-pop-in 0.2s ease-out",
          }}>
            {/* Modal top warning bar */}
            <div style={{
              background: "linear-gradient(135deg, #f20c32 0%, #c20028 100%)",
              padding: "18px 24px", display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "16px" }}>Confirm Stage Change</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", marginTop: "2px" }}>
                  This action cannot be undone once confirmed
                </div>
              </div>
            </div>

            {/* Card Preview */}
            <div style={{ padding: "20px 24px 0" }}>
              <div style={{
                background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: "10px", padding: "14px 16px", marginBottom: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                  }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>{confirmMove.card.LeadName}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{confirmMove.card.Company || "No Company"}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>Order Amount</div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#059669" }}>
                      ${confirmMove.card.OrderAmount?.toLocaleString() || "0"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#6b7280"}}>
                  <span className="mt-[2px]"><MdOutlineEmail /></span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{confirmMove.card.Email || "—"}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
                  <span><IoCallOutline /></span><span>{confirmMove.card.Phone || "—"}</span>
                </div>
              </div>

              {/* Stage Arrow */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{
                  flex: 1, background: "#f1f5f9", borderRadius: "8px",
                  padding: "8px 12px", fontSize: "12px", fontWeight: 600, color: "#64748b",
                  textAlign: "center", border: "1px solid #e2e8f0",
                }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>From</div>
                  {confirmMove.fromStageName}
                </div>
                <div style={{ fontSize: "20px", color: "#f20c32", flexShrink: 0 }}>→</div>
                <div style={{
                  flex: 1, background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                  borderRadius: "8px", padding: "8px 12px", fontSize: "12px",
                  fontWeight: 700, color: "#dc2626", textAlign: "center",
                  border: "1px solid #fecaca",
                }}>
                  <div style={{ fontSize: "10px", color: "#f87171", marginBottom: "2px" }}>To</div>
                  {confirmMove.toStageName}
                </div>
              </div>

              {/* Warning text */}
              <div style={{
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: "8px", padding: "10px 14px", marginBottom: "20px",
                display: "flex", gap: "8px", alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "12px", color: "#92400e", lineHeight: 1.5 }}>
                  Once moved to <strong>{confirmMove.toStageName}</strong>, the order cannot be returned to a previous stage.
                  The customer will be notified of this stage change.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              padding: "0 24px 24px",
              display: "flex", gap: "10px",
            }}>
              <button
                onClick={() => setConfirmMove(null)}
                style={{
                  flex: 1, padding: "12px", border: "1px solid #e2e8f0",
                  borderRadius: "8px", fontSize: "14px", fontWeight: 600,
                  color: "#374151", background: "white", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => { (e.currentTarget).style.background = "#f9fafb"; }}
                onMouseOut={(e)  => { (e.currentTarget).style.background = "white"; }}
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmMove) {
                    executeStatusUpdate(confirmMove.card, confirmMove.toStatus);
                    setConfirmMove(null);
                  }
                }}
                style={{
                  flex: 1, padding: "12px", border: "none",
                  borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                  color: "white",
                  background: "linear-gradient(135deg, #f20c32 0%, #c20028 100%)",
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(242,12,50,0.3)",
                }}
                onMouseOver={(e) => { (e.currentTarget).style.opacity = "0.88"; }}
                onMouseOut={(e)  => { (e.currentTarget).style.opacity = "1"; }}
              >
                Yes, Move to Next Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {openAddProjectModal && (
        <AddProjectModal
          isOpen={openAddProjectModal}
          onClose={() => setOpenAddProjectModal(false)}
          onProjectAdded={() => { setOpenAddProjectModal(false); onRefresh?.(); }}
        />
      )}
    </div>
  );
}

// import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { FaPlus } from "react-icons/fa";
// import { TbEyeShare } from "react-icons/tb";
// import { kanbanBulkOrderDragnDrop } from "../../Reducer/AddSlice";
// import AddProjectModal from "../../pages/ManageLeads/AddProjectModal";
// import axios from "axios";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type StageColumn = {
//   stage: { id: string | number; name: string; sort_order: number };
//   orders: any[];
// };

// interface CardData {
//   Id: string;
//   Title: string;
//   LeadName: string;
//   Status: string;
//   Summary: string;
//   Company: string;
//   Email: string;
//   Phone: string;
//   OrderType: string[];
//   OrderAmount: number;
//   LeadId: string;
//   StageId: string | number;
//   Source: "ONLINE" | "OFFLINE";
// }

// // ─── Drag state ───────────────────────────────────────────────────────────────
// interface DragState {
//   cardId: string;
//   fromStatus: string;
//   cardData: CardData;
// }

// // ─── Order type tag colors (doc2 exact) ──────────────────────────────────────
// const getOrderTypeColor = (type: string): string => {
//   const colors: { [key: string]: string } = {
//     Screenprint: "#fce7f3",
//     Embroidery:  "#fef3c7",
//     Promo:       "#bbf7d0",
//     Custom:      "#fef3c7",
//     Bulk:        "#e0e7ff",
//     Sample:      "#fce7f3",
//     Headwear:    "#e0e7ff",
//     HEADWEAR:    "#e0e7ff",
//   };
//   return colors[type] || "#f3f4f6";
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// export function KanbanBoardBulkOrder({
//   onRefresh,
//   columnsData = [],
//   source,
// }: {
//   onRefresh?: () => void;
//   columnsData: StageColumn[];
//   source: "ONLINE" | "OFFLINE";
// }) {
//   const navigate      = useNavigate();
//   const dispatch: any = useDispatch();

//   const [leadData,     setLeadData]     = useState<CardData[]>([]);
//   const [dragging,     setDragging]     = useState<DragState | null>(null);
//   const [dragOverCol,  setDragOverCol]  = useState<string | null>(null);
//   const [dragOverCard, setDragOverCard] = useState<string | null>(null);
//   const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
//   const [emailModal, setEmailModal] = useState<{ isOpen: boolean; leadEmail: string; leadName: string }>({ isOpen: false, leadEmail: "", leadName: "" });
//   const [emailForm,   setEmailForm]   = useState({ to: "", subject: "", message: "" });
//   const [callModal,   setCallModal]   = useState<{ isOpen: boolean; phoneNumber: string; leadName: string }>({ isOpen: false, phoneNumber: "", leadName: "" });
//   const [callForm,    setCallForm]    = useState({ phone: "", message: "" });
//   const [isEmailSending, setIsEmailSending] = useState(false);
//   const [isCallSending,  setIsCallSending]  = useState(false);

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const autoScrollTimer    = useRef<number | null>(null);
//   const ghostRef           = useRef<HTMLDivElement | null>(null);
//   const dragXRef           = useRef<number>(0);

//   // ─── Build columns ──────────────────────────────────────────────────────────
//   const columns = useMemo(() => {
//     if (!Array.isArray(columnsData)) return [];
//     return [...columnsData]
//       .sort((a, b) => (a?.stage?.sort_order || 0) - (b?.stage?.sort_order || 0))
//       .map((col) => ({
//         headerText: col?.stage?.name || "",
//         keyField:   col?.stage?.name || "",
//         stageId:    col?.stage?.id,
//       }));
//   }, [columnsData]);

//   // ─── Build card data ────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!Array.isArray(columnsData)) { setLeadData([]); return; }
//     const cards: CardData[] = [];
//     columnsData.forEach((col) => {
//       const stageName = col?.stage?.name;
//       const stageId   = col?.stage?.id;
//       col?.orders?.forEach((order) => {
//         if (source === "ONLINE") {
//           const c = order.customer || {};
//           cards.push({
//             Id: String(order.id), Title: "Order", LeadName: c.name || "Unknown",
//             Status: stageName, Summary: `Status: ${order.status} | Payment: ${order.payment_status} | Created: ${order.created_at}`,
//             Company: c.company_name || "", Email: c.email || "", Phone: c.phone || "",
//             OrderType: [], OrderAmount: Number(order.order_amount || 0),
//             LeadId: String(c.id), StageId: stageId, Source: "ONLINE",
//           });
//         } else {
//           const lead = order.lead || {};
//           cards.push({
//             Id: String(order.id), Title: "Order", LeadName: lead.name || "Unknown",
//             Status: stageName, Summary: `Status: ${order.order_status} | Origin: ${order.order_origin} | Start: ${order.start_date}`,
//             Company: lead.company_name || "", Email: lead.email || "", Phone: lead.phone || "",
//             OrderType: order.order_types || [], OrderAmount: Number(order.order_amount || 0),
//             LeadId: String(order.lead_id), StageId: stageId, Source: "OFFLINE",
//           });
//         }
//       });
//     });
//     setLeadData(cards);
//   }, [columnsData, source]);

//   // ─── Status update (Optimistic UI) ──────────────────────────────────────────
//   const handleStatusUpdate = useCallback(async (card: CardData, newStatus: string) => {
//     const targetCol = columns.find((c) => c.keyField === newStatus);
//     if (!targetCol?.stageId) return;
//     const prevStatus  = card.Status;
//     const prevStageId = card.StageId;

//     // Optimistic update — move card immediately
//     setLeadData((prev) => prev.map((c) => c.Id === card.Id ? { ...c, Status: newStatus, StageId: targetCol.stageId } : c));

//     try {
//       await dispatch(kanbanBulkOrderDragnDrop({ id: card.Id, order_stage_id: targetCol.stageId, source: card.Source })).unwrap();
//       toast.success("Status updated successfully");
//       onRefresh?.();
//     } catch {
//       // Rollback on failure
//       setLeadData((prev) => prev.map((c) => c.Id === card.Id ? { ...c, Status: prevStatus, StageId: prevStageId } : c));
//       toast.error("Failed to update status. Please try again.");
//     }
//   }, [columns, dispatch, onRefresh]);

//   // ─── Auto-scroll (requestAnimationFrame loop, triggered by dragover) ─────────
//   const stopAutoScroll = useCallback(() => {
//     if (autoScrollTimer.current) {
//       cancelAnimationFrame(autoScrollTimer.current);
//       autoScrollTimer.current = null;
//     }
//   }, []);

//   const startAutoScrollLoop = useCallback(() => {
//     if (autoScrollTimer.current) return;
//     const ZONE  = 120; // 120px edge zone
//     const SPEED = 14;

//     const tick = () => {
//       const el = scrollContainerRef.current;
//       if (!el) { autoScrollTimer.current = null; return; }
//       const rect = el.getBoundingClientRect();
//       const x    = dragXRef.current - rect.left;

//       if (x < ZONE && x > 0) {
//         el.scrollLeft -= Math.round(SPEED * (1 - x / ZONE));
//       } else if (x > rect.width - ZONE && x < rect.width) {
//         el.scrollLeft += Math.round(SPEED * (1 - (rect.width - x) / ZONE));
//       }
//       autoScrollTimer.current = requestAnimationFrame(tick);
//     };
//     autoScrollTimer.current = requestAnimationFrame(tick);
//   }, []);

//   // Track mouse X during drag via dragover (mousemove doesn't fire during HTML5 drag)
//   const handleBoardDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     dragXRef.current = e.clientX;
//   }, []);

//   useEffect(() => () => stopAutoScroll(), [stopAutoScroll]);

//   // ─── Drag handlers ──────────────────────────────────────────────────────────
//   const onDragStart = (e: React.DragEvent, card: CardData) => {
//     setDragging({ cardId: card.Id, fromStatus: card.Status, cardData: card });
//     e.dataTransfer.effectAllowed = "move";
//     const ghost = document.createElement("div");
//     ghost.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;";
//     document.body.appendChild(ghost);
//     e.dataTransfer.setDragImage(ghost, 0, 0);
//     ghostRef.current = ghost;
//     startAutoScrollLoop();
//   };

//   const onDragEnd = useCallback(() => {
//     setDragging(null);
//     setDragOverCol(null);
//     setDragOverCard(null);
//     stopAutoScroll();
//     if (ghostRef.current) { document.body.removeChild(ghostRef.current); ghostRef.current = null; }
//   }, [stopAutoScroll]);

//   const onColDragOver = (e: React.DragEvent, colKey: string) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//     setDragOverCol(colKey);
//   };

//   const onColDrop = (e: React.DragEvent, colKey: string) => {
//     e.preventDefault();
//     if (!dragging || dragging.fromStatus === colKey) { onDragEnd(); return; }
//     handleStatusUpdate(dragging.cardData, colKey);
//     onDragEnd();
//   };

//   const onCardDragOver = (e: React.DragEvent, cardId: string) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragOverCard(cardId);
//   };

//   const onCardDrop = (e: React.DragEvent, targetCard: CardData) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!dragging) { onDragEnd(); return; }
//     if (dragging.fromStatus !== targetCard.Status) handleStatusUpdate(dragging.cardData, targetCard.Status);
//     onDragEnd();
//   };

//   // ─── Email ──────────────────────────────────────────────────────────────────
//   const handleEmailClick = (leadEmail: string, leadName: string) => {
//     setEmailModal({ isOpen: true, leadEmail, leadName });
//     setEmailForm({ to: leadEmail, subject: `Follow up - ${leadName}`, message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,` });
//   };

//   const handleEmailSend = () => {
//     if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) { toast.error("Please fill in all fields."); return; }
//     setIsEmailSending(true);
//     axios.post("https://n8n.bestworks.cloud/webhook/email-sender", { reciepent: emailForm.to, sender: "teams@showmecustomapparel", subject: emailForm.subject, replyBody: emailForm.message })
//       .then((res) => { if (res.status === 200) { toast.success("Email Sent Successfully!"); setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); } else toast.error("Failed to send email. Please try again."); })
//       .catch(() => toast.error("An error occurred while sending the email."))
//       .finally(() => setIsEmailSending(false));
//   };

//   // ─── Call ───────────────────────────────────────────────────────────────────
//   const handleCallClick = (phoneNumber: string, leadName: string) => {
//     setCallModal({ isOpen: true, phoneNumber, leadName });
//     setCallForm({ phone: phoneNumber, message: `Hi ${leadName},\n\nI hope this call finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,` });
//   };

//   const handleCallSend = () => {
//     if (!callForm.phone.trim() || !callForm.message.trim()) { toast.error("Please fill in all fields."); return; }
//     setIsCallSending(true);
//     setTimeout(() => { toast.success("Call message sent successfully!"); setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); setIsCallSending(false); }, 2000);
//   };

//   // ─── Cards per column ────────────────────────────────────────────────────────
//   const cardsByStatus = useMemo(() => {
//     const map: Record<string, CardData[]> = {};
//     columns.forEach((c) => { map[c.keyField] = []; });
//     leadData.forEach((card) => { if (map[card.Status] !== undefined) map[card.Status].push(card); });
//     return map;
//   }, [leadData, columns]);

//   // ─── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ padding: "5px", backgroundColor: "#fff" }}>
//       <style>{`
//         @keyframes kb-pop-in { from { opacity:0; transform:scale(0.97) translateY(4px); } to { opacity:1; transform:none; } }
//         .kb-scroll::-webkit-scrollbar { height: 8px; }
//         .kb-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
//         .kb-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
//         .kb-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//         .kb-kanban-col {
//           background: #ffffff !important;
//           border: 1px solid #e2e8f0 !important;
//           border-radius: 8px !important;
//           margin: 0 12px !important;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
//           min-width: 320px !important;
//           width: 320px !important;
//           flex-shrink: 0;
//           display: flex;
//           flex-direction: column;
//           height: calc(100vh - 160px);
//           transition: box-shadow 0.15s, background 0.15s;
//         }
//         .kb-kanban-col.drop-active {
//           box-shadow: 0 0 0 2.5px #f20c32, 0 2px 4px rgba(0,0,0,0.1) !important;
//           background: #fff5f5 !important;
//         }
//         .kb-col-header {
//           background: #f20c32 !important;
//           color: white !important;
//           font-weight: 700 !important;
//           font-size: 14px !important;
//           padding: 16px !important;
//           border-radius: 8px 8px 0 0 !important;
//           text-align: center !important;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           flex-shrink: 0;
//         }
//         .kb-col-body {
//           padding: 16px !important;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           flex: 1;
//           overflow-y: auto;
//           overflow-x: hidden;
//           min-height: 80px;
//         }
//         .kb-col-body::-webkit-scrollbar { width: 5px; }
//         .kb-col-body::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
//         .kb-col-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
//         .kb-col-body::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
//         .kb-card-wrap {
//           animation: kb-pop-in 0.18s ease-out;
//           cursor: grab;
//         }
//         .kb-card-wrap:active { cursor: grabbing; }
//         .kb-card-wrap:hover .kb-card-inner {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) !important;
//         }
//         .kb-card-wrap.is-dragging .kb-card-inner {
//           transform: rotate(2deg) !important;
//           box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
//           opacity: 0.45;
//         }
//         .kb-card-wrap.drag-over .kb-card-inner {
//           outline: 2px dashed #f20c32;
//           outline-offset: 2px;
//         }
//         .kb-drop-placeholder {
//           border: 2px dashed #e2e8f0;
//           border-radius: 8px;
//           min-height: 80px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #94a3b8;
//           font-size: 13px;
//           font-style: italic;
//           transition: background 0.15s, border-color 0.15s;
//         }
//         .kb-drop-placeholder.active {
//           border-color: #f20c32;
//           background: rgba(242,12,50,0.04);
//           color: #f20c32;
//         }
//       `}</style>

//       {/* Header */}
//       <div style={{
//         display: "flex", justifyContent: "space-between", alignItems: "center",
//         padding: "10px 15px", backgroundColor: "#f8fafc",
//         borderBottom: "1px solid #e2e8f0", marginBottom: "10px",
//       }}>
//         <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
//           Bulk Orders Kanban Board
//         </h2>

//         {/* Right side: Arrow buttons + Add Project */}
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           {/* Scroll Left */}
//           <button
//             onClick={() => {
//               if (scrollContainerRef.current) {
//                 scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
//               }
//             }}
//             title="Scroll Left"
//             style={{
//               width: "36px", height: "36px", borderRadius: "8px",
//               border: "1px solid #e2e8f0", background: "white", color: "#374151",
//               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: "16px", fontWeight: "700", transition: "all 0.2s",
//               boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//             }}
//             onMouseOver={(e) => { (e.currentTarget).style.background = "#f1f5f9"; (e.currentTarget).style.borderColor = "#cbd5e1"; }}
//             onMouseOut={(e)  => { (e.currentTarget).style.background = "white";    (e.currentTarget).style.borderColor = "#e2e8f0"; }}
//           >
//             ◀
//           </button>

//           {/* Scroll Right */}
//           <button
//             onClick={() => {
//               if (scrollContainerRef.current) {
//                 scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
//               }
//             }}
//             title="Scroll Right"
//             style={{
//               width: "36px", height: "36px", borderRadius: "8px",
//               border: "1px solid #e2e8f0", background: "white", color: "#374151",
//               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: "16px", fontWeight: "700", transition: "all 0.2s",
//               boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//             }}
//             onMouseOver={(e) => { (e.currentTarget).style.background = "#f1f5f9"; (e.currentTarget).style.borderColor = "#cbd5e1"; }}
//             onMouseOut={(e)  => { (e.currentTarget).style.background = "white";    (e.currentTarget).style.borderColor = "#e2e8f0"; }}
//           >
//             ▶
//           </button>

//           {/* Add Project */}
//           <button
//             onClick={() => setOpenAddProjectModal(true)}
//             style={{
//               backgroundColor: "#f20c32", color: "white", border: "none", borderRadius: "8px",
//               padding: "10px 16px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
//               display: "flex", alignItems: "center", gap: "8px",
//               transition: "all 0.2s ease-in-out", boxShadow: "0 2px 4px rgba(139,92,246,0.2)",
//             }}
//             onMouseOver={(e) => { (e.currentTarget).style.transform = "translateY(-1px)"; (e.currentTarget).style.boxShadow = "0 4px 8px rgba(139,92,246,0.3)"; }}
//             onMouseOut={(e)  => { (e.currentTarget).style.transform = "translateY(0)";    (e.currentTarget).style.boxShadow = "0 2px 4px rgba(139,92,246,0.2)"; }}
//           >
//             <FaPlus size={14} /> Add Project
//           </button>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div
//         ref={scrollContainerRef}
//         className="kb-scroll"
//         onDragOver={handleBoardDragOver}
//         style={{
//           overflowX: "auto", width: "100%",
//           whiteSpace: "nowrap", padding: "10px 0",
//           display: "flex", alignItems: "stretch",
//           WebkitOverflowScrolling: "touch",
//         }}
//       >
//         {columns.map((col) => {
//           const cards      = cardsByStatus[col.keyField] || [];
//           const isDropCol  = dragOverCol === col.keyField;

//           return (
//             <div
//               key={col.keyField}
//               className={`kb-kanban-col${isDropCol ? " drop-active" : ""}`}
//               onDragOver={(e) => onColDragOver(e, col.keyField)}
//               onDragLeave={(e) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setDragOverCol(null); }}
//               onDrop={(e) => onColDrop(e, col.keyField)}
//             >
//               {/* Column Header */}
//               <div className="kb-col-header">
//                 <span style={{ color: "white", fontWeight: 700, fontSize: 14, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
//                   {col.headerText}
//                 </span>
//                 <span style={{ background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 12, padding: "4px 8px", fontWeight: 600, fontSize: 13, marginLeft: 8 }}>
//                   {cards.length}
//                 </span>
//               </div>

//               {/* Column Body */}
//               <div className="kb-col-body">
//                 {cards.length === 0 ? (
//                   <div className={`kb-drop-placeholder${isDropCol ? " active" : ""}`}>
//                     Drop here
//                   </div>
//                 ) : (
//                   cards.map((card) => (
//                     <div
//                       key={card.Id}
//                       className={`kb-card-wrap${dragging?.cardId === card.Id ? " is-dragging" : ""}${dragOverCard === card.Id ? " drag-over" : ""}`}
//                       draggable
//                       onDragStart={(e) => onDragStart(e, card)}
//                       onDragEnd={onDragEnd}
//                       onDragOver={(e) => onCardDragOver(e, card.Id)}
//                       onDrop={(e) => onCardDrop(e, card)}
//                     >
//                       {/* ── Card Inner (exact doc2 style) ── */}
//                       <div
//                         className="kb-card-inner"
//                         style={{
//                           background: "#ffffff",
//                           border: "1px solid #e2e8f0",
//                           borderRadius: "10px",
//                           boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
//                           transition: "all 0.2s ease-in-out",
//                           minWidth: "240px",
//                           width: "240px",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {/* Header */}
//                         <div style={{ padding: "10px 12px 8px 12px", position: "relative", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", borderBottom: "1px solid #e2e8f0" }}>
//                           {/* View button */}
//                           <button
//                             onClick={(e) => { e.stopPropagation(); navigate(`/order/${card.LeadId}`, { state: { openOrderId: card.Id } }); }}
//                             style={{ position: "absolute", top: "8px", right: "8px", width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.12)", transition: "all 0.2s ease-in-out", zIndex: 10 }}
//                             onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)"; }}
//                             onMouseOut={(e)  => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
//                             title="View"
//                           >
//                             <TbEyeShare size={14} />
//                           </button>

//                           {/* Lead info */}
//                           <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
//                             <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", marginRight: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.08)", flexShrink: 0 }}>
//                               <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                               </svg>
//                             </div>
//                             <div style={{ flex: 1, minWidth: 0 }}>
//                               <div style={{ fontSize: "15px", fontWeight: "700", color: "#1f2937", marginBottom: "2px", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                                 {card.LeadName || "Unknown Lead"}
//                               </div>
//                               <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500, lineHeight: 1.2 }}>
//                                 {card.Company || "No Company"}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Order / Amount pill */}
//                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "6px 8px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
//                             <div>
//                               <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, marginBottom: "1px" }}>Order</div>
//                               <div style={{ fontSize: "12px", color: "#1f2937", fontWeight: 600, lineHeight: 1.2 }}>{card.Title || "N/A"}</div>
//                             </div>
//                             <div style={{ textAlign: "right" }}>
//                               <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, marginBottom: "1px" }}>Amount</div>
//                               <div style={{ fontSize: "13px", color: "#059669", fontWeight: 700, lineHeight: 1.2 }}>${card.OrderAmount ? card.OrderAmount.toLocaleString() : "0"}</div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Contact */}
//                         <div style={{ padding: "8px 12px" }}>
//                           <div style={{ display: "flex", alignItems: "center", marginBottom: "4px", padding: "2px 0" }}>
//                             <svg style={{ width: "13px", height: "13px", marginRight: "5px", color: "#6b7280", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                             <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                               {card.Email || "No email provided"}
//                             </span>
//                           </div>
//                           <div style={{ display: "flex", alignItems: "center", marginBottom: "6px", padding: "2px 0" }}>
//                             <svg style={{ width: "13px", height: "13px", marginRight: "5px", color: "#6b7280", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                             </svg>
//                             <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500, lineHeight: 1.2 }}>
//                               {card.Phone || "No phone provided"}
//                             </span>
//                           </div>

//                           {/* Action buttons */}
//                           <div style={{ display: "flex", gap: "6px", marginBottom: card.OrderType?.length ? "8px" : "0" }}>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); handleEmailClick(card.Email, card.LeadName); }}
//                               style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", flex: 1, transition: "all 0.2s ease-in-out" }}
//                               onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
//                               onMouseOut={(e)  => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
//                             >
//                               Email
//                             </button>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); handleCallClick(card.Phone, card.LeadName); }}
//                               style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", border: "none", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", flex: 1, transition: "all 0.2s ease-in-out" }}
//                               onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
//                               onMouseOut={(e)  => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
//                             >
//                               Text
//                             </button>
//                           </div>

//                           {/* Order type tags */}
//                           {card.OrderType && card.OrderType.length > 0 && (
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingTop: "4px", borderTop: "1px solid #e5e7eb" }}>
//                               {card.OrderType.map((type: string, index: number) => (
//                                 <span key={index} style={{ background: getOrderTypeColor(type), color: "#374151", padding: "3px 7px", borderRadius: "12px", fontSize: "10px", fontWeight: 700, display: "inline-block", border: "1px solid rgba(0,0,0,0.04)", lineHeight: 1.1 }}>
//                                   {type}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       {/* ── End Card Inner ── */}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Email Modal ── */}
//       {emailModal.isOpen && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//           <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", width: "90%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative" }}>
//             <button onClick={() => { setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); }} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
//             <div style={{ marginBottom: "20px" }}>
//               <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Send Email</h2>
//               <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>Send an email to {emailModal.leadName}</p>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               {[{ label: "To", type: "email", val: emailForm.to, key: "to" }, { label: "Subject", type: "text", val: emailForm.subject, key: "subject" }].map(({ label, type, val, key }) => (
//                 <div key={key}>
//                   <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>{label}</label>
//                   <input type={type} value={val} onChange={(e) => setEmailForm({ ...emailForm, [key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
//                 </div>
//               ))}
//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Message</label>
//                 <textarea value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} rows={6} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
//               </div>
//               <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
//                 <button onClick={() => { setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); }} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#374151", background: "white", cursor: "pointer" }}>Cancel</button>
//                 <button onClick={handleEmailSend} disabled={isEmailSending} style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "white", background: isEmailSending ? "linear-gradient(135deg,#9ca3af,#6b7280)" : "linear-gradient(135deg,#667eea,#764ba2)", cursor: isEmailSending ? "not-allowed" : "pointer", opacity: isEmailSending ? 0.7 : 1 }}>
//                   {isEmailSending ? "Sending..." : "Send Email"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Call/Text Modal ── */}
//       {callModal.isOpen && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//           <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", width: "90%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative" }}>
//             <button onClick={() => { setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); }} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
//             <div style={{ marginBottom: "20px" }}>
//               <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Text Message</h2>
//               <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>Send a text message to {callModal.leadName}</p>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Phone Number</label>
//                 <input type="tel" value={callForm.phone} onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
//               </div>
//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Message</label>
//                 <textarea value={callForm.message} onChange={(e) => setCallForm({ ...callForm, message: e.target.value })} rows={6} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
//               </div>
//               <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
//                 <button onClick={() => { setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); }} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#374151", background: "white", cursor: "pointer" }}>Cancel</button>
//                 <button onClick={handleCallSend} disabled={isCallSending} style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "white", background: isCallSending ? "linear-gradient(135deg,#9ca3af,#6b7280)" : "linear-gradient(135deg,#f093fb,#f5576c)", cursor: isCallSending ? "not-allowed" : "pointer", opacity: isCallSending ? 0.7 : 1 }}>
//                   {isCallSending ? "Sending..." : "Send Message"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Project Modal */}
//       {openAddProjectModal && (
//         <AddProjectModal
//           isOpen={openAddProjectModal}
//           onClose={() => setOpenAddProjectModal(false)}
//           onProjectAdded={() => { setOpenAddProjectModal(false); onRefresh?.(); }}
//         />
//       )}
//     </div>
//   );
// }



// import {
//   KanbanComponent,
//   ColumnsDirective,
//   ColumnDirective,
// } from "@syncfusion/ej2-react-kanban";
// import "@syncfusion/ej2-base/styles/material.css";
// import "@syncfusion/ej2-buttons/styles/material.css";
// import "@syncfusion/ej2-layouts/styles/material.css";
// import "@syncfusion/ej2-dropdowns/styles/material.css";
// import "@syncfusion/ej2-inputs/styles/material.css";
// import "@syncfusion/ej2-navigations/styles/material.css";
// import "@syncfusion/ej2-popups/styles/material.css";
// import "@syncfusion/ej2-react-kanban/styles/material.css";
// import { IoDocumentTextOutline } from "react-icons/io5";
// import { TbEyeShare } from "react-icons/tb";
// import { FaPlus } from "react-icons/fa";
// import React from "react";
// import { useEffect, useMemo, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { kanbanBulkOrderDragnDrop } from "../../Reducer/AddSlice";
// import AddProjectModal from "../../pages/ManageLeads/AddProjectModal";

// type StageColumn = {
//   stage: {
//     id: string | number;
//     name: string;
//     sort_order: number;
//   };
//   orders: any[];
// };

// export function KanbanBoardBulkOrder({
//   onRefresh,
//   columnsData = [],
//   source,
// }: {
//   onRefresh?: () => void;
//   columnsData: StageColumn[];
//   source: "ONLINE" | "OFFLINE";
// }) {
//   const navigate = useNavigate();
//   const dispatch: any = useDispatch();

//   const [leadData, setLeadData] = useState<any[]>([]);
//   const [kanbanWidth, setkanbanWidth] = useState<number>(0);
//   const [emailModal, setEmailModal] = useState<{ isOpen: boolean, leadEmail: string, leadName: string }>({
//     isOpen: false,
//     leadEmail: '',
//     leadName: ''
//   });
//   const [emailForm, setEmailForm] = useState({
//     to: '',
//     subject: '',
//     message: ''
//   });
//   const [callModal, setCallModal] = useState<{ isOpen: boolean, phoneNumber: string, leadName: string }>({
//     isOpen: false,
//     phoneNumber: '',
//     leadName: ''
//   });
//   const [callForm, setCallForm] = useState({
//     phone: '',
//     message: ''
//   });
//   const [isEmailSending, setIsEmailSending] = useState(false);
//   const [isCallSending, setIsCallSending] = useState(false);
//   const [openAddProjectModal, setOpenAddProjectModal] = useState(false);

//   // Function to get color for order type tags
//   const getOrderTypeColor = (type: string) => {
//     const colors: { [key: string]: string } = {
//       'Screenprint': '#fce7f3', // Light blue
//       'Embroidery': '#fef3c7', // Light teal/mint green
//       'Promo': '#bbf7d0', // Light green
//       'Custom': '#fef3c7', // Light yellow
//       'Bulk': '#e0e7ff', // Light indigo
//       'Sample': '#fce7f3', // Light pink
//       'Headwear': '#e0e7ff', // Light gray
//     };
//     return colors[type] || '#f3f4f6'; // Default light gray
//   };

//   const columns = useMemo(() => {
//     if (!columnsData || !Array.isArray(columnsData)) return [];

//     const sorted = [...columnsData].sort(
//       (a, b) => (a?.stage?.sort_order || 0) - (b?.stage?.sort_order || 0)
//     );

//     return sorted.map((col) => ({
//       headerText: col?.stage?.name || "",
//       keyField: col?.stage?.name || "",
//       stageId: col?.stage?.id,
//     }));
//   }, [columnsData]);

//   // Transform API columns + orders into Kanban card data
//   useEffect(() => {
//     if (!columnsData || !Array.isArray(columnsData)) {
//       setLeadData([]);
//       setkanbanWidth(0);
//       return;
//     }

//     const cards: any[] = [];

//     columnsData.forEach((col) => {
//       const stageName = col?.stage?.name;
//       const stageId = col?.stage?.id;

//       col?.orders?.forEach((order) => {
//         if (source === "ONLINE") {
//           const customer = order.customer || {};
//           cards.push({
//             Id: order.id,
//             // Title: order.order_number,
//             Title: "Order",
//             LeadName: customer.name,
//             Status: stageName,
//             Summary: `Status: ${order.status} | Payment: ${order.payment_status
//               } | Created: ${order.created_at}`,
//             Company: customer.company_name,
//             Email: customer.email,
//             Phone: customer.phone,
//             OrderType: [], // online orders don't have explicit order types in payload
//             OrderAmount: Number(order.order_amount || 0),
//             LeadId: customer.id,
//             StageId: stageId,
//             Source: "ONLINE",
//           });
//         } else {
//           const lead = order.lead || {};
//           cards.push({
//             Id: order.id,
//             Title: "Order",
//             LeadName: lead.name,
//             Status: stageName,
//             Summary: `Status: ${order.order_status} | Origin: ${order.order_origin
//               } | Start: ${order.start_date}`,
//             Company: lead.company_name,
//             Email: lead.email,
//             Phone: lead.phone,
//             OrderType: order.order_types || [],
//             OrderAmount: Number(order.order_amount || 0),
//             LeadId: order.lead_id,
//             StageId: stageId,
//             Source: "OFFLINE",
//           });
//         }
//       });
//     });

//     setLeadData(cards);
//     setkanbanWidth((columns || []).length * 350);
//   }, [columnsData, source, columns]);

//   // Remove license error
//   useEffect(() => {
//     const interval = setInterval(() => {
//       document.querySelectorAll('.syncfusion-license-error').forEach(el => el.remove());
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);


//   const handleStatusUpdate = async (cardData: any) => {
//     try {
//       const targetColumn = columns.find(
//         (col: any) => col.keyField === cardData.Status
//       );

//       if (!targetColumn || !targetColumn.stageId) {
//         console.warn("Target column / stage not found for drag-and-drop");
//         return;
//       }

//       const payload: any = {
//         id: cardData.Id,
//         order_stage_id: targetColumn.stageId,
//         source: cardData.Source || source,
//       };

//       await dispatch(kanbanBulkOrderDragnDrop(payload)).unwrap();

//       toast.success("Status updated successfully");
//       if (onRefresh) {
//         try {
//           onRefresh();
//         } catch (e) {
//           console.log("onRefresh error", e);
//         }
//       }
//     } catch (error) {
//       console.error("Error updating status", error);
//       toast.error("Failed to update status. Please try again.");
//     }
//   };

//   // Email handler functions
//   const handleEmailClick = (leadEmail: string, leadName: string) => {
//     setEmailModal({
//       isOpen: true,
//       leadEmail,
//       leadName
//     });
//     setEmailForm({
//       to: leadEmail,
//       subject: `Follow up - ${leadName}`,
//       message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`
//     });
//   };

//   const handleEmailSend = () => {
//     if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) {
//       toast.error('Please fill in all fields.');
//       return;
//     }

//     setIsEmailSending(true);
//     const payload = {
//       reciepent: emailForm.to,
//       sender: 'teams@showmecustomapparel', // You can replace this with actual sender email
//       subject: emailForm.subject,
//       replyBody: emailForm.message,
//     };

//     axios.post('https://n8n.bestworks.cloud/webhook/email-sender', payload)
//       .then(res => {
//         if (res.status === 200) {
//           toast.success('Email Sent Successfully!');
//           setEmailModal({ isOpen: false, leadEmail: '', leadName: '' });
//           setEmailForm({ to: '', subject: '', message: '' });
//         } else {
//           toast.error('Failed to send email. Please try again.');
//         }
//       })
//       .catch(err => {
//         console.error("Error sending email:", err);
//         toast.error('An error occurred while sending the email.');
//       })
//       .finally(() => {
//         setIsEmailSending(false);
//       });
//   };

//   const handleEmailModalClose = () => {
//     setEmailModal({ isOpen: false, leadEmail: '', leadName: '' });
//     setEmailForm({ to: '', subject: '', message: '' });
//   };

//   // Call modal handler functions
//   const handleCallClick = (phoneNumber: string, leadName: string) => {
//     setCallModal({
//       isOpen: true,
//       phoneNumber,
//       leadName
//     });
//     setCallForm({
//       phone: phoneNumber,
//       message: `Hi ${leadName},\n\nI hope this call finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`
//     });
//   };

//   const handleCallSend = () => {
//     if (!callForm.phone.trim() || !callForm.message.trim()) {
//       toast.error('Please fill in all fields.');
//       return;
//     }

//     setIsCallSending(true);
//     // Sample handler function - you can replace this with actual API call
//     console.log("Sending call message:", callForm);

//     // Simulate API call
//     setTimeout(() => {
//       toast.success("Call message sent successfully!");
//       setCallModal({ isOpen: false, phoneNumber: '', leadName: '' });
//       setCallForm({ phone: '', message: '' });
//       setIsCallSending(false);
//     }, 2000);
//   };

//   const handleCallModalClose = () => {
//     setCallModal({ isOpen: false, phoneNumber: '', leadName: '' });
//     setCallForm({ phone: '', message: '' });
//   };

//   // View lead handler function
//   // Change this function:
//   const handleViewLead = (leadId: string, orderId: string) => {
//     navigate(`/order/${leadId}`, { state: { openOrderId: orderId } });
//   };

//   // Add project handler function
//   const handleAddProject = (leadId: string) => {
//     console.log("Adding project for lead:", leadId);
//     setOpenAddProjectModal(true);
//   };

//   const handleProjectAdded = (projectData: any) => {
//     console.log("Project added:", projectData);
//     // Refresh kanban board after project is added
//     if (onRefresh) {
//       try {
//         onRefresh();
//       } catch (e) {
//         console.log("onRefresh error after project add", e);
//       }
//     }
//   };
//   // Prevent incorrect drags
//   // function onDragStart(args: any) {
//   //   if (args.data.Status === "Closed Won" || args.data.Status === "Closed Lost") {
//   //     args.cancel = true;
//   //   }
//   // }

//   function onDragStop(args: any) {
//     // let cardData = Array.isArray(args.data) ? args.data : args.data;
//     const cardData = Array.isArray(args.data) ? args.data[0] : args.data;
//     console.log('args', args)
//     // If cardData.Status is already the target column status after drop

//     if (!cardData) return;

//     // Now call handleStatusUpdate with the updated status
//     console.log("leadData.id", leadData);
//     const existing = leadData.find((x) => x.Id === cardData.Id);
//     console.log("find", existing);

//     // Only trigger if status actually changed
//     if (!existing || existing.Status === cardData.Status) {
//       return;
//     }

//     handleStatusUpdate(cardData);
//   }




//   // Custom Card Template
//   const cardTemplate = (props: any) => {
//     return (
//       <div
//         className="e-card-content"
//         style={{
//           background: '#ffffff',
//           border: '1px solid #e2e8f0',
//           borderRadius: '10px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
//           margin: '5px',
//           transition: 'all 0.2s ease-in-out',
//           cursor: 'pointer',
//           minWidth: '240px',
//           width: '240px',
//           overflow: 'hidden'
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: '10px 12px 8px 12px',
//             position: 'relative',
//             background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//             borderBottom: '1px solid #e2e8f0'
//           }}
//         >
//           {/* View Icon */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleViewLead(props.LeadId, String(props.Id));


//             }}
//             style={{
//               position: 'absolute',
//               top: '8px',
//               right: '8px',
//               width: '28px',
//               height: '28px',
//               borderRadius: '50%',
//               background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//               color: 'white',
//               border: 'none',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
//               transition: 'all 0.2s ease-in-out',
//               zIndex: 10
//             }}
//             onMouseOver={(e) => {
//               (e.target as HTMLButtonElement).style.transform = 'scale(1.06)';
//             }}
//             onMouseOut={(e) => {
//               (e.target as HTMLButtonElement).style.transform = 'scale(1)';
//             }}
//             aria-label="View"
//             title="View"
//           >
//             <TbEyeShare size={14} />
//           </button>

//           {/* Lead Info */}
//           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
//             <div
//               style={{
//                 width: '36px',
//                 height: '36px',
//                 background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: 'white',
//                 marginRight: '8px',
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
//               }}
//             >
//               <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div
//                 style={{
//                   fontSize: '15px',
//                   fontWeight: '700',
//                   color: '#1f2937',
//                   marginBottom: '2px',
//                   lineHeight: 1.15,
//                   whiteSpace: 'nowrap',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis'
//                 }}
//               >
//                 {props.LeadName || 'Unknown Lead'}
//               </div>
//               <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, lineHeight: 1.2 }}>
//                 {props.Company || 'No Company'}
//               </div>
//             </div>
//           </div>

//           {/* Order Info */}
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               background: 'white',
//               padding: '6px 8px',
//               borderRadius: '6px',
//               border: '1px solid #e5e7eb'
//             }}
//           >
//             <div>
//               <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, marginBottom: '1px' }}>Order</div>
//               <div style={{ fontSize: '12px', color: '#1f2937', fontWeight: 600, lineHeight: 1.2 }}>
//                 {props.Title || 'N/A'}
//               </div>
//             </div>
//             <div style={{ textAlign: 'right' }}>
//               <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, marginBottom: '1px' }}>Amount</div>
//               <div style={{ fontSize: '13px', color: '#059669', fontWeight: 700, lineHeight: 1.2 }}>
//                 ${props.OrderAmount ? props.OrderAmount.toLocaleString() : '0'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Contact */}
//         <div style={{ padding: '8px 12px' }}>
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               marginBottom: '4px',
//               padding: '2px 0'
//             }}
//           >
//             <svg
//               style={{ width: '13px', height: '13px', marginRight: '5px', color: '#6b7280' }}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//             <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500, lineHeight: 1.2 }}>
//               {props.Email || 'No email provided'}
//             </span>
//           </div>

//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               marginBottom: '6px',
//               padding: '2px 0'
//             }}
//           >
//             <svg
//               style={{ width: '13px', height: '13px', marginRight: '5px', color: '#6b7280' }}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//             </svg>
//             <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500, lineHeight: 1.2 }}>
//               {props.Phone || 'No phone provided'}
//             </span>
//           </div>

//           {/* Actions */}
//           <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEmailClick(props.Email, props.LeadName || props.Title);
//               }}
//               style={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 padding: '6px 8px',
//                 fontSize: '11px',
//                 fontWeight: 700,
//                 cursor: 'pointer',
//                 flex: 1,
//                 transition: 'all 0.2s ease-in-out'
//               }}
//             >
//               Email
//             </button>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleCallClick(props.Phone, props.LeadName || props.Title);
//               }}
//               style={{
//                 background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 padding: '6px 8px',
//                 fontSize: '11px',
//                 fontWeight: 700,
//                 cursor: 'pointer',
//                 flex: 1,
//                 transition: 'all 0.2s ease-in-out'
//               }}
//             >
//               Text
//             </button>
//           </div>

//           {/* Tags */}
//           {props.OrderType && props.OrderType.length > 0 && (
//             <div
//               style={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 gap: '4px',
//                 paddingTop: '4px',
//                 borderTop: '1px solid #e5e7eb'
//               }}
//             >
//               {props.OrderType.map((type: string, index: number) => (
//                 <span
//                   key={index}
//                   style={{
//                     background: getOrderTypeColor(type),
//                     color: '#374151',
//                     padding: '3px 7px',
//                     borderRadius: '12px',
//                     fontSize: '10px',
//                     fontWeight: 700,
//                     display: 'inline-block',
//                     border: '1px solid rgba(0,0,0,0.04)',
//                     lineHeight: 1.1
//                   }}
//                 >
//                   {type}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>


//     );
//   };

//   return (
//     <div style={{
//       padding: '5px',
//       backgroundColor: '#fff'
//     }}>
//       {/* Header Section with Add Project Button */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: '10px 15px',
//         backgroundColor: '#f8fafc',
//         borderBottom: '1px solid #e2e8f0',
//         marginBottom: '10px'
//       }}>
//         <h2 style={{
//           fontSize: '20px',
//           fontWeight: '700',
//           color: '#1f2937',
//           margin: 0
//         }}>
//           Bulk Orders Kanban Board
//         </h2>

//         <button
//           onClick={() => setOpenAddProjectModal(true)}
//           style={{
//             backgroundColor: '#f20c32',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             padding: '10px 16px',
//             fontSize: '14px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             transition: 'all 0.2s ease-in-out',
//             boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
//           }}
//           onMouseOver={(e) => {
//             (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
//             (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.3)';
//           }}
//           onMouseOut={(e) => {
//             (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
//             (e.target as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.2)';
//           }}
//         >
//           <FaPlus size={14} />
//           Add Project
//         </button>
//       </div>

//       <div style={{
//         overflowX: "auto",
//         width: "100%",
//         whiteSpace: "nowrap",
//         padding: '10px 0'
//       }}>
//         <style>
//           {`
//             .e-kanban .e-kanban-column {
//               background: #ffffff !important;
//               border: 1px solid #e2e8f0 !important;
//               border-radius: 8px !important;
//               margin: 0 12px !important;
//               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
//               min-height: 500px !important;
//               min-width: 320px !important;
//               width: 320px !important;
//             }
            
//             .e-kanban .e-kanban-column-header {
//               background: #f20c32 !important;
//               color: white !important;
//               font-weight: 700 !important;
//               font-size: 14px !important;
//               padding: 16px !important;
//               border-radius: 8px 8px 0 0 !important;
//               text-align: center !important;
//               box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
//             }
            
//             .e-kanban .e-kanban-column-content {
//               padding: 16px !important;
//               background: transparent !important;
//             }
            
//             .e-kanban .e-kanban-card {
//               background: transparent !important;
//               border: none !important;
//               box-shadow: none !important;
//               margin: 0 !important;
//             }
            
//             .e-kanban .e-kanban-card:hover {
//               transform: translateY(-2px) !important;
//               box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
//             }
            
//             .e-kanban .e-kanban-dragged-card {
//               transform: rotate(2deg) !important;
//               box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
//             }
            
//             .e-kanban .e-kanban-column-header .e-header-text {
//               color: white !important;
//               font-weight: 700 !important;
//               text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
//             }
            
//             .e-kanban .e-kanban-column-header .e-header-count {
//               background: rgba(255, 255, 255, 0.2) !important;
//               color: white !important;
//               border-radius: 12px !important;
//               padding: 4px 8px !important;
//               font-weight: 600 !important;
//               margin-left: 8px !important;
//             }
            
//             .e-kanban {
//               width: 100% !important;
//               min-width: 2000px !important;
//             }
//           `}
//         </style>
//         <KanbanComponent
//           id="kanban"
//           keyField="Status"
//           dataSource={leadData}
//           dragStop={onDragStop}
//           cardSettings={{
//             contentField: "Summary",
//             headerField: "Title",
//             template: cardTemplate,
//           }}
//           style={{ width: '100%', minWidth: '2000px' }}
//         >
//           <ColumnsDirective>
//             {columns.map(({ headerText, keyField }) => (
//               <ColumnDirective key={keyField} headerText={headerText} keyField={keyField} />
//             ))}
//           </ColumnsDirective>
//         </KanbanComponent>
//       </div>

//       {/* Email Modal */}
//       {emailModal.isOpen && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           backdropFilter: 'blur(4px)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             padding: '24px',
//             width: '90%',
//             maxWidth: '500px',
//             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//             position: 'relative'
//           }}>
//             {/* Close Button */}
//             <button
//               onClick={handleEmailModalClose}
//               style={{
//                 position: 'absolute',
//                 top: '16px',
//                 right: '16px',
//                 background: 'none',
//                 border: 'none',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//                 color: '#6b7280',
//                 padding: '4px'
//               }}
//             >
//               ×
//             </button>

//             {/* Modal Header */}
//             <div style={{ marginBottom: '20px' }}>
//               <h2 style={{
//                 fontSize: '20px',
//                 fontWeight: '700',
//                 color: '#1f2937',
//                 margin: 0
//               }}>
//                 Send Email
//               </h2>
//               <p style={{
//                 fontSize: '14px',
//                 color: '#6b7280',
//                 margin: '4px 0 0 0'
//               }}>
//                 Send an email to {emailModal.leadName}
//               </p>
//             </div>

//             {/* Email Form */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               {/* To Field */}
//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '6px'
//                 }}>
//                   To
//                 </label>
//                 <input
//                   type="email"
//                   value={emailForm.to}
//                   onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s'
//                   }}
//                   onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#3b82f6'}
//                   onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
//                 />
//               </div>

//               {/* Subject Field */}
//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '6px'
//                 }}>
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   value={emailForm.subject}
//                   onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s'
//                   }}
//                   onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#3b82f6'}
//                   onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
//                 />
//               </div>

//               {/* Message Field */}
//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '6px'
//                 }}>
//                   Message
//                 </label>
//                 <textarea
//                   value={emailForm.message}
//                   onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
//                   rows={6}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     outline: 'none',
//                     resize: 'vertical',
//                     transition: 'border-color 0.2s'
//                   }}
//                   onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#3b82f6'}
//                   onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#d1d5db'}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div style={{
//                 display: 'flex',
//                 gap: '12px',
//                 justifyContent: 'flex-end',
//                 marginTop: '8px'
//               }}>
//                 <button
//                   onClick={handleEmailModalClose}
//                   style={{
//                     padding: '10px 20px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     color: '#374151',
//                     background: 'white',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s'
//                   }}
//                   onMouseOver={(e) => {
//                     (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
//                   }}
//                   onMouseOut={(e) => {
//                     (e.target as HTMLButtonElement).style.backgroundColor = 'white';
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEmailSend}
//                   disabled={isEmailSending}
//                   style={{
//                     padding: '10px 20px',
//                     border: 'none',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     color: 'white',
//                     background: isEmailSending
//                       ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
//                       : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     cursor: isEmailSending ? 'not-allowed' : 'pointer',
//                     transition: 'all 0.2s',
//                     opacity: isEmailSending ? 0.7 : 1
//                   }}
//                   onMouseOver={(e) => {
//                     if (!isEmailSending) {
//                       (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
//                       (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
//                     (e.target as HTMLButtonElement).style.boxShadow = 'none';
//                   }}
//                 >
//                   {isEmailSending ? 'Sending...' : 'Send Email'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Call Modal */}
//       {callModal.isOpen && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           backdropFilter: 'blur(4px)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             padding: '24px',
//             width: '90%',
//             maxWidth: '500px',
//             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//             position: 'relative'
//           }}>
//             {/* Close Button */}
//             <button
//               onClick={handleCallModalClose}
//               style={{
//                 position: 'absolute',
//                 top: '16px',
//                 right: '16px',
//                 background: 'none',
//                 border: 'none',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//                 color: '#6b7280',
//                 padding: '4px'
//               }}
//             >
//               ×
//             </button>

//             {/* Modal Header */}
//             <div style={{ marginBottom: '20px' }}>
//               <h2 style={{
//                 fontSize: '20px',
//                 fontWeight: '700',
//                 color: '#1f2937',
//                 margin: 0
//               }}>
//                 Text Message
//               </h2>
//               <p style={{
//                 fontSize: '14px',
//                 color: '#6b7280',
//                 margin: '4px 0 0 0'
//               }}>
//                 Send a text message to {callModal.leadName}
//               </p>
//             </div>

//             {/* Call Form */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               {/* Phone Field */}
//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '6px'
//                 }}>
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={callForm.phone}
//                   onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s'
//                   }}
//                   onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#3b82f6'}
//                   onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
//                 />
//               </div>

//               {/* Message Field */}
//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '6px'
//                 }}>
//                   Message
//                 </label>
//                 <textarea
//                   value={callForm.message}
//                   onChange={(e) => setCallForm({ ...callForm, message: e.target.value })}
//                   rows={6}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     outline: 'none',
//                     resize: 'vertical',
//                     transition: 'border-color 0.2s'
//                   }}
//                   onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#3b82f6'}
//                   onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#d1d5db'}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div style={{
//                 display: 'flex',
//                 gap: '12px',
//                 justifyContent: 'flex-end',
//                 marginTop: '8px'
//               }}>
//                 <button
//                   onClick={handleCallModalClose}
//                   style={{
//                     padding: '10px 20px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     color: '#374151',
//                     background: 'white',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s'
//                   }}
//                   onMouseOver={(e) => {
//                     (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
//                   }}
//                   onMouseOut={(e) => {
//                     (e.target as HTMLButtonElement).style.backgroundColor = 'white';
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCallSend}
//                   disabled={isCallSending}
//                   style={{
//                     padding: '10px 20px',
//                     border: 'none',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     color: 'white',
//                     background: isCallSending
//                       ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
//                       : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//                     cursor: isCallSending ? 'not-allowed' : 'pointer',
//                     transition: 'all 0.2s',
//                     opacity: isCallSending ? 0.7 : 1
//                   }}
//                   onMouseOver={(e) => {
//                     if (!isCallSending) {
//                       (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
//                       (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
//                     (e.target as HTMLButtonElement).style.boxShadow = 'none';
//                   }}
//                 >
//                   {isCallSending ? 'Sending...' : 'Send Message'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Project Modal */}
//       {openAddProjectModal && (
//         <AddProjectModal
//           isOpen={openAddProjectModal}
//           onClose={() => setOpenAddProjectModal(false)}
//           onProjectAdded={handleProjectAdded}
//         />
//       )}
//     </div>
//   );
// }
