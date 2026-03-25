import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader";
import AddNoteModal from "./AddNoteModal";
import { useDispatch, useSelector } from "react-redux";
import { leadSingle } from "../../Reducer/AddSlice";
import {
  FaDollarSign,
  FaChartLine,
  FaShoppingCart,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaArrowLeft,
  FaImage,
  FaTag,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaHatCowboy,
  FaPalette,
  FaGlobe,
  FaUsers,
  FaClock,
  FaRedo,
  FaThumbsUp,
  FaTools,
  FaUserTie,
  FaMoneyBillWave,
  FaStickyNote,
} from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

// ─── Helper: detect which format the what_most_important object is ──────────
// Format A (new typeform): has keys like primaryUse, hatColors, brandApproach …
// Format B (old manual):   has keys like hats_usage (array of objects), what_most_important (array), past_headwear_issues (array)
const detectWmiFormat = (wmi) => {
  if (!wmi || typeof wmi !== "object") return null;
  const keys = Object.keys(wmi);
  if (
    keys.some((k) =>
      ["primaryUse", "brandApproach", "frustrations", "whySamples", "deliveryTiming"].includes(k)
    )
  )
    return "typeform";
  if (
    keys.some((k) =>
      ["hats_usage", "what_most_important", "past_headwear_issues", "role_in_company", "annual_merchandise_spend"].includes(k)
    )
  )
    return "manual";
  return "typeform"; // fallback
};

const SingleLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leadSingleData, loading } = useSelector((state) => state.add);
  const [leadData, setLeadData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailModal, setEmailModal] = useState({ isOpen: false, leadEmail: "", leadName: "" });
  const [emailForm, setEmailForm] = useState({ to: "", subject: "", message: "" });
  const [callModal, setCallModal] = useState({ isOpen: false, phoneNumber: "", leadName: "" });
  const [callForm, setCallForm] = useState({ phone: "", message: "" });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isCallSending, setIsCallSending] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const fetchLeadData = useCallback(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      dispatch(leadSingle(id));
    }
  }, [id, dispatch]);

  useEffect(() => { fetchLeadData(); }, [fetchLeadData]);

  useEffect(() => {
    if (leadSingleData?.data) {
      setLeadData(leadSingleData.data);
      setIsLoading(false);
      setError(null);
    }
    if (leadSingleData?.error) {
      setError("Failed to fetch lead data");
      toast.error("Failed to fetch lead data");
      setIsLoading(false);
    }
  }, [leadSingleData]);

  useEffect(() => { setIsLoading(loading); }, [loading]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const map = {
      "Sample Submitted": "bg-blue-100 text-blue-800 border-blue-200",
      "Sample Art Approved": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Sample Shipped": "bg-orange-100 text-orange-800 border-orange-200",
      "Sample Delivered": "bg-green-100 text-green-800 border-green-200",
      "Nurture Sequence": "bg-purple-100 text-purple-800 border-purple-200",
      "Warm Lead": "bg-red-100 text-red-800 border-red-200",
      "Cold Lead": "bg-pink-100 text-pink-800 border-pink-200",
    };
    return map[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    return [address.line1, address.line2, address.city, address.state, address.postal_code, address.country]
      .filter(Boolean).join(", ") || "N/A";
  };

  // ── Email handlers ─────────────────────────────────────────────────────────
  const handleEmailClick = (leadEmail, leadName) => {
    setEmailModal({ isOpen: true, leadEmail, leadName });
    setEmailForm({
      to: leadEmail,
      subject: `Follow up - ${leadName}`,
      message: `Hi ${leadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`,
    });
  };

  const handleEmailSend = () => {
    if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error("Please fill in all fields."); return;
    }
    setIsEmailSending(true);
    axios.post("https://n8n.bestworks.cloud/webhook/email-sender", {
      reciepent: emailForm.to,
      sender: "team@showmecustomapparel.com",
      subject: emailForm.subject,
      replyBody: emailForm.message,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Email Sent Successfully!");
          setEmailModal({ isOpen: false, leadEmail: "", leadName: "" });
          setEmailForm({ to: "", subject: "", message: "" });
        } else toast.error("Failed to send email. Please try again.");
      })
      .catch(() => toast.error("An error occurred while sending the email."))
      .finally(() => setIsEmailSending(false));
  };

  const handleEmailModalClose = () => {
    setEmailModal({ isOpen: false, leadEmail: "", leadName: "" });
    setEmailForm({ to: "", subject: "", message: "" });
  };

  // ── Call/Text handlers ─────────────────────────────────────────────────────
  const handleCallClick = (phoneNumber, leadName) => {
    setCallModal({ isOpen: true, phoneNumber, leadName });
    setCallForm({
      phone: phoneNumber,
      message: `Hi ${leadName},\n\nI hope this message finds you well. I wanted to follow up on our previous conversation...\n\nBest regards,`,
    });
  };

  const handleCallSend = () => {
    if (!callForm.phone.trim() || !callForm.message.trim()) {
      toast.error("Please fill in all fields."); return;
    }
    setIsCallSending(true);
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setCallModal({ isOpen: false, phoneNumber: "", leadName: "" });
      setCallForm({ phone: "", message: "" });
      setIsCallSending(false);
    }, 2000);
  };

  const handleCallModalClose = () => {
    setCallModal({ isOpen: false, phoneNumber: "", leadName: "" });
    setCallForm({ phone: "", message: "" });
  };

  // ── Tag badge helper ───────────────────────────────────────────────────────
  const Tag = ({ label, color = "gray" }) => {
    const colors = {
      red: "bg-red-50 border-red-200 text-red-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      green: "bg-green-50 border-green-200 text-green-700",
      yellow: "bg-yellow-50 border-yellow-300 text-yellow-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      gray: "bg-gray-100 border-gray-200 text-gray-700",
    };
    return (
      <span className={`px-3 py-1.5 border rounded-full text-sm font-medium capitalize ${colors[color]}`}>
        {label}
      </span>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Hat Preferences — TYPEFORM format (new leads)
  // ─────────────────────────────────────────────────────────────────────────
  const renderTypeformWmi = (wmi) => (
    <div className="space-y-5">
      {/* Row: Website / Industry / Team Size */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wmi.website && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <FaGlobe className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Website</p>
            </div>
            <p className="font-medium text-gray-800 text-sm break-all">{wmi.website}</p>
          </div>
        )}
        {wmi.industry && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <FaBuilding className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</p>
            </div>
            <p className="font-medium text-gray-800 text-sm capitalize">
              {wmi.industry}{wmi.industryOther ? ` — ${wmi.industryOther}` : ""}
            </p>
          </div>
        )}
        {wmi.teamSize && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <FaUsers className="w-4 h-4 text-green-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Size</p>
            </div>
            <p className="font-medium text-gray-800 text-sm">{wmi.teamSize}</p>
          </div>
        )}
      </div>

      {/* Hat Sizes */}
      {wmi.hatSizes && Object.keys(wmi.hatSizes).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaHatCowboy className="w-4 h-4 text-[#f20c32]" />
            <p className="text-sm font-semibold text-gray-700">Hat Sizes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(wmi.hatSizes).map(([hatId, size]) => (
              <div key={hatId} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs font-bold text-[#f20c32] mb-1">{hatId}</p>
                <p className="text-sm font-semibold text-gray-800">{size}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hat Colors */}
      {wmi.hatColors && Object.keys(wmi.hatColors).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaPalette className="w-4 h-4 text-[#f20c32]" />
            <p className="text-sm font-semibold text-gray-700">Selected Hat Colors</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(wmi.hatColors).map(([hatId, colorName]) => (
              <div key={hatId} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs font-bold text-[#f20c32] mb-1">{hatId}</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{colorName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Hats */}
      {Array.isArray(wmi.selectedHats) && wmi.selectedHats.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaHatCowboy className="w-4 h-4 text-[#f20c32]" />
            <p className="text-sm font-semibold text-gray-700">Selected Hat IDs</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wmi.selectedHats.map((hat, i) => <Tag key={i} label={String(hat)} color="red" />)}
          </div>
        </div>
      )}

      {/* Primary Use */}
      {Array.isArray(wmi.primaryUse) && wmi.primaryUse.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaCheckCircle className="w-4 h-4 text-[#f20c32]" />
            <p className="text-sm font-semibold text-gray-700">Primary Use</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wmi.primaryUse.map((use, i) => <Tag key={i} label={use.replace(/_/g, " ")} color="blue" />)}
          </div>
        </div>
      )}

      {/* Brand Approach */}
      {Array.isArray(wmi.brandApproach) && wmi.brandApproach.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="w-4 h-4 text-[#f20c32]" />
            <p className="text-sm font-semibold text-gray-700">Brand Approach</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wmi.brandApproach.map((b, i) => <Tag key={i} label={b.replace(/_/g, " ")} color="yellow" />)}
          </div>
        </div>
      )}

      {/* Frustrations */}
      {Array.isArray(wmi.frustrations) && wmi.frustrations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="w-4 h-4 text-[#f20c32]" />
            <p className="text-sm font-semibold text-gray-700">Frustrations</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wmi.frustrations.map((f, i) => <Tag key={i} label={f.replace(/_/g, " ")} color="orange" />)}
          </div>
        </div>
      )}

      {/* Why Samples */}
      {Array.isArray(wmi.whySamples) && wmi.whySamples.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaThumbsUp className="w-4 h-4 text-[#f20c32]" />
            <p className="text-sm font-semibold text-gray-700">Why Samples</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wmi.whySamples.map((w, i) => <Tag key={i} label={w.replace(/_/g, " ")} color="green" />)}
          </div>
        </div>
      )}

      {/* Delivery / Frequency / Budget row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wmi.deliveryTiming && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <FaClock className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Timing</p>
            </div>
            <p className="font-medium text-gray-800 text-sm capitalize">{wmi.deliveryTiming.replace(/_/g, " ")}</p>
          </div>
        )}
        {wmi.orderingFrequency && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <FaRedo className="w-4 h-4 text-teal-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ordering Frequency</p>
            </div>
            <p className="font-medium text-gray-800 text-sm">{wmi.orderingFrequency} / year</p>
          </div>
        )}
        {wmi.budgetApproval && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <FaDollarSign className="w-4 h-4 text-[#f20c32]" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget Approval</p>
            </div>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold capitalize
              ${wmi.budgetApproval === "approved" ? "bg-green-100 text-green-700 border border-green-300" :
                wmi.budgetApproval === "pending" ? "bg-yellow-100 text-yellow-700 border border-yellow-300" :
                "bg-red-100 text-red-700 border border-red-300"}`}>
              {wmi.budgetApproval.replace(/_/g, " ")}
            </span>
          </div>
        )}
      </div>

      {/* Logo */}
      {wmi.logo?.url && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaImage className="w-4 h-4 text-[#f20c32]" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Logo</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="border border-gray-200 rounded-lg bg-white p-2 shadow-sm">
              <img
                src={wmi.logo.url}
                alt="Lead Logo"
                className="h-24 w-auto object-contain rounded"
                onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              />
              <div style={{ display: "none" }} className="h-24 w-32 items-center justify-center text-gray-400 text-xs text-center">
                Image not available
              </div>
            </div>
            <a
              href={wmi.logo.url}
              download target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#f20c32] hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download Logo
            </a>
          </div>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Hat Preferences — MANUAL / OLD format
  // ─────────────────────────────────────────────────────────────────────────
  const renderManualWmi = (wmi) => {
    // Extract array items to strings
    const extractArr = (arr, key) =>
      Array.isArray(arr) ? arr.map((item) => (typeof item === "object" ? item[key] : item)).filter(Boolean) : [];

    const hatsUsage = extractArr(wmi.hats_usage, "hats_usage");
    const whatImportant = extractArr(wmi.what_most_important, "what_most_important");
    const pastIssues = extractArr(wmi.past_headwear_issues, "past_headwear_issues");

    return (
      <div className="space-y-5">

        {/* Info row: Role / Annual Spend / Industry / Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wmi.role_in_company && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUserTie className="w-4 h-4 text-purple-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role in Company</p>
              </div>
              <p className="font-medium text-gray-800 text-sm capitalize">{wmi.role_in_company}</p>
            </div>
          )}
          {wmi.annual_merchandise_spend && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaMoneyBillWave className="w-4 h-4 text-green-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Annual Merchandise Spend</p>
              </div>
              <p className="font-medium text-gray-800 text-sm">${wmi.annual_merchandise_spend}</p>
            </div>
          )}
          {wmi.industry && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaBuilding className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</p>
              </div>
              <p className="font-medium text-gray-800 text-sm capitalize">{wmi.industry}</p>
            </div>
          )}
          {wmi.region_tag && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Region</p>
              </div>
              <p className="font-medium text-gray-800 text-sm capitalize">{wmi.region_tag}</p>
            </div>
          )}
        </div>

        {/* Hats Usage */}
        {hatsUsage.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaHatCowboy className="w-4 h-4 text-[#f20c32]" />
              <p className="text-sm font-semibold text-gray-700">Hats Usage</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {hatsUsage.map((item, i) => <Tag key={i} label={item} color="blue" />)}
            </div>
          </div>
        )}

        {/* What's Most Important */}
        {whatImportant.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaStar className="w-4 h-4 text-[#f20c32]" />
              <p className="text-sm font-semibold text-gray-700">What&apos;s Most Important</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {whatImportant.map((item, i) => <Tag key={i} label={item} color="yellow" />)}
            </div>
          </div>
        )}

        {/* Past Headwear Issues */}
        {pastIssues.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaExclamationTriangle className="w-4 h-4 text-[#f20c32]" />
              <p className="text-sm font-semibold text-gray-700">Past Headwear Issues</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {pastIssues.map((item, i) => <Tag key={i} label={item} color="orange" />)}
            </div>
          </div>
        )}

        {/* Notes from wmi */}
        {wmi.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaStickyNote className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Survey Notes</p>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{wmi.notes}</p>
          </div>
        )}

        {/* Marketing Consent badge */}
        {typeof wmi.marketing_consent === "boolean" && (
          <div className="flex items-center gap-3">
            <FaCheckCircle className={`w-4 h-4 ${wmi.marketing_consent ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-sm text-gray-700">
              Marketing Consent:{" "}
              <span className={`font-semibold ${wmi.marketing_consent ? "text-green-600" : "text-gray-500"}`}>
                {wmi.marketing_consent ? "Yes" : "No"}
              </span>
            </span>
          </div>
        )}

        {/* Logo if present */}
        {wmi.logo?.url && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaImage className="w-4 h-4 text-[#f20c32]" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Logo</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="border border-gray-200 rounded-lg bg-white p-2 shadow-sm">
                <img src={wmi.logo.url} alt="Lead Logo" className="h-24 w-auto object-contain rounded"
                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                <div style={{ display: "none" }} className="h-24 w-32 items-center justify-center text-gray-400 text-xs text-center">
                  Image not available
                </div>
              </div>
              <a href={wmi.logo.url} download target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#f20c32] hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Logo
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Modal styles shared ───────────────────────────────────────────────────
  const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
  const modalBox = { backgroundColor: "white", borderRadius: "12px", padding: "24px", width: "90%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative" };
  const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", outline: "none" };
  const labelStyle = { display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" };
  const cancelBtnStyle = { padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#374151", background: "white", cursor: "pointer" };

  // ─── Loading / Error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading Lead Details..." />
      </div>
    );
  }

  if (error || !leadData) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Lead</h2>
          <p className="text-gray-600 mb-4">{error || "Lead not found"}</p>
          <button onClick={() => navigate("/leads")} className="bg-[#f20c32] hover:bg-black px-4 py-2 text-white rounded-md">
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const wmi = leadData?.what_most_important || {};
  const wmiFormat = detectWmiFormat(wmi);
  const hasWmi = wmi && Object.keys(wmi).length > 0;

  return (
    <>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="h-full">

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate("/leads")} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <FaArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{leadData?.name || "Lead Details"}</h1>
                <p className="text-gray-600">Lead ID: {leadData?.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpenNoteModal(true)}
                className="bg-[#10B981] hover:bg-[#059669] px-4 py-2 text-white text-sm font-semibold flex justify-center items-center rounded-md transition-colors"
              >
                Add Note
              </button>
              <div className={`px-4 py-2 rounded-full border ${getStatusColor(leadData?.lead_status?.name)}`}>
                <span className="font-semibold">{leadData?.lead_status?.name || "Unknown Status"}</span>
              </div>
            </div>
          </div>

          {/* ── Main Grid ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUser className="w-5 h-5 mr-2 text-[#f20c32]" /> Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <div><p className="text-sm text-gray-600">Email</p><p className="font-medium">{leadData?.email || "N/A"}</p></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <div><p className="text-sm text-gray-600">Phone</p><p className="font-medium">{leadData?.phone || "N/A"}</p></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaBuilding className="w-4 h-4 text-gray-400" />
                    <div><p className="text-sm text-gray-600">Company</p><p className="font-medium">{leadData?.company_name || "N/A"}</p></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <div><p className="text-sm text-gray-600">Primary Address</p><p className="font-medium">{formatAddress(leadData?.primary_address)}</p></div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMapMarkerAlt className="w-5 h-5 mr-2 text-[#f20c32]" /> Address Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Primary Address</h3>
                    {leadData?.primary_address ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">{leadData.primary_address.line1}</p>
                        {leadData.primary_address.line2 && <p className="text-sm text-gray-600">{leadData.primary_address.line2}</p>}
                        <p className="text-sm text-gray-600">
                          {[leadData.primary_address.city, leadData.primary_address.state, leadData.primary_address.postal_code].filter(Boolean).join(", ")}
                        </p>
                        <p className="text-sm text-gray-600">{leadData.primary_address.country}</p>
                      </div>
                    ) : <p className="text-gray-500">N/A</p>}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Shipping Address</h3>
                    {leadData?.shipping_address ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">{leadData.shipping_address.line1}</p>
                        {leadData.shipping_address.line2 && <p className="text-sm text-gray-600">{leadData.shipping_address.line2}</p>}
                        <p className="text-sm text-gray-600">
                          {[leadData.shipping_address.city, leadData.shipping_address.state, leadData.shipping_address.postal_code].filter(Boolean).join(", ")}
                        </p>
                        <p className="text-sm text-gray-600">{leadData.shipping_address.country}</p>
                      </div>
                    ) : <p className="text-gray-500">N/A</p>}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {leadData?.notes && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <IoDocumentTextOutline className="w-5 h-5 mr-2 text-[#f20c32]" /> Notes
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{leadData.notes}</p>
                  </div>
                </div>
              )}

              {/* ── Hat Preferences & Survey Details ── */}
              {hasWmi && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
                    <FaHatCowboy className="w-5 h-5 mr-2 text-[#f20c32]" />
                    Hat Preferences &amp; Survey Details
                    {/* Format badge */}
                    <span className={`ml-3 text-xs px-2 py-0.5 rounded-full font-normal ${
                      wmiFormat === "typeform"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                    }`}>
                      {wmiFormat === "typeform" ? "Typeform" : "Manual Entry"}
                    </span>
                  </h2>

                  {wmiFormat === "typeform"
                    ? renderTypeformWmi(wmi)
                    : renderManualWmi(wmi)}
                </div>
              )}

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

              {/* Communication */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaEnvelope className="w-5 h-5 mr-2 text-[#f20c32]" /> Communication
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEmailClick(leadData?.email, leadData?.name)}
                    style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", color: "white", border: "none", borderRadius: "8px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 8px rgba(102,126,234,.3)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <FaEnvelope className="w-4 h-4" /> Email
                  </button>
                  <button
                    onClick={() => handleCallClick(leadData?.phone, leadData?.name)}
                    style={{ background: "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)", color: "white", border: "none", borderRadius: "8px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 8px rgba(240,147,251,.3)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <IoDocumentTextOutline className="w-4 h-4" /> Text
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCalendarAlt className="w-5 h-5 mr-2 text-[#f20c32]" /> Timeline
                </h2>
                <div className="space-y-4">
                  {[
                    { color: "bg-purple-500", label: "Typeform Date", value: formatDate(leadData?.typeform_date) },
                    { color: "bg-blue-500", label: "Created At", value: formatDate(leadData?.created_at) },
                    { color: "bg-green-500", label: "Last Updated", value: formatDate(leadData?.updated_at) },
                  ].map(({ color, label, value }) => (
                    <div key={label} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${color} rounded-full`}></div>
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-gray-600">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Rep */}
              {leadData?.rep && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="w-5 h-5 mr-2 text-[#f20c32]" /> Assigned Representative
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: "Name", value: leadData.rep.name, color: "text-blue-600" },
                      { label: "Email", value: leadData.rep.email, color: "text-green-600" },
                      { label: "Phone", value: leadData.rep.phone, color: "text-purple-600" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className={`font-semibold ${color}`}>{value}</span>
                      </div>
                    ))}
                    {leadData.rep.address && (
                      <div>
                        <span className="text-sm text-gray-600">Address</span>
                        <p className="font-medium text-sm mt-1">{formatAddress(leadData.rep.address)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Email Modal ────────────────────────────────────────────────────── */}
      {emailModal.isOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <button onClick={handleEmailModalClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Send Email</h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0" }}>Send an email to {emailModal.leadName}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[{ label: "To", key: "to", type: "email" }, { label: "Subject", key: "subject", type: "text" }].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={emailForm[key]} onChange={(e) => setEmailForm({ ...emailForm, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Message</label>
                <textarea value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} rows={6} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={handleEmailModalClose} style={cancelBtnStyle}>Cancel</button>
                <button onClick={handleEmailSend} disabled={isEmailSending}
                  style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "white", background: isEmailSending ? "linear-gradient(135deg,#9ca3af 0%,#6b7280 100%)" : "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", cursor: isEmailSending ? "not-allowed" : "pointer" }}>
                  {isEmailSending ? "Sending…" : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Text/Call Modal ────────────────────────────────────────────────── */}
      {callModal.isOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <button onClick={handleCallModalClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#6b7280" }}>×</button>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>Text Message</h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0" }}>Send a text message to {callModal.leadName}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" value={callForm.phone} onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea value={callForm.message} onChange={(e) => setCallForm({ ...callForm, message: e.target.value })} rows={6} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={handleCallModalClose} style={cancelBtnStyle}>Cancel</button>
                <button onClick={handleCallSend} disabled={isCallSending}
                  style={{ padding: "10px 20px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "white", background: isCallSending ? "linear-gradient(135deg,#9ca3af 0%,#6b7280 100%)" : "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)", cursor: isCallSending ? "not-allowed" : "pointer" }}>
                  {isCallSending ? "Sending…" : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Note Modal ─────────────────────────────────────────────────── */}
      {openNoteModal && leadData && (
        <AddNoteModal leadsId={leadData.id} openNoteModal={openNoteModal} setOpenNoteModal={setOpenNoteModal} />
      )}
    </>
  );
};

export default SingleLead;

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import Loader from "../../components/Loader";
// import AddNoteModal from "./AddNoteModal";
// import { useDispatch, useSelector } from "react-redux";
// import { leadSingle } from "../../Reducer/AddSlice";
// import { 
//   FaDollarSign, 
//   FaChartLine, 
//   FaShoppingCart, 
//   FaEnvelope, 
//   FaPhone, 
//   FaBuilding, 
//   FaMapMarkerAlt,
//   FaUser,
//   FaCalendarAlt,
//   FaArrowLeft,
//   FaImage,
//   FaTag,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaStar,
//   FaHatCowboy,
//   FaPalette,
//   FaGlobe,
//   FaUsers,
//   FaClock,
//   FaRedo,
//   FaThumbsUp,
//   FaTools
// } from "react-icons/fa";
// import { IoDocumentTextOutline } from "react-icons/io5";
// import EmailConversation from "./EmailConversation";

// const SingleLead = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { leadSingleData, loading } = useSelector((state) => state.add);
//   const [leadData, setLeadData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [emailModal, setEmailModal] = useState({isOpen: false, leadEmail: '', leadName: ''});
//   const [emailForm, setEmailForm] = useState({
//     to: '',
//     subject: '',
//     message: ''
//   });
//   const [callModal, setCallModal] = useState({isOpen: false, phoneNumber: '', leadName: ''});
//   const [callForm, setCallForm] = useState({
//     phone: '',
//     message: ''
//   });
//   const [isEmailSending, setIsEmailSending] = useState(false);
//   const [isCallSending, setIsCallSending] = useState(false);
//   const [openNoteModal, setOpenNoteModal] = useState(false);

//   const fetchLeadData = useCallback(() => {
//     if (id) {
//       setIsLoading(true);
//       setError(null);
//       dispatch(leadSingle(id));
//     }
//   }, [id, dispatch]);

//   useEffect(() => {
//     fetchLeadData();
//   }, [fetchLeadData]);

//   useEffect(() => {
//     if (leadSingleData?.data) {
//       console.log("Lead single data from Redux:", leadSingleData.data);
//       setLeadData(leadSingleData.data);
//       setIsLoading(false);
//       setError(null);
//     }
//     if (leadSingleData?.error) {
//       setError("Failed to fetch lead data");
//       toast.error("Failed to fetch lead data");
//       setIsLoading(false);
//     }
//   }, [leadSingleData]);

//   useEffect(() => {
//     setIsLoading(loading);
//   }, [loading]);

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(value || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       "Sample Submitted": "bg-blue-100 text-blue-800 border-blue-200",
//       "Sample Art Approved": "bg-cyan-100 text-cyan-800 border-cyan-200",
//       "Sample Shipped": "bg-orange-100 text-orange-800 border-orange-200",
//       "Sample Delivered": "bg-green-100 text-green-800 border-green-200",
//       "Nurture Sequence": "bg-purple-100 text-purple-800 border-purple-200",
//       "Warm Lead": "bg-red-100 text-red-800 border-red-200",
//       "Cold Lead": "bg-pink-100 text-pink-800 border-pink-200",
//     };
//     return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   const formatAddress = (address) => {
//     if (!address) return "N/A";
//     const parts = [
//       address.line1,
//       address.line2,
//       address.city,
//       address.state,
//       address.postal_code,
//       address.country
//     ].filter(Boolean);
//     return parts.join(", ") || "N/A";
//   };

//   // Helper: format label from snake_case or camelCase
//   const formatLabel = (key) => {
//     return key
//       .replace(/_/g, ' ')
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^\w/, c => c.toUpperCase())
//       .trim();
//   };

//   // Email handler functions
//   const handleEmailClick = (leadEmail, leadName) => {
//     setEmailModal({ isOpen: true, leadEmail, leadName });
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
//       sender: 'team@showmecustomapparel.com',
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
//       .finally(() => setIsEmailSending(false));
//   };

//   const handleEmailModalClose = () => {
//     setEmailModal({ isOpen: false, leadEmail: '', leadName: '' });
//     setEmailForm({ to: '', subject: '', message: '' });
//   };

//   const handleCallClick = (phoneNumber, leadName) => {
//     setCallModal({ isOpen: true, phoneNumber, leadName });
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

//   const handleAddNote = () => setOpenNoteModal(true);

//   if (isLoading) {
//     return (
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
//         <div className="h-full flex items-center justify-center">
//           <Loader size="large" text="Loading Lead Details..." />
//         </div>
//       </div>
//     );
//   }

//   if (error || !leadData) {
//     return (
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
//         <div className="h-full flex items-center justify-center">
//           <div className="text-center">
//             <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Lead</h2>
//             <p className="text-gray-600 mb-4">{error || "Lead not found"}</p>
//             <button
//               onClick={() => navigate('/leads')}
//               className="bg-[#f20c32] hover:bg-black px-4 py-2 text-white rounded-md"
//             >
//               Back to Leads
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Parse what_most_important safely
//   const wmi = leadData?.what_most_important || {};

//   return (
//     <>
//       <ToastContainer />
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
//         <div className="h-full">

//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => navigate('/leads')}
//                 className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 <FaArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   {leadData?.name || "Lead Details"}
//                 </h1>
//                 <p className="text-gray-600">Lead ID: {leadData?.id}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleAddNote}
//                 className="bg-[#10B981] hover:bg-[#059669] px-4 py-2 text-white text-sm font-semibold flex justify-center items-center rounded-md transition-colors"
//               >
//                 Add Note
//               </button>
//               <div className={`px-4 py-2 rounded-full border ${getStatusColor(leadData?.lead_status?.name)}`}>
//                 <span className="font-semibold">{leadData?.lead_status?.name || "Unknown Status"}</span>
//               </div>
//             </div>
//           </div>

//           {/* =============================================
//               KEY METRICS CARDS — commented out (API fields missing)
//               =============================================
//           {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Profit</p>
//                   <p className="text-2xl font-bold text-green-600">{formatCurrency(parseFloat(leadData?.profit || 0))}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <FaDollarSign className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                   <p className="text-2xl font-bold text-blue-600">{leadData?.total_orders || 0}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <FaShoppingCart className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                   <p className="text-2xl font-bold text-purple-600">{formatCurrency(parseFloat(leadData?.revenue || 0))}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <FaChartLine className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
//                   <p className="text-2xl font-bold text-orange-600">{parseFloat(leadData?.conversion_rate || 0).toFixed(1)}%</p>
//                 </div>
//                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <FaStar className="w-6 h-6 text-orange-600" />
//                 </div>
//               </div>
//             </div>
//           </div> */}

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//             {/* Left Column */}
//             <div className="lg:col-span-2 space-y-6">

//               {/* Contact Information */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaUser className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Contact Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center space-x-3">
//                     <FaEnvelope className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-600">Email</p>
//                       <p className="font-medium">{leadData?.email || "N/A"}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <FaPhone className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-600">Phone</p>
//                       <p className="font-medium">{leadData?.phone || "N/A"}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <FaBuilding className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-600">Company</p>
//                       <p className="font-medium">{leadData?.company_name || "N/A"}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-600">Primary Address</p>
//                       <p className="font-medium">{formatAddress(leadData?.primary_address)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Address Details */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaMapMarkerAlt className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Address Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-3">Primary Address</h3>
//                     {leadData?.primary_address ? (
//                       <div className="space-y-2">
//                         <p className="text-sm text-gray-600">{leadData.primary_address.line1}</p>
//                         {leadData.primary_address.line2 && (
//                           <p className="text-sm text-gray-600">{leadData.primary_address.line2}</p>
//                         )}
//                         <p className="text-sm text-gray-600">
//                           {[leadData.primary_address.city, leadData.primary_address.state, leadData.primary_address.postal_code].filter(Boolean).join(", ")}
//                         </p>
//                         <p className="text-sm text-gray-600">{leadData.primary_address.country}</p>
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">N/A</p>
//                     )}
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-3">Shipping Address</h3>
//                     {leadData?.shipping_address ? (
//                       <div className="space-y-2">
//                         <p className="text-sm text-gray-600">{leadData.shipping_address.line1}</p>
//                         {leadData.shipping_address.line2 && (
//                           <p className="text-sm text-gray-600">{leadData.shipping_address.line2}</p>
//                         )}
//                         <p className="text-sm text-gray-600">
//                           {[leadData.shipping_address.city, leadData.shipping_address.state, leadData.shipping_address.postal_code].filter(Boolean).join(", ")}
//                         </p>
//                         <p className="text-sm text-gray-600">{leadData.shipping_address.country}</p>
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">N/A</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Notes */}
//               {leadData?.notes && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <IoDocumentTextOutline className="w-5 h-5 mr-2 text-[#f20c32]" />
//                     Notes
//                   </h2>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <p className="text-gray-700 whitespace-pre-wrap">{leadData.notes}</p>
//                   </div>
//                 </div>
//               )}

//               {/* ===================================================
//                   WHAT MOST IMPORTANT — Full detailed display
//                   =================================================== */}
//               {wmi && Object.keys(wmi).length > 0 && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
//                     <FaHatCowboy className="w-5 h-5 mr-2 text-[#f20c32]" />
//                     Hat Preferences & Survey Details
//                   </h2>

//                   <div className="space-y-5">

//                     {/* Website & Industry & Team Size row */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {wmi.website && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center gap-2 mb-1">
//                             <FaGlobe className="w-4 h-4 text-blue-500" />
//                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Website</p>
//                           </div>
//                           <p className="font-medium text-gray-800 text-sm break-all">{wmi.website}</p>
//                         </div>
//                       )}
//                       {wmi.industry && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center gap-2 mb-1">
//                             <FaBuilding className="w-4 h-4 text-purple-500" />
//                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</p>
//                           </div>
//                           <p className="font-medium text-gray-800 text-sm capitalize">{wmi.industry}{wmi.industryOther ? ` — ${wmi.industryOther}` : ''}</p>
//                         </div>
//                       )}
//                       {wmi.teamSize && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center gap-2 mb-1">
//                             <FaUsers className="w-4 h-4 text-green-500" />
//                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Size</p>
//                           </div>
//                           <p className="font-medium text-gray-800 text-sm">{wmi.teamSize}</p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Hat Colors */}
//                     {wmi.hatColors && Object.keys(wmi.hatColors).length > 0 && (
//                       <div>
//                         <div className="flex items-center gap-2 mb-3">
//                           <FaPalette className="w-4 h-4 text-[#f20c32]" />
//                           <p className="text-sm font-semibold text-gray-700">Selected Hat Colors</p>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                           {Object.entries(wmi.hatColors).map(([hatId, colorName]) => (
//                             <div
//                               key={hatId}
//                               className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 text-center"
//                             >
//                               <p className="text-xs font-bold text-[#f20c32] mb-1">{hatId}</p>
//                               <p className="text-sm font-semibold text-gray-800 capitalize">{colorName}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Selected Hats */}
//                     {Array.isArray(wmi.selectedHats) && wmi.selectedHats.length > 0 && (
//                       <div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <FaHatCowboy className="w-4 h-4 text-[#f20c32]" />
//                           <p className="text-sm font-semibold text-gray-700">Selected Hats</p>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {wmi.selectedHats.map((hat, i) => (
//                             <span key={i} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-full text-sm font-medium">
//                               {hat}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Primary Use */}
//                     {Array.isArray(wmi.primaryUse) && wmi.primaryUse.length > 0 && (
//                       <div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <FaCheckCircle className="w-4 h-4 text-[#f20c32]" />
//                           <p className="text-sm font-semibold text-gray-700">Primary Use</p>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {wmi.primaryUse.map((use, i) => (
//                             <span key={i} className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-medium capitalize">
//                               {use.replace(/_/g, ' ')}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Brand Approach */}
//                     {Array.isArray(wmi.brandApproach) && wmi.brandApproach.length > 0 && (
//                       <div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <FaStar className="w-4 h-4 text-[#f20c32]" />
//                           <p className="text-sm font-semibold text-gray-700">Brand Approach</p>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {wmi.brandApproach.map((b, i) => (
//                             <span key={i} className="px-3 py-1.5 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-full text-sm font-medium capitalize">
//                               {b.replace(/_/g, ' ')}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Frustrations */}
//                     {Array.isArray(wmi.frustrations) && wmi.frustrations.length > 0 && (
//                       <div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <FaExclamationTriangle className="w-4 h-4 text-[#f20c32]" />
//                           <p className="text-sm font-semibold text-gray-700">Frustrations</p>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {wmi.frustrations.map((f, i) => (
//                             <span key={i} className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-sm font-medium capitalize">
//                               {f.replace(/_/g, ' ')}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Why Samples */}
//                     {Array.isArray(wmi.whySamples) && wmi.whySamples.length > 0 && (
//                       <div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <FaThumbsUp className="w-4 h-4 text-[#f20c32]" />
//                           <p className="text-sm font-semibold text-gray-700">Why Samples</p>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {wmi.whySamples.map((w, i) => (
//                             <span key={i} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-medium capitalize">
//                               {w.replace(/_/g, ' ')}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Delivery & Order details row */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {wmi.deliveryTiming && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center gap-2 mb-1">
//                             <FaClock className="w-4 h-4 text-indigo-500" />
//                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Timing</p>
//                           </div>
//                           <p className="font-medium text-gray-800 text-sm">{wmi.deliveryTiming.replace(/_/g, ' ')}</p>
//                         </div>
//                       )}
//                       {wmi.orderingFrequency && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center gap-2 mb-1">
//                             <FaRedo className="w-4 h-4 text-teal-500" />
//                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ordering Frequency</p>
//                           </div>
//                           <p className="font-medium text-gray-800 text-sm">{wmi.orderingFrequency} / year</p>
//                         </div>
//                       )}
//                       {wmi.thirdHatSize && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center gap-2 mb-1">
//                             <FaHatCowboy className="w-4 h-4 text-pink-500" />
//                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hat Size</p>
//                           </div>
//                           <p className="font-medium text-gray-800 text-sm">{wmi.thirdHatSize}</p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Budget Approval */}
//                     {wmi.budgetApproval && (
//                       <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
//                         <FaDollarSign className="w-4 h-4 text-[#f20c32]" />
//                         <div>
//                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget Approval</p>
//                           <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold capitalize
//                             ${wmi.budgetApproval === 'approved' ? 'bg-green-100 text-green-700 border border-green-300' :
//                               wmi.budgetApproval === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
//                               'bg-red-100 text-red-700 border border-red-300'}`}>
//                             {wmi.budgetApproval.replace(/_/g, ' ')}
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                     {/* Logo */}
//                     {wmi.logo?.url && (
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <div className="flex items-center gap-2 mb-3">
//                           <FaImage className="w-4 h-4 text-[#f20c32]" />
//                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Logo</p>
//                         </div>
//                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                           {/* Image Preview */}
//                           <div className="border border-gray-200 rounded-lg bg-white p-2 shadow-sm">
//                             <img
//                               src={wmi.logo.url}
//                               alt="Lead Logo"
//                               className="h-24 w-auto object-contain rounded"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                                 e.target.nextSibling.style.display = 'flex';
//                               }}
//                             />
//                             <div
//                               style={{ display: 'none' }}
//                               className="h-24 w-32 items-center justify-center text-gray-400 text-xs text-center"
//                             >
//                               Image not available
//                             </div>
//                           </div>
//                           {/* Download Button */}
//                           <a
//                             href={wmi.logo.url}
//                             download
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-2 px-4 py-2 bg-[#f20c32] hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
//                             </svg>
//                             Download Logo
//                           </a>
//                         </div>
//                       </div>
//                     )}

//                   </div>
//                 </div>
//               )}

//               {/* Hat Usage & Past Issues — only show if data exists */}
//               {(
//                 (Array.isArray(leadData?.hats_usage) && leadData.hats_usage.length > 0) ||
//                 (Array.isArray(leadData?.past_headwear_issues) && leadData.past_headwear_issues.length > 0)
//               ) && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <FaImage className="w-5 h-5 mr-2 text-[#f20c32]" />
//                     Hat Usage
//                   </h2>
//                   <div className="space-y-4">
//                     {Array.isArray(leadData?.hats_usage) && leadData.hats_usage.length > 0 && (
//                       <div>
//                         <p className="text-sm text-gray-600 mb-2">Hat Usage</p>
//                         <div className="flex flex-wrap gap-2">
//                           {leadData.hats_usage.map((item, index) => (
//                             <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                               {typeof item === 'object' ? item.hats_usage : item}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {Array.isArray(leadData?.past_headwear_issues) && leadData.past_headwear_issues.length > 0 && (
//                       <div>
//                         <p className="text-sm text-gray-600 mb-2">Past Headwear Issues</p>
//                         <div className="flex flex-wrap gap-2">
//                           {leadData.past_headwear_issues.map((item, index) => (
//                             <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
//                               {typeof item === 'object' ? item.past_headwear_issues : item}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//             </div>

//             {/* Right Column */}
//             <div className="space-y-6">

//               {/* Communication Card */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaEnvelope className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Communication
//                 </h2>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => handleEmailClick(leadData?.email, leadData?.name)}
//                     style={{
//                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '8px',
//                       padding: '12px 20px',
//                       fontSize: '14px',
//                       fontWeight: '600',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       flex: 1,
//                       justifyContent: 'center',
//                       transition: 'all 0.2s ease-in-out'
//                     }}
//                     onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)'; }}
//                     onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
//                   >
//                     <FaEnvelope className="w-4 h-4" />
//                     Email
//                   </button>
//                   <button
//                     onClick={() => handleCallClick(leadData?.phone, leadData?.name)}
//                     style={{
//                       background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '8px',
//                       padding: '12px 20px',
//                       fontSize: '14px',
//                       fontWeight: '600',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       flex: 1,
//                       justifyContent: 'center',
//                       transition: 'all 0.2s ease-in-out'
//                     }}
//                     onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)'; }}
//                     onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
//                   >
//                     <IoDocumentTextOutline className="w-4 h-4" />
//                     Text
//                   </button>
//                 </div>
//               </div>

//               {/* Timeline */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaCalendarAlt className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Timeline
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                     <div>
//                       <p className="text-sm font-medium">Typeform Date</p>
//                       <p className="text-xs text-gray-600">{formatDate(leadData?.typeform_date)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     <div>
//                       <p className="text-sm font-medium">Created At</p>
//                       <p className="text-xs text-gray-600">{formatDate(leadData?.created_at)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <div>
//                       <p className="text-sm font-medium">Last Updated</p>
//                       <p className="text-xs text-gray-600">{formatDate(leadData?.updated_at)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Rep Information — only if data exists */}
//               {leadData?.rep && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <FaUser className="w-5 h-5 mr-2 text-[#f20c32]" />
//                     Assigned Representative
//                   </h2>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Name</span>
//                       <span className="font-semibold text-blue-600">{leadData.rep.name}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Email</span>
//                       <span className="font-semibold text-green-600">{leadData.rep.email}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Phone</span>
//                       <span className="font-semibold text-purple-600">{leadData.rep.phone}</span>
//                     </div>
//                     {leadData.rep.address && (
//                       <div>
//                         <span className="text-sm text-gray-600">Address</span>
//                         <p className="font-medium text-sm mt-1">{formatAddress(leadData.rep.address)}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Email Modal */}
//       {emailModal.isOpen && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
//           <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative' }}>
//             <button onClick={handleEmailModalClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
//             <div style={{ marginBottom: '20px' }}>
//               <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>Send Email</h2>
//               <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Send an email to {emailModal.leadName}</p>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               <div>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>To</label>
//                 <input type="email" value={emailForm.to} onChange={(e) => setEmailForm({...emailForm, to: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
//               </div>
//               <div>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Subject</label>
//                 <input type="text" value={emailForm.subject} onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
//               </div>
//               <div>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Message</label>
//                 <textarea value={emailForm.message} onChange={(e) => setEmailForm({...emailForm, message: e.target.value})} rows={6} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
//               </div>
//               <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
//                 <button onClick={handleEmailModalClose} style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#374151', background: 'white', cursor: 'pointer' }}>Cancel</button>
//                 <button onClick={handleEmailSend} disabled={isEmailSending} style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: 'white', background: isEmailSending ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', cursor: isEmailSending ? 'not-allowed' : 'pointer' }}>
//                   {isEmailSending ? 'Sending...' : 'Send Email'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Call Modal */}
//       {callModal.isOpen && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
//           <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative' }}>
//             <button onClick={handleCallModalClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
//             <div style={{ marginBottom: '20px' }}>
//               <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>Text Message</h2>
//               <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Send a text message to {callModal.leadName}</p>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               <div>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Phone Number</label>
//                 <input type="tel" value={callForm.phone} onChange={(e) => setCallForm({...callForm, phone: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
//               </div>
//               <div>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Message</label>
//                 <textarea value={callForm.message} onChange={(e) => setCallForm({...callForm, message: e.target.value})} rows={6} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
//               </div>
//               <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
//                 <button onClick={handleCallModalClose} style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#374151', background: 'white', cursor: 'pointer' }}>Cancel</button>
//                 <button onClick={handleCallSend} disabled={isCallSending} style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: 'white', background: isCallSending ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', cursor: isCallSending ? 'not-allowed' : 'pointer' }}>
//                   {isCallSending ? 'Sending...' : 'Send Message'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Note Modal */}
//       {openNoteModal && leadData && (
//         <AddNoteModal
//           leadsId={leadData.id}
//           openNoteModal={openNoteModal}
//           setOpenNoteModal={setOpenNoteModal}
//         />
//       )}
//     </>
//   );
// };

// export default SingleLead;

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import Loader from "../../components/Loader";
// import AddNoteModal from "./AddNoteModal";
// import { useDispatch, useSelector } from "react-redux";
// import { leadSingle } from "../../Reducer/AddSlice";
// import { 
//   FaDollarSign, 
//   FaChartLine, 
//   FaShoppingCart, 
//   FaEnvelope, 
//   FaPhone, 
//   FaBuilding, 
//   FaMapMarkerAlt,
//   FaUser,
//   FaCalendarAlt,
//   FaArrowLeft,
//   FaImage,
//   FaTag,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaStar
// } from "react-icons/fa";
// import { IoDocumentTextOutline } from "react-icons/io5";
// import EmailConversation from "./EmailConversation";

// const SingleLead = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { leadSingleData, loading } = useSelector((state) => state.add);
//   const [leadData, setLeadData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [emailModal, setEmailModal] = useState({isOpen: false, leadEmail: '', leadName: ''});
//   const [emailForm, setEmailForm] = useState({
//     to: '',
//     subject: '',
//     message: ''
//   });
//   const [callModal, setCallModal] = useState({isOpen: false, phoneNumber: '', leadName: ''});
//   const [callForm, setCallForm] = useState({
//     phone: '',
//     message: ''
//   });
//   const [isEmailSending, setIsEmailSending] = useState(false);
//   const [isCallSending, setIsCallSending] = useState(false);
//   const [openNoteModal, setOpenNoteModal] = useState(false);

//   const fetchLeadData = useCallback(() => {
//     if (id) {
//       setIsLoading(true);
//       setError(null);
//       dispatch(leadSingle(id));
//     }
//   }, [id, dispatch]);

//   useEffect(() => {
//     fetchLeadData();
//   }, [fetchLeadData]);

//   // Update local state when Redux data changes
//   useEffect(() => {
//     if (leadSingleData?.data) {
//       console.log("Lead single data from Redux:", leadSingleData.data);
//       setLeadData(leadSingleData.data);
//       setIsLoading(false);
//       setError(null);
//     }
//     if (leadSingleData?.error) {
//       setError("Failed to fetch lead data");
//       toast.error("Failed to fetch lead data");
//       setIsLoading(false);
//     }
//   }, [leadSingleData]);

//   useEffect(() => {
//     setIsLoading(loading);
//   }, [loading]);


//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(value || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       "Sample Submitted": "bg-blue-100 text-blue-800 border-blue-200",
//       "Sample Art Approved": "bg-cyan-100 text-cyan-800 border-cyan-200",
//       "Sample Shipped": "bg-orange-100 text-orange-800 border-orange-200",
//       "Sample Delivered": "bg-green-100 text-green-800 border-green-200",
//       "Nurture Sequence": "bg-purple-100 text-purple-800 border-purple-200",
//       "Warm Lead": "bg-red-100 text-red-800 border-red-200",
//       "Cold Lead": "bg-pink-100 text-pink-800 border-pink-200",
//     };
//     return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   const formatAddress = (address) => {
//     if (!address) return "N/A";
//     const parts = [
//       address.line1,
//       address.line2,
//       address.city,
//       address.state,
//       address.postal_code,
//       address.country
//     ].filter(Boolean);
//     return parts.join(", ") || "N/A";
//   };

//   // Email handler functions
//   const handleEmailClick = (leadEmail, leadName) => {
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
//       sender: 'team@showmecustomapparel.com', // You can replace this with actual sender email
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
//   const handleCallClick = (phoneNumber, leadName) => {
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

//   const handleAddNote = () => {
//     setOpenNoteModal(true);
//   };

//   if (isLoading) {
//     return (
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
//         <div className="h-full flex items-center justify-center">
//           <Loader size="large" text="Loading Lead Details..." />
//         </div>
//       </div>
//     );
//   }

//   if (error || !leadData) {
//     return (
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
//         <div className="h-full flex items-center justify-center">
//           <div className="text-center">
//             <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Lead</h2>
//             <p className="text-gray-600 mb-4">{error || "Lead not found"}</p>
//             <button
//               onClick={() => navigate('/leads')}
//               className="bg-[#f20c32] hover:bg-black px-4 py-2 text-white rounded-md"
//             >
//               Back to Leads
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

// return (
//     <>
//       <ToastContainer />
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
//         <div className="h-full">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => navigate('/leads')}
//                 className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 <FaArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   {leadData?.name || "Lead Details"}
//                 </h1>
//                 <p className="text-gray-600">Lead ID: {leadData?.id}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleAddNote}
//                 className="bg-[#10B981] hover:bg-[#059669] px-4 py-2 text-white text-sm font-semibold flex justify-center items-center rounded-md transition-colors"
//               >
//                 Add Note
//               </button>
//               <div className={`px-4 py-2 rounded-full border ${getStatusColor(leadData?.lead_status?.name)}`}>
//                 <span className="font-semibold">{leadData?.lead_status?.name || "Unknown Status"}</span>
//               </div>
//             </div>
//           </div>

//           {/* Key Metrics Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {/* Profit 2 Card */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Profit</p>
//                   <p className="text-2xl font-bold text-green-600">
//                     {formatCurrency(parseFloat(leadData?.profit || 0))}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <FaDollarSign className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             {/* Total Orders Card */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {leadData?.total_orders || 0}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <FaShoppingCart className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             {/* Total Order Value Card */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                   <p className="text-2xl font-bold text-purple-600">
//                     {formatCurrency(parseFloat(leadData?.revenue || 0))}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <FaChartLine className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//             </div>

//             {/* Conversion Rate Card */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
//                   <p className="text-2xl font-bold text-orange-600">
//                     {parseFloat(leadData?.conversion_rate || 0).toFixed(1)}%
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <FaStar className="w-6 h-6 text-orange-600" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Lead Information */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Contact Information */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaUser className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Contact Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center space-x-3">
//                     <FaEnvelope className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-600">Email</p>
//                     <p className="font-medium">{leadData?.email || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <FaPhone className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-600">Phone</p>
//                     <p className="font-medium">{leadData?.phone || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <FaBuilding className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-600">Company</p>
//                     <p className="font-medium">{leadData?.company_name || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-600">Primary Address</p>
//                     <p className="font-medium">{formatAddress(leadData?.primary_address)}</p>
//                   </div>
//                 </div>
//                 </div>
//               </div>

//               {/* Additional Details */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaTag className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Lead Details
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600">Role in Company</p>
//                     <p className="font-medium">{leadData?.role_in_company || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Annual Merchandise Spend</p>
//                     <p className="font-medium">{leadData?.annual_merchandise_spend || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Industry</p>
//                     <p className="font-medium">{leadData?.industry || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Region Tag</p>
//                     <p className="font-medium">{leadData?.region_tag || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Source</p>
//                     <p className="font-medium">{leadData?.source || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Marketing Consent</p>
//                     <p className="font-medium">{leadData?.marketing_consent ? "Yes" : "No"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Lead Quality Score</p>
//                     <p className="font-medium">{leadData?.lead_quality_score || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Assigned Rep</p>
//                     <p className="font-medium">{leadData?.rep?.name || "Unassigned"}</p>
//                   </div>
//                 </div>
//               </div>
//               {/* Address Details */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaMapMarkerAlt className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Address Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-3">Primary Address</h3>
//                     {leadData?.primary_address ? (
//                       <div className="space-y-2">
//                         <p className="text-sm text-gray-600">{leadData.primary_address.line1}</p>
//                         {leadData.primary_address.line2 && (
//                           <p className="text-sm text-gray-600">{leadData.primary_address.line2}</p>
//                         )}
//                         <p className="text-sm text-gray-600">
//                           {[leadData.primary_address.city, leadData.primary_address.state, leadData.primary_address.postal_code].filter(Boolean).join(", ")}
//                         </p>
//                         <p className="text-sm text-gray-600">{leadData.primary_address.country}</p>
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">N/A</p>
//                     )}
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-3">Shipping Address</h3>
//                     {leadData?.shipping_address ? (
//                       <div className="space-y-2">
//                         <p className="text-sm text-gray-600">{leadData.shipping_address.line1}</p>
//                         {leadData.shipping_address.line2 && (
//                           <p className="text-sm text-gray-600">{leadData.shipping_address.line2}</p>
//                         )}
//                         <p className="text-sm text-gray-600">
//                           {[leadData.shipping_address.city, leadData.shipping_address.state, leadData.shipping_address.postal_code].filter(Boolean).join(", ")}
//                         </p>
//                         <p className="text-sm text-gray-600">{leadData.shipping_address.country}</p>
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">N/A</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Notes */}
//               {leadData?.notes && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <IoDocumentTextOutline className="w-5 h-5 mr-2 text-[#f20c32]" />
//                     Notes
//                   </h2>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <p className="text-gray-700 whitespace-pre-wrap">{leadData.notes}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Email Conversation */}
//               {/* <EmailConversation 
//                 leadEmail={leadData?.email} 
//                 leadName={leadData?.name} 
//               /> */}
//               {/* Hat Usage and Preferences */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaImage className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Hat Preferences
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-2">Hat Usage</p>
//                     <div className="flex flex-wrap gap-2">
//                       {Array.isArray(leadData?.hats_usage) && leadData.hats_usage.length > 0 ? 
//                         leadData.hats_usage.map((item, index) => (
//                           <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                             {typeof item === 'object' ? item.hats_usage : item}
//                           </span>
//                         )) : 
//                         <span className="text-gray-500">N/A</span>
//                       }
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 mb-2">Past Headwear Issues</p>
//                     <div className="flex flex-wrap gap-2">
//                       {Array.isArray(leadData?.past_headwear_issues) && leadData.past_headwear_issues.length > 0 ? 
//                         leadData.past_headwear_issues.map((item, index) => (
//                           <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
//                             {typeof item === 'object' ? item.past_headwear_issues : item}
//                           </span>
//                         )) : 
//                         <span className="text-gray-500">N/A</span>
//                       }
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 mb-2">What&apos;s Most Important</p>
//                     <div className="flex flex-wrap gap-2">
//                       {Array.isArray(leadData?.what_most_important) && leadData.what_most_important.length > 0 ? 
//                         leadData.what_most_important.map((item, index) => (
//                           <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                             {typeof item === 'object' ? item.what_most_important : item}
//                           </span>
//                         )) : 
//                         <span className="text-gray-500">N/A</span>
//                       }
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* AI Insights */}
//               {/* {leadData["AI Pain Block"] && leadData["AI Pain Block"].value && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <FaCheckCircle className="w-5 h-5 mr-2 text-[#f20c32]" />
//                     AI Pain Block Analysis
//                   </h2>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <p className="text-gray-700 italic">&ldquo;{leadData["AI Pain Block"].value}&rdquo;</p>
//                   </div>
//                 </div>
//               )} */}

             
//             </div>

//             {/* Right Column - Timeline and Stats */}
//             <div className="space-y-6">
//               {/* Communication Card */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaEnvelope className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Communication
//                 </h2>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => handleEmailClick(leadData?.email, leadData?.name)}
//                     style={{
//                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '8px',
//                       padding: '12px 20px',
//                       fontSize: '14px',
//                       fontWeight: '600',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       flex: 1,
//                       justifyContent: 'center',
//                       transition: 'all 0.2s ease-in-out'
//                     }}
//                     onMouseOver={(e) => {
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
//                     }}
//                     onMouseOut={(e) => {
//                       e.target.style.transform = 'translateY(0)';
//                       e.target.style.boxShadow = 'none';
//                     }}
//                   >
//                     <FaEnvelope className="w-4 h-4" />
//                     Email
//                   </button>
                  
//                   <button
//                     onClick={() => handleCallClick(leadData?.phone, leadData?.name)}
//                     style={{
//                       background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '8px',
//                       padding: '12px 20px',
//                       fontSize: '14px',
//                       fontWeight: '600',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       flex: 1,
//                       justifyContent: 'center',
//                       transition: 'all 0.2s ease-in-out'
//                     }}
//                     onMouseOver={(e) => {
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)';
//                     }}
//                     onMouseOut={(e) => {
//                       e.target.style.transform = 'translateY(0)';
//                       e.target.style.boxShadow = 'none';
//                     }}
//                   >
//                     <IoDocumentTextOutline className="w-4 h-4" />
//                     Text
//                   </button>
//                 </div>
//               </div>


//               {/* Timeline */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaCalendarAlt className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Timeline
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                     <div>
//                       <p className="text-sm font-medium">Typeform Date</p>
//                       <p className="text-xs text-gray-600">{formatDate(leadData?.typeform_date)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     <div>
//                       <p className="text-sm font-medium">Created At</p>
//                       <p className="text-xs text-gray-600">{formatDate(leadData?.created_at)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <div>
//                       <p className="text-sm font-medium">Last Updated</p>
//                       <p className="text-xs text-gray-600">{formatDate(leadData?.updated_at)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Rep Information */}
//               {leadData?.rep && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <FaUser className="w-5 h-5 mr-2 text-[#f20c32]" />
//                     Assigned Representative
//                   </h2>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Name</span>
//                       <span className="font-semibold text-blue-600">{leadData.rep.name}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Email</span>
//                       <span className="font-semibold text-green-600">{leadData.rep.email}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Phone</span>
//                       <span className="font-semibold text-purple-600">{leadData.rep.phone}</span>
//                     </div>
//                     {leadData.rep.address && (
//                       <div>
//                         <span className="text-sm text-gray-600">Address</span>
//                         <p className="font-medium text-sm mt-1">{formatAddress(leadData.rep.address)}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Financial Summary */}
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <FaDollarSign className="w-5 h-5 mr-2 text-[#f20c32]" />
//                   Financial Summary
//                 </h2>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Revenue</span>
//                     <span className="font-semibold text-green-600">{formatCurrency(parseFloat(leadData?.revenue || 0))}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Expenses</span>
//                     <span className="font-semibold text-red-600">{formatCurrency(parseFloat(leadData?.expenses || 0))}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Profit</span>
//                     <span className="font-semibold text-blue-600">{formatCurrency(parseFloat(leadData?.profit || 0))}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Conversion Rate</span>
//                     <span className="font-semibold text-purple-600">{parseFloat(leadData?.conversion_rate || 0).toFixed(1)}%</span>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
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
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
//                   onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
//                   onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
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
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = 'none';
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
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
//                   onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
//                   onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
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
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 >
//                   {isCallSending ? 'Sending...' : 'Send Message'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Note Modal */}
//       {openNoteModal && leadData && (
//         <AddNoteModal
//           leadsId={leadData.id}
//           openNoteModal={openNoteModal}
//           setOpenNoteModal={setOpenNoteModal}
//         />
//       )}
//     </>
//   );
// };

// export default SingleLead;