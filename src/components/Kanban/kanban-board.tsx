import React, { useEffect, useRef, useState, useCallback } from "react";
import { TbEyeShare } from "react-icons/tb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { leadListNew, kanbanDragnDrop, updateLeadStages } from "../../Reducer/AddSlice";
import axios from "axios";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CardData {
  Id: string;
  Title: string;
  Status: string;
  Summary: string;
  Company: string;
  Email: string;
  Phone: string;
  Industry: string;
  Assignee: string;
  LeadStatusId: number;
  HatsUsage: string;
  PastIssues: string;
  MostImportant: string;
}

interface DragState {
  cardId: string;
  fromStatus: string;
  cardData: CardData;
}

interface ConfirmMove {
  card: CardData;
  toStatus: string;
  toStageName: string;
  fromStageName: string;
}

// ─── Fixed columns & status maps ─────────────────────────────────────────────
const COLUMNS = [
  { headerText: "Sample Submitted", keyField: "Sample Submitted" },
  { headerText: "Artwork digitized", keyField: "Artwork digitized" },
  { headerText: "Sample Shipped",   keyField: "Sample Shipped"    },
  { headerText: "Sample Delivered", keyField: "Sample Delivered"  },
  { headerText: "Warm Lead",        keyField: "Warm Lead"         },
  { headerText: "Cold Lead",        keyField: "Cold Lead"         },
  { headerText: "Bulk Order",       keyField: "Bulk Order"        },
];

// leadStatusId (from API) → column name
const STATUS_ID_TO_NAME: { [key: number]: string } = {
  1: "Sample Submitted",
  2: "Artwork digitized",
  3: "Sample Shipped",
  4: "Sample Delivered",
  5: "Warm Lead",
  6: "Cold Lead",
  7: "Bulk Order",
};

// column name → leadStatusId (for API payload)
const STATUS_NAME_TO_ID: { [key: string]: number } = {
  "Sample Submitted": 1,
  "Artwork digitized": 2,
  "Sample Shipped":   3,
  "Sample Delivered": 4,
  "Warm Lead":        5,
  "Cold Lead":        6,
  "Bulk Order":       7,
};

// ═══════════════════════════════════════════════════════════════════════════════
export function KanbanBoard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leadListNewData, leadListNewLoading } = useSelector((state: any) => state.add);

  const [leadData,     setLeadData]    = useState<CardData[]>([]);
  const [dragging,     setDragging]    = useState<DragState | null>(null);
  const [dragOverCol,  setDragOverCol] = useState<string | null>(null);
  const [dragOverCard, setDragOverCard]= useState<string | null>(null);
  const [confirmMove,  setConfirmMove] = useState<ConfirmMove | null>(null);

  const [emailModal, setEmailModal] = useState<{ isOpen: boolean; leadEmail: string; leadName: string }>({ isOpen: false, leadEmail: "", leadName: "" });
  const [emailForm,  setEmailForm]  = useState({ to: "", subject: "", message: "" });

  const [callModal, setCallModal] = useState<{ isOpen: boolean; phoneNumber: string; leadName: string }>({ isOpen: false, phoneNumber: "", leadName: "" });
  const [callForm,  setCallForm]  = useState({ phone: "", message: "" });

  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isCallSending,  setIsCallSending]  = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimer    = useRef<number | null>(null);
  const ghostRef           = useRef<HTMLDivElement | null>(null);
  const dragXRef           = useRef<number>(0);

  // ─── Fetch leads ──────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(leadListNew() as any);
  }, [dispatch]);

  // ─── Transform API data ───────────────────────────────────────────────────────
  // FIX: use lead.leadStatusId to place each card in the correct column
  useEffect(() => {
    const leads = leadListNewData?.data;
    if (!Array.isArray(leads)) return;

    const cards: CardData[] = leads.map((lead: any) => ({
      Id:            String(lead?.id ?? ""),
      Title:         lead?.name || "Untitled",
      Status:        STATUS_ID_TO_NAME[lead?.leadStatusId] || "Sample Submitted",
      Summary:       "No summary available",
      Company:       lead?.companyName || "No Company",
      Email:         lead?.email || "",
      Phone:         lead?.phone || "",
      Industry:      lead?.industry || "",
      Assignee:      "Unassigned",
      LeadStatusId:  lead?.leadStatusId || 1,
      HatsUsage:     "",
      PastIssues:    "",
      MostImportant: "",
    }));

    setLeadData(cards);
  }, [leadListNewData]);

  // ─── Auto-scroll ──────────────────────────────────────────────────────────────
  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) { cancelAnimationFrame(autoScrollTimer.current); autoScrollTimer.current = null; }
  }, []);

  const startAutoScrollLoop = useCallback(() => {
    if (autoScrollTimer.current) return;
    const ZONE = 120, SPEED = 14;
    const tick = () => {
      const el = scrollContainerRef.current;
      if (!el) { autoScrollTimer.current = null; return; }
      const rect = el.getBoundingClientRect();
      const x    = dragXRef.current - rect.left;
      if (x < ZONE && x > 0)                            el.scrollLeft -= Math.round(SPEED * (1 - x / ZONE));
      else if (x > rect.width - ZONE && x < rect.width) el.scrollLeft += Math.round(SPEED * (1 - (rect.width - x) / ZONE));
      autoScrollTimer.current = requestAnimationFrame(tick);
    };
    autoScrollTimer.current = requestAnimationFrame(tick);
  }, []);

  const handleBoardDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    dragXRef.current = e.clientX;
  }, []);

  useEffect(() => () => stopAutoScroll(), [stopAutoScroll]);

  // ─── Drag handlers ────────────────────────────────────────────────────────────
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
    setDragging(null); setDragOverCol(null); setDragOverCard(null);
    stopAutoScroll();
    if (ghostRef.current) { document.body.removeChild(ghostRef.current); ghostRef.current = null; }
  }, [stopAutoScroll]);

  const onColDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverCol(colKey);
  };

  const onColDrop = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    if (!dragging || dragging.fromStatus === colKey) { onDragEnd(); return; }
    handleStatusUpdate(dragging.cardData, colKey);
    onDragEnd();
  };

  const onCardDragOver = (e: React.DragEvent, cardId: string) => {
    e.preventDefault(); e.stopPropagation(); setDragOverCard(cardId);
  };

  const onCardDrop = (e: React.DragEvent, targetCard: CardData) => {
    e.preventDefault(); e.stopPropagation();
    if (!dragging) { onDragEnd(); return; }
    if (dragging.fromStatus !== targetCard.Status) handleStatusUpdate(dragging.cardData, targetCard.Status);
    onDragEnd();
  };

  // ─── Show confirmation modal before move ──────────────────────────────────────
  const handleStatusUpdate = (card: CardData, newStatus: string) => {
    const fromCol = COLUMNS.find((c) => c.keyField === card.Status);
    const toCol   = COLUMNS.find((c) => c.keyField === newStatus);
    if (!fromCol || !toCol) return;
    setConfirmMove({ card, toStatus: newStatus, toStageName: toCol.headerText, fromStageName: fromCol.headerText });
  };

  // ─── Execute after confirmation ───────────────────────────────────────────────
const executeStatusUpdate = useCallback(async (card: CardData, newStatus: string) => {
    const newStatusId = STATUS_NAME_TO_ID[newStatus];
    if (!newStatusId) { toast.error(`No status id found for: ${newStatus}`); return; }
    const prevStatus       = card.Status;
    const prevLeadStatusId = card.LeadStatusId;

    // Optimistic update
    setLeadData((prev) => prev.map((c) =>
      c.Id === card.Id ? { ...c, Status: newStatus, LeadStatusId: newStatusId } : c
    ));

    try {
      const stageRes: any = await (dispatch as any)(
        kanbanDragnDrop({ lead_id: String(card.Id), lead_status_id: Number(newStatusId) } as any)
      ).unwrap();

      toast.success(stageRes.message || "Status updated successfully");

      // ── Webhook call after successful stage change ──
      if (stageRes?.status_code === 200) {
        const webhookPayload = {
          lead_id:        stageRes?.data?.lead_id,
          old_status_id:  stageRes?.data?.old_status_id,
          new_status_id:  stageRes?.data?.new_status_id,
          // customer details from card
          customer: {
            name:         card.Title,
            email:        card.Email,
            phone:        card.Phone,
            company_name: card.Company,
          },
          new_stage_name: newStatus,
          old_stage_name: card.Status,
        };

        try {
          await (dispatch as any)(updateLeadStages(webhookPayload)).unwrap();
        } catch (webhookErr) {
          console.error("Webhook failed (non-blocking):", webhookErr);
        }
      }

      dispatch(leadListNew() as any);
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setLeadData((prev) => prev.map((c) =>
        c.Id === card.Id ? { ...c, Status: prevStatus, LeadStatusId: prevLeadStatusId } : c
      ));
      toast.error("Failed to update status");
    }
  }, [dispatch]);

  // ─── Email ────────────────────────────────────────────────────────────────────
  const handleEmailClick = (leadEmail: string, leadName: string) => {
    setEmailModal({ isOpen: true, leadEmail, leadName });
    setEmailForm({ to: leadEmail, subject: `Follow up - ${leadName}`, message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,` });
  };

  // const handleEmailSend = () => {
  //   if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) { toast.error("Please fill in all fields."); return; }
  //   setIsEmailSending(true);
  //   axios.post("https://n8n.bestworks.cloud/webhook/email-sender", { reciepent: emailForm.to, sender: "noreply@company.com", subject: emailForm.subject, replyBody: emailForm.message })
  //     .then((res) => { if (res.status === 200) { toast.success("Email Sent Successfully!"); setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); } else toast.error("Failed to send email. Please try again."); })
  //     .catch(() => toast.error("An error occurred while sending the email."))
  //     .finally(() => setIsEmailSending(false));
  // };

    const handleEmailSend = () => {
  if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) { 
    toast.error("Please fill in all fields."); 
    return; 
  }
  setIsEmailSending(true);

  // Match the n8n JSON input exactly

  const payload = {
    reciepent: emailForm.to,       
    sender: "projects@showmecustomapparel.com", 
    subject: emailForm.subject,
    message: emailForm.message        

  };
 
  axios.post("https://n8nnode.showmecustomapparel.com/webhook/email-sender", payload)
    .then((res) => { 
      console.log('resss',res)
      if (res.status === 200) { 
        toast.success("Email Sent Successfully!"); 
        setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); 
        setEmailForm({ to: "", subject: "", message: "" }); 
      } else {
        toast.error("Failed to send email.");
      }

    })

    .catch(() => toast.error("An error occurred while sending the email."))

    .finally(() => setIsEmailSending(false));

};

  const handleEmailModalClose = () => { setEmailModal({ isOpen: false, leadEmail: "", leadName: "" }); setEmailForm({ to: "", subject: "", message: "" }); };

  // ─── Call/Text ────────────────────────────────────────────────────────────────
  const handleCallClick = (phoneNumber: string, leadName: string) => {
    setCallModal({ isOpen: true, phoneNumber, leadName });
    setCallForm({ phone: phoneNumber, message: `Hi ${leadName},\n\nI hope this call finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,` });
  };

  const handleCallSend = () => {
    if (!callForm.phone.trim() || !callForm.message.trim()) { toast.error("Please fill in all fields."); return; }
    setIsCallSending(true);
    setTimeout(() => { toast.success("Call message sent successfully!"); setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); setIsCallSending(false); }, 2000);
  };

  const handleCallModalClose = () => { setCallModal({ isOpen: false, phoneNumber: "", leadName: "" }); setCallForm({ phone: "", message: "" }); };

  // ─── Cards per column ─────────────────────────────────────────────────────────
  const cardsByStatus: Record<string, CardData[]> = {};
  COLUMNS.forEach((c) => { cardsByStatus[c.keyField] = []; });
  leadData.forEach((card) => { if (cardsByStatus[card.Status] !== undefined) cardsByStatus[card.Status].push(card); });

  // ─── Render ───────────────────────────────────────────────────────────────────
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
          gap: 6px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 80px;
        }
        .kb-col-body::-webkit-scrollbar { width: 5px; }
        .kb-col-body::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .kb-col-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .kb-col-body::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .kb-card-wrap { animation: kb-pop-in 0.18s ease-out; cursor: grab; }
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
        .kb-card-wrap.drag-over .kb-card-inner { outline: 2px dashed #f20c32; outline-offset: 2px; }
        .kb-drop-placeholder {
          border: 2px dashed #e2e8f0; border-radius: 8px; min-height: 80px;
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8; font-size: 13px; font-style: italic;
          transition: background 0.15s, border-color 0.15s;
        }
        .kb-drop-placeholder.active { border-color: #f20c32; background: rgba(242,12,50,0.04); color: #f20c32; }
      `}</style>

      {/* ── Header: Title + Left/Right Scroll Arrows ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 15px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", marginBottom: "10px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Manage Leads</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => scrollContainerRef.current?.scrollBy({ left: -340, behavior: "smooth" })}
            title="Scroll Left"
            style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
            onMouseOut={(e)  => { e.currentTarget.style.background = "white";    e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >◀</button>
          <button
            onClick={() => scrollContainerRef.current?.scrollBy({ left: 340, behavior: "smooth" })}
            title="Scroll Right"
            style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
            onMouseOut={(e)  => { e.currentTarget.style.background = "white";    e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >▶</button>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      {leadListNewLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading...</div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="kb-scroll"
          onDragOver={handleBoardDragOver}
          style={{ overflowX: "auto", width: "100%", whiteSpace: "nowrap", padding: "10px 0", display: "flex", alignItems: "stretch", WebkitOverflowScrolling: "touch" }}
        >
          {COLUMNS.map((col) => {
            const cards     = cardsByStatus[col.keyField] || [];
            const isDropCol = dragOverCol === col.keyField;

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
                  <span style={{ color: "white", fontWeight: 700, fontSize: 14, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>{col.headerText}</span>
                  <span style={{ background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 12, padding: "4px 8px", fontWeight: 600, fontSize: 13, marginLeft: 8 }}>{cards.length}</span>
                </div>

                {/* Column Body */}
                <div className="kb-col-body">
                  {cards.length === 0 ? (
                    <div className={`kb-drop-placeholder${isDropCol ? " active" : ""}`}>Drop here</div>
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
                        <div className="kb-card-inner" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.06)", transition: "all 0.2s ease-in-out", overflow: "hidden", width: "100%" }}>
                          {/* Card Header */}
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 12px 6px 12px", position: "relative" }}>
                            <div style={{ width: "34px", height: "34px", borderRadius: "9999px", background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "0 0 34px" }}>
                              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.Title || "Untitled"}</div>
                              <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.1 }}>{card.Company || "No Company"}</div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/lead-details/${card.Id}`); }}
                              style={{ width: "26px", height: "26px", borderRadius: "9999px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flex: "0 0 26px", cursor: "pointer" }}
                            >
                              <TbEyeShare size={13} />
                            </button>
                          </div>

                          {/* Card Body */}
                          <div style={{ padding: "6px 12px 12px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                              <svg style={{ width: "13px", height: "13px", marginRight: "5px", color: "#6b7280" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500, wordBreak: "break-all" }}>{card.Email || "No email provided"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                              <svg style={{ width: "13px", height: "13px", marginRight: "5px", color: "#6b7280" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>{card.Phone || "No phone provided"}</span>
                            </div>
                            <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={(e) => { e.stopPropagation(); handleEmailClick(card.Email, card.Title); }} style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", fontWeight: 600, flex: 1, cursor: "pointer" }}>Email</button>
                              <button onClick={(e) => { e.stopPropagation(); handleCallClick(card.Phone, card.Title); }} style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", border: "none", borderRadius: "6px", padding: "6px 8px", fontSize: "12px", fontWeight: 600, flex: 1, cursor: "pointer" }}>Text</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Stage Change Confirmation Modal ── */}
      {confirmMove && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0 25px 50px rgba(0,0,0,0.18)", overflow: "hidden", animation: "kb-pop-in 0.2s ease-out" }}>
            {/* Top warning bar */}
            <div style={{ background: "linear-gradient(135deg, #f20c32 0%, #c20028 100%)", padding: "18px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "16px" }}>Confirm Stage Change</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", marginTop: "2px" }}>This action cannot be undone once confirmed</div>
              </div>
            </div>

            {/* Card Preview */}
            <div style={{ padding: "20px 24px 0" }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #ef4444, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>{confirmMove.card.Title}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{confirmMove.card.Company || "No Company"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                  <span><MdOutlineEmail /></span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{confirmMove.card.Email || "—"}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
                  <span><IoCallOutline /></span><span>{confirmMove.card.Phone || "—"}</span>
                </div>
              </div>

              {/* Stage Arrow */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ flex: 1, background: "#f1f5f9", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: 600, color: "#64748b", textAlign: "center", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>From</div>
                  {confirmMove.fromStageName}
                </div>
                <div style={{ fontSize: "20px", color: "#f20c32", flexShrink: 0 }}>→</div>
                <div style={{ flex: 1, background: "linear-gradient(135deg, #fef2f2, #fee2e2)", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: 700, color: "#dc2626", textAlign: "center", border: "1px solid #fecaca" }}>
                  <div style={{ fontSize: "10px", color: "#f87171", marginBottom: "2px" }}>To</div>
                  {confirmMove.toStageName}
                </div>
              </div>

              {/* Warning text */}
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
               
                <span style={{ fontSize: "12px", color: "#92400e", lineHeight: 1.5 }}>
                  Once moved to <strong>{confirmMove.toStageName}</strong>, the lead cannot be returned to a previous stage.
                  The customer will be notified of this stage change.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: "0 24px 24px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => setConfirmMove(null)}
                style={{ flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: 600, color: "#374151", background: "white", cursor: "pointer", transition: "all 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                onMouseOut={(e)  => { e.currentTarget.style.background = "white"; }}
              >
                No, Cancel
              </button>
              <button
                onClick={() => { if (confirmMove) { executeStatusUpdate(confirmMove.card, confirmMove.toStatus); setConfirmMove(null); } }}
                style={{ flex: 1, padding: "12px", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, color: "white", background: "linear-gradient(135deg, #f20c32 0%, #c20028 100%)", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(242,12,50,0.3)" }}
                onMouseOver={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                onMouseOut={(e)  => { e.currentTarget.style.opacity = "1"; }}
              >
                Yes, Move to Next Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Email Modal ── */}
      {emailModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", width: "90%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={handleEmailModalClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", margin: 0 }}>Send Email</h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>Send an email to {emailModal.leadName}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[{ label: "To", key: "to", type: "email" }, { label: "Subject", key: "subject", type: "text" }].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>{label}</label>
                  <input type={type} value={(emailForm as any)[key]} onChange={(e) => setEmailForm({ ...emailForm, [key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Message</label>
                <textarea value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} rows={6} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={handleEmailModalClose} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: 600, color: "#374151", background: "white", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleEmailSend} disabled={isEmailSending} style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, color: "white", background: isEmailSending ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", cursor: isEmailSending ? "not-allowed" : "pointer", opacity: isEmailSending ? 0.7 : 1 }}>
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
            <button onClick={handleCallModalClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", margin: 0 }}>Text Message</h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>Send a text message to {callModal.leadName}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Phone Number</label>
                <input type="tel" value={callForm.phone} onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Message</label>
                <textarea value={callForm.message} onChange={(e) => setCallForm({ ...callForm, message: e.target.value })} rows={6} style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={handleCallModalClose} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: 600, color: "#374151", background: "white", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleCallSend} disabled={isCallSending} style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, color: "white", background: isCallSending ? "#9ca3af" : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", cursor: isCallSending ? "not-allowed" : "pointer", opacity: isCallSending ? 0.7 : 1 }}>
                  {isCallSending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


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
// import { TbEyeShare } from "react-icons/tb";
// import React from "react";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { leadListNew, kanbanDragnDrop } from "../../Reducer/AddSlice";
// import axios from "axios";

// export function KanbanBoard() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { leadListNewData, leadListNewLoading } = useSelector((state: any) => state.add);

//   const [leadData, setLeadData] = useState<any[]>([]);

//   const [emailModal, setEmailModal] = useState<{
//     isOpen: boolean;
//     leadEmail: string;
//     leadName: string;
//   }>({ isOpen: false, leadEmail: "", leadName: "" });

//   const [emailForm, setEmailForm] = useState({
//     to: "",
//     subject: "",
//     message: "",
//   });

//   const [callModal, setCallModal] = useState<{
//     isOpen: boolean;
//     phoneNumber: string;
//     leadName: string;
//   }>({ isOpen: false, phoneNumber: "", leadName: "" });

//   const [callForm, setCallForm] = useState({
//     phone: "",
//     message: "",
//   });

//   const [isEmailSending, setIsEmailSending] = useState(false);
//   const [isCallSending, setIsCallSending] = useState(false);

//   // Fixed status name -> id map
//   const statusNameToId: { [key: string]: number } = {
//     "Sample Submitted": 1,
//     "Artwork digitized": 2,
//     "Sample Shipped": 3,
//     "Sample Delivered": 4,
//     "Warm Lead": 5,
//     "Cold Lead": 6,
//     "Bulk Order": 7,
//   };

//   // Fixed columns
//   const columns = [
//     { headerText: "Sample Submitted", keyField: "Sample Submitted" },
//     { headerText: "Artwork digitized", keyField: "Artwork digitized" },
//     { headerText: "Sample Shipped", keyField: "Sample Shipped" },
//     { headerText: "Sample Delivered", keyField: "Sample Delivered" },
//     { headerText: "Warm Lead", keyField: "Warm Lead" },
//     { headerText: "Cold Lead", keyField: "Cold Lead" },
//     { headerText: "Bulk Order", keyField: "Bulk Order" },
//   ];

//   // Fetch leads
//   useEffect(() => {
//     dispatch(leadListNew() as any);
//   }, [dispatch]);

//   // Transform API data to Kanban card format
//   useEffect(() => {
//     const leads = leadListNewData?.data;
//     if (!Array.isArray(leads)) return;

//     const cards = leads.map((lead: any) => ({
//       Id: String(lead?.id ?? ""),
//       Title: lead?.name || "Untitled",
//       Status: "Sample Submitted", // default status since new API doesn't return status
//       Summary: "No summary available",
//       Company: lead?.companyName || "No Company",
//       Email: lead?.email || "",
//       Phone: lead?.phone || "",
//       Industry: lead?.industry || "",
//       Assignee: "Unassigned",
//       LeadStatusId: 1,
//       HatsUsage: "",
//       PastIssues: "",
//       MostImportant: "",
//     }));

//     setLeadData(cards);
//   }, [leadListNewData]);

//   // Remove Syncfusion license error banner
//   useEffect(() => {
//     const interval = setInterval(() => {
//       document
//         .querySelectorAll(".syncfusion-license-error")
//         .forEach((el) => el.remove());
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   // Drag and drop handler
//   function onDragStop(args: any) {
//     const cardData = Array.isArray(args.data) ? args.data[0] : args.data;
//     if (!cardData) return;

//     const originalLead = leadData.find(
//       (x) => String(x.Id) === String(cardData.Id)
//     );
//     if (!originalLead) return;

//     if (originalLead.Status !== cardData.Status) {
//       const newStatusId = statusNameToId[cardData.Status];

//       if (!newStatusId) {
//         toast.error(`No status id found for: ${cardData.Status}`);
//         return;
//       }

//       const payload = {
//         lead_id: String(cardData.Id),
//         lead_status_id: Number(newStatusId),
//       };

//       (dispatch as any)(kanbanDragnDrop(payload as any))
//         .unwrap()
//         .then((res: any) => {
//           toast.success(res.message || "Status updated successfully");
//           dispatch(leadListNew() as any);
//         })
//         .catch((err: any) => {
//           console.error(err);
//           toast.error("Failed to update status");
//         });
//     }
//   }

//   // Email handlers
//   const handleEmailClick = (leadEmail: string, leadName: string) => {
//     setEmailModal({ isOpen: true, leadEmail, leadName });
//     setEmailForm({
//       to: leadEmail,
//       subject: `Follow up - ${leadName}`,
//       message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`,
//     });
//   };

//   const handleEmailSend = () => {
//     if (
//       !emailForm.to.trim() ||
//       !emailForm.subject.trim() ||
//       !emailForm.message.trim()
//     ) {
//       toast.error("Please fill in all fields.");
//       return;
//     }
//     setIsEmailSending(true);
//     const payload = {
//       reciepent: emailForm.to,
//       sender: "noreply@company.com",
//       subject: emailForm.subject,
//       replyBody: emailForm.message,
//     };
//     axios
//       .post("https://n8n.bestworks.cloud/webhook/email-sender", payload)
//       .then((res) => {
//         if (res.status === 200) {
//           toast.success("Email Sent Successfully!");
//           setEmailModal({ isOpen: false, leadEmail: "", leadName: "" });
//           setEmailForm({ to: "", subject: "", message: "" });
//         } else {
//           toast.error("Failed to send email. Please try again.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error sending email:", err);
//         toast.error("An error occurred while sending the email.");
//       })
//       .finally(() => setIsEmailSending(false));
//   };

//   const handleEmailModalClose = () => {
//     setEmailModal({ isOpen: false, leadEmail: "", leadName: "" });
//     setEmailForm({ to: "", subject: "", message: "" });
//   };

//   // Call/Text handlers
//   const handleCallClick = (phoneNumber: string, leadName: string) => {
//     setCallModal({ isOpen: true, phoneNumber, leadName });
//     setCallForm({
//       phone: phoneNumber,
//       message: `Hi ${leadName},\n\nI hope this call finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`,
//     });
//   };

//   const handleCallSend = () => {
//     if (!callForm.phone.trim() || !callForm.message.trim()) {
//       toast.error("Please fill in all fields.");
//       return;
//     }
//     setIsCallSending(true);
//     setTimeout(() => {
//       toast.success("Call message sent successfully!");
//       setCallModal({ isOpen: false, phoneNumber: "", leadName: "" });
//       setCallForm({ phone: "", message: "" });
//       setIsCallSending(false);
//     }, 2000);
//   };

//   const handleCallModalClose = () => {
//     setCallModal({ isOpen: false, phoneNumber: "", leadName: "" });
//     setCallForm({ phone: "", message: "" });
//   };

//   // View lead
//   const handleViewLead = (leadId: string) => {
//     navigate(`/lead-details/${leadId}`);
//   };

//   // Card template
//   const cardTemplate = (props: any) => {
//     return (
//       <div
//         className="e-card-content"
//         style={{
//           background: "#ffffff",
//           border: "1px solid #e2e8f0",
//           borderRadius: "10px",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
//           marginTop: "6px",
//           marginBottom: "6px",
//           cursor: "pointer",
//           width: "100%",
//           overflow: "hidden",
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             padding: "12px 12px 6px 12px",
//             position: "relative",
//           }}
//         >
//           {/* Avatar */}
//           <div
//             style={{
//               width: "34px",
//               height: "34px",
//               borderRadius: "9999px",
//               background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               flex: "0 0 34px",
//             }}
//           >
//             <svg
//               width="15"
//               height="15"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//           </div>

//           {/* Name + Company */}
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div
//               style={{
//                 fontWeight: 600,
//                 fontSize: "14px",
//                 color: "#111827",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {props.Title || "Untitled"}
//             </div>
//             <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.1 }}>
//               {props.Company || "No Company"}
//             </div>
//           </div>

//           {/* View button */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleViewLead(props.Id);
//             }}
//             style={{
//               width: "26px",
//               height: "26px",
//               borderRadius: "9999px",
//               background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//               border: "none",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               flex: "0 0 26px",
//               cursor: "pointer",
//             }}
//           >
//             <TbEyeShare size={13} />
//           </button>
//         </div>

//         {/* BODY */}
//         <div style={{ padding: "6px 12px 12px 12px" }}>
//           {/* Email */}
//           <div
//             style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
//           >
//             <svg
//               style={{
//                 width: "13px",
//                 height: "13px",
//                 marginRight: "5px",
//                 color: "#6b7280",
//               }}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//               />
//             </svg>
//             <span
//               style={{
//                 fontSize: "12px",
//                 color: "#374151",
//                 fontWeight: 500,
//                 wordBreak: "break-all",
//               }}
//             >
//               {props.Email || "No email provided"}
//             </span>
//           </div>

//           {/* Phone */}
//           <div
//             style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
//           >
//             <svg
//               style={{
//                 width: "13px",
//                 height: "13px",
//                 marginRight: "5px",
//                 color: "#6b7280",
//               }}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//               />
//             </svg>
//             <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>
//               {props.Phone || "No phone provided"}
//             </span>
//           </div>

//           <hr
//             style={{
//               border: "none",
//               borderTop: "1px solid #e5e7eb",
//               margin: "8px 0",
//             }}
//           />

//           {/* Action buttons */}
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEmailClick(props.Email, props.Title);
//               }}
//               style={{
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 padding: "6px 8px",
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 flex: 1,
//                 cursor: "pointer",
//               }}
//             >
//               Email
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleCallClick(props.Phone, props.Title);
//               }}
//               style={{
//                 background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 padding: "6px 8px",
//                 fontSize: "12px",
//                 fontWeight: 600,
//                 flex: 1,
//                 cursor: "pointer",
//               }}
//             >
//               Text
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={{ padding: "5px", backgroundColor: "#fff" }}>
//       <div
//         style={{
//           overflowX: "auto",
//           width: "100%",
//           whiteSpace: "nowrap",
//           padding: "10px 0",
//         }}
//       >
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

//         {leadListNewLoading ? (
//           <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
//             Loading...
//           </div>
//         ) : (
//           <KanbanComponent
//             id="kanban"
//             keyField="Status"
//             dataSource={leadData}
//             dragStop={onDragStop}
//             cardSettings={{
//               contentField: "Summary",
//               headerField: "Title",
//               template: cardTemplate,
//             }}
//             style={{ width: "100%", minWidth: "2000px" }}
//           >
//             <ColumnsDirective>
//               {columns.map(({ headerText, keyField }) => (
//                 <ColumnDirective
//                   key={keyField}
//                   headerText={headerText}
//                   keyField={keyField}
//                 />
//               ))}
//             </ColumnsDirective>
//           </KanbanComponent>
//         )}
//       </div>

//       {/* ── Email Modal ── */}
//       {emailModal.isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             backdropFilter: "blur(4px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               borderRadius: "12px",
//               padding: "24px",
//               width: "90%",
//               maxWidth: "500px",
//               boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={handleEmailModalClose}
//               style={{
//                 position: "absolute", top: "16px", right: "16px",
//                 background: "none", border: "none",
//                 fontSize: "24px", cursor: "pointer", color: "#6b7280",
//               }}
//             >
//               ×
//             </button>

//             <div style={{ marginBottom: "20px" }}>
//               <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", margin: 0 }}>
//                 Send Email
//               </h2>
//               <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
//                 Send an email to {emailModal.leadName}
//               </p>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               {[
//                 { label: "To", key: "to", type: "email" },
//                 { label: "Subject", key: "subject", type: "text" },
//               ].map(({ label, key, type }) => (
//                 <div key={key}>
//                   <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
//                     {label}
//                   </label>
//                   <input
//                     type={type}
//                     value={(emailForm as any)[key]}
//                     onChange={(e) => setEmailForm({ ...emailForm, [key]: e.target.value })}
//                     style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none" }}
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
//                   Message
//                 </label>
//                 <textarea
//                   value={emailForm.message}
//                   onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
//                   rows={6}
//                   style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical" }}
//                 />
//               </div>

//               <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
//                 <button
//                   onClick={handleEmailModalClose}
//                   style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: 600, color: "#374151", background: "white", cursor: "pointer" }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEmailSend}
//                   disabled={isEmailSending}
//                   style={{
//                     padding: "10px 20px", border: "none", borderRadius: "6px",
//                     fontSize: "14px", fontWeight: 600, color: "white",
//                     background: isEmailSending ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     cursor: isEmailSending ? "not-allowed" : "pointer",
//                     opacity: isEmailSending ? 0.7 : 1,
//                   }}
//                 >
//                   {isEmailSending ? "Sending..." : "Send Email"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Call/Text Modal ── */}
//       {callModal.isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             backdropFilter: "blur(4px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               borderRadius: "12px",
//               padding: "24px",
//               width: "90%",
//               maxWidth: "500px",
//               boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={handleCallModalClose}
//               style={{
//                 position: "absolute", top: "16px", right: "16px",
//                 background: "none", border: "none",
//                 fontSize: "24px", cursor: "pointer", color: "#6b7280",
//               }}
//             >
//               ×
//             </button>

//             <div style={{ marginBottom: "20px" }}>
//               <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", margin: 0 }}>
//                 Text Message
//               </h2>
//               <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
//                 Send a text message to {callModal.leadName}
//               </p>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={callForm.phone}
//                   onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
//                   style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none" }}
//                 />
//               </div>

//               <div>
//                 <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
//                   Message
//                 </label>
//                 <textarea
//                   value={callForm.message}
//                   onChange={(e) => setCallForm({ ...callForm, message: e.target.value })}
//                   rows={6}
//                   style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "vertical" }}
//                 />
//               </div>

//               <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
//                 <button
//                   onClick={handleCallModalClose}
//                   style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: 600, color: "#374151", background: "white", cursor: "pointer" }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCallSend}
//                   disabled={isCallSending}
//                   style={{
//                     padding: "10px 20px", border: "none", borderRadius: "6px",
//                     fontSize: "14px", fontWeight: 600, color: "white",
//                     background: isCallSending ? "#9ca3af" : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//                     cursor: isCallSending ? "not-allowed" : "pointer",
//                     opacity: isCallSending ? 0.7 : 1,
//                   }}
//                 >
//                   {isCallSending ? "Sending..." : "Send Message"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
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
// import { TbEyeShare  } from "react-icons/tb";
// import React from "react";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { kanbanList, kanbanDragnDrop } from "../../Reducer/AddSlice";
// import axios from "axios";

// export function KanbanBoard() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { kanbanListData, loading } = useSelector((state: any) => state.add);

//   const [leadData, setLeadData] = useState<any[]>([]);
//   const [kanbanWidth, setkanbanWidth] = useState<number>(0);
//   const [emailModal, setEmailModal] = useState<{isOpen: boolean, leadEmail: string, leadName: string}>({
//     isOpen: false,
//     leadEmail: '',
//     leadName: ''
//   });
//   const [emailForm, setEmailForm] = useState({
//     to: '',
//     subject: '',
//     message: ''
//   });
//   const [callModal, setCallModal] = useState<{isOpen: boolean, phoneNumber: string, leadName: string}>({
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

//   // Fetch lead data using Redux
//   useEffect(() => {
//     dispatch(kanbanList() as any);
//   }, [dispatch]);

//   // Transform kanbanListData to Kanban format
//   const [statusNameToId, setStatusNameToId] = useState({});

//   useEffect(() => {
//     const cols = kanbanListData?.data?.columns;
//     if (!Array.isArray(cols)) return;
  
//     // statusName -> statusId map
//     const statusMap = cols.reduce((acc, col) => {
//       const name = col?.status?.name;
//       const id = col?.status?.id;
//       if (name && id) acc[name] = Number(id);
//       return acc;
//     }, {});
//     setStatusNameToId(statusMap);
  
//     // helper for array/object/string
//     const normalizeMulti = (val, key) => {
//       if (!val) return "";
//       if (Array.isArray(val)) {
//         return val.map(x => (x && typeof x === "object" ? x[key] : x)).filter(Boolean).join(", ");
//       }
//       if (typeof val === "object") return val[key] || "";
//       return String(val);
//     };
  
//     // Flatten all leads across columns
//     const cards = cols.flatMap((col) => {
//       const statusName = col?.status?.name || "New Lead";
//       const statusId = col?.status?.id ? Number(col.status.id) : null;
//       const leads = Array.isArray(col?.leads) ? col.leads : [];
  
//       return leads.map((lead) => ({
//         Id: String(lead?.id ?? ""),
//         Title: lead?.name || "Untitled",
//         Status: statusName,                 // MUST match ColumnDirective keyField
//         Summary: lead?.notes || "No summary available",
  
//         Company: lead?.company_name || "No Company",
//         Email: lead?.email || "",
//         Phone: lead?.phone || "",
//         Industry: lead?.industry || "",
//         Assignee: lead?.rep?.name || "Unassigned",
  
//         // store current status id (useful if needed later)
//         LeadStatusId: statusId ?? Number(lead?.lead_status_id ?? 0),
  
//         HatsUsage: normalizeMulti(lead?.hats_usage, "hats_usage"),
//         PastIssues: normalizeMulti(lead?.past_headwear_issues, "past_headwear_issues"),
//         MostImportant: normalizeMulti(lead?.what_most_important, "what_most_important"),
//       }));
//     });
  
//     setLeadData(cards);
//   }, [kanbanListData]);
  

//   // Remove license error
//   useEffect(() => {
//     const interval = setInterval(() => {
//       document.querySelectorAll('.syncfusion-license-error').forEach(el => el.remove());
//     }, 500);
  
//     return () => clearInterval(interval);
//   }, []);
  

// const handleStatusUpdate = (leadInfo: { id: string; lead_status_id: number }) => {
//   console.log("trigger", leadInfo);
//   const payload: any = { 
//     lead_id: leadInfo.id, 
//     lead_status_id: leadInfo.lead_status_id 
//   };
//   (dispatch as any)(kanbanDragnDrop(payload))
//     .unwrap()
//     .then((res:any) => {
//       toast.success(res.message);
//       // Refresh kanban list after successful update
//       (dispatch as any)(kanbanList());
//     })
//     .catch((error: any) => {
//       console.error("Error updating status", error);
//       toast.error("Failed to update status. Please try again.");
//     });
// };

// // Email handler functions
// const handleEmailClick = (leadEmail: string, leadName: string) => {
//   setEmailModal({
//     isOpen: true,
//     leadEmail,
//     leadName
//   });
//   setEmailForm({
//     to: leadEmail,
//     subject: `Follow up - ${leadName}`,
//     message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`
//   });
// };

// const handleEmailSend = () => {
//   if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) {
//     toast.error('Please fill in all fields.');
//     return;
//   }

//   setIsEmailSending(true);
//   const payload = {
//     reciepent: emailForm.to,
//     sender: 'noreply@company.com', // You can replace this with actual sender email
//     subject: emailForm.subject,
//     replyBody: emailForm.message,
//   };

//   axios.post('https://n8n.bestworks.cloud/webhook/email-sender', payload)
//     .then(res => {
//       if (res.status === 200) {
//         toast.success('Email Sent Successfully!');
//         setEmailModal({ isOpen: false, leadEmail: '', leadName: '' });
//         setEmailForm({ to: '', subject: '', message: '' });
//       } else {
//         toast.error('Failed to send email. Please try again.');
//       }
//     })
//     .catch(err => {
//       console.error("Error sending email:", err);
//       toast.error('An error occurred while sending the email.');
//     })
//     .finally(() => {
//       setIsEmailSending(false);
//     });
// };

// const handleEmailModalClose = () => {
//   setEmailModal({ isOpen: false, leadEmail: '', leadName: '' });
//   setEmailForm({ to: '', subject: '', message: '' });
// };

// // Call modal handler functions
// const handleCallClick = (phoneNumber: string, leadName: string) => {
//   setCallModal({
//     isOpen: true,
//     phoneNumber,
//     leadName
//   });
//   setCallForm({
//     phone: phoneNumber,
//     message: `Hi ${leadName},\n\nI hope this call finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`
//   });
// };

// const handleCallSend = () => {
//   if (!callForm.phone.trim() || !callForm.message.trim()) {
//     toast.error('Please fill in all fields.');
//     return;
//   }

//   setIsCallSending(true);
//   // Sample handler function - you can replace this with actual API call
//   console.log("Sending call message:", callForm);
  
//   // Simulate API call
//   setTimeout(() => {
//     toast.success("Call message sent successfully!");
//     setCallModal({ isOpen: false, phoneNumber: '', leadName: '' });
//     setCallForm({ phone: '', message: '' });
//     setIsCallSending(false);
//   }, 2000);
// };

// const handleCallModalClose = () => {
//   setCallModal({ isOpen: false, phoneNumber: '', leadName: '' });
//   setCallForm({ phone: '', message: '' });
// };

// // View lead handler function
// const handleViewLead = (leadId: string) => {
//   navigate(`/lead-details/${leadId}`);
// };
//   // Prevent incorrect drags
//   // function onDragStart(args: any) {
//   //   if (args.data.Status === "Closed Won" || args.data.Status === "Closed Lost") {
//   //     args.cancel = true;
//   //   }
//   // }

//   function onDragStop(args: any) {
//     const cardData = Array.isArray(args.data) ? args.data[0] : args.data;
//     if (!cardData) return;
  
//     const originalLead = leadData.find((x) => String(x.Id) === String(cardData.Id));
//     if (!originalLead) return;
  
//     // status changed?
//     if (originalLead.Status !== cardData.Status) {
//       const newStatusId = statusNameToId?.[cardData.Status];
  
//       if (!newStatusId) {
//         toast.error(`No status id found for: ${cardData.Status}`);
//         return;
//       }
  
//       // ✅ YOUR REQUIRED PAYLOAD FORMAT
//       const payload = {
//         lead_id: String(cardData.Id),
//         lead_status_id: Number(newStatusId),
//       };
  
//       (dispatch as any)(kanbanDragnDrop(payload as any))
//         .unwrap()
//         .then((res:any) => {
//           toast.success(res.message);
//           (dispatch as any)(kanbanList());
//         })
//         .catch((err:any) => {
//           console.error(err);
//           toast.error("Failed to update status");
//         });
//     }
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
//           marginTop: '6px',
//           marginBottom: '6px',
//           cursor: 'pointer',
//           width: '100%',
//           overflow: 'hidden'
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px',
//             padding: '12px 12px 6px 12px',   // start at 12px from left
//             position: 'relative'
//           }}
//         >
//           {/* avatar */}
//           <div
//             style={{
//               width: '34px',
//               height: '34px',
//               borderRadius: '9999px',
//               background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#fff',
//               flex: '0 0 34px'
//             }}
//           >
//             <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </div>
  
//           {/* name + subtitle */}
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div
//               style={{
//                 fontWeight: 600,
//                 fontSize: '14px',
//                 color: '#111827',
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis'
//               }}
//             >
//               {props.Title || 'Untitled'}
//             </div>
//             <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.1 }}>
//               {props.Company || 'No Company'}
//             </div>
//           </div>
  
//           {/* view btn */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleViewLead(props.Id);
//             }}
//             style={{
//               width: '26px',
//               height: '26px',
//               borderRadius: '9999px',
//               background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//               border: 'none',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#fff',
//               flex: '0 0 26px',
//               cursor: 'pointer'
//             }}
//           >
//             <TbEyeShare size={13} />
//           </button>
//         </div>
  
//         {/* BODY */}
//         <div style={{ padding: '6px 12px 12px 12px' }}>
//           {/* email */}
//           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
//             <svg style={{ width: '13px', height: '13px', marginRight: '5px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//             <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500, wordBreak: 'break-all' }}>
//               {props.Email || 'No email provided'}
//             </span>
//           </div>
  
//           {/* phone */}
//           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
//             <svg style={{ width: '13px', height: '13px', marginRight: '5px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//             </svg>
//             <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>
//               {props.Phone || 'No phone provided'}
//             </span>
//           </div>
  
//           <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
  
//           <div style={{ display: 'flex', gap: '8px' }}>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEmailClick(props.Email, props.Title);
//               }}
//               style={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 padding: '6px 8px',
//                 fontSize: '12px',
//                 fontWeight: 600,
//                 flex: 1,
//                 cursor: 'pointer'
//               }}
//             >
//               Email
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleCallClick(props.Phone, props.Title);
//               }}
//               style={{
//                 background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 padding: '6px 8px',
//                 fontSize: '12px',
//                 fontWeight: 600,
//                 flex: 1,
//                 cursor: 'pointer'
//               }}
//             >
//               Text
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
  

// //   const columns = [
// //   { headerText: "🆕 Sample Submitted", keyField: "Sample Submitted" },
// //   { headerText: "🎨Sample Art Approved", keyField: "Sample Art Approved" },
// //   // { headerText: "👌Artwork Submitted", keyField: "Artwork Submitted" },
// //   // { headerText: "📦 Sample Submitted", keyField: "Sample Sent" },
// //   { headerText: "🚚 Sample Shipped", keyField: "Sample Shipped" },
// //   { headerText: "🎁 Sample Delivered", keyField: "Sample Delivered" },
// //   { headerText: "🔥 Warm Lead", keyField: "Warm Lead" },
// //   { headerText: "❄️ Cold Lead", keyField: "Cold Lead" }
// //   // { headerText: "📦 Bulk Order", keyField: "Bulk Order" },

// // ];

// const columns =
//   kanbanListData?.data?.columns?.map((c) => ({
//     headerText: c?.status?.name || "Unnamed",
//     keyField: c?.status?.name || "Unnamed",
//   })) || [];


//   return (
//     <div style={{ 
//       padding: '5px',
//       backgroundColor: '#fff'
//     }}>
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
//                   onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
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
//                   onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
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
//                   onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
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
//                   onChange={(e) => setCallForm({...callForm, phone: e.target.value})}
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
//                   onChange={(e) => setCallForm({...callForm, message: e.target.value})}
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
//     </div>
//   );
// }
