import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader";
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
  FaStar
} from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import EmailConversation from "./EmailConversation";

const SingleLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailModal, setEmailModal] = useState({isOpen: false, leadEmail: '', leadName: ''});
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [callModal, setCallModal] = useState({isOpen: false, phoneNumber: '', leadName: ''});
  const [callForm, setCallForm] = useState({
    phone: '',
    message: ''
  });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isCallSending, setIsCallSending] = useState(false);

  const api = "https://n8nnode.bestworks.cloud/webhook/fetch-single-lead";



  const fetchLeadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(api, { id });
      console.log("Lead data fetched:", response.data);
      setLeadData(response.data[0]);
    } catch (error) {
      console.error("Error fetching lead data:", error);
      setError("Failed to fetch lead data");
      toast.error("Failed to fetch lead data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);


  useEffect(() => {
    if (id) {
      fetchLeadData();
    }
  }, [id, fetchLeadData]);


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "Sample Submitted": "bg-blue-100 text-blue-800 border-blue-200",
      "Sample Art Approved": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Sample Shipped": "bg-orange-100 text-orange-800 border-orange-200",
      "Sample Delivered": "bg-green-100 text-green-800 border-green-200",
      "Nurture Sequence": "bg-purple-100 text-purple-800 border-purple-200",
      "Warm Lead": "bg-red-100 text-red-800 border-red-200",
      "Cold Lead": "bg-pink-100 text-pink-800 border-pink-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Email handler functions
  const handleEmailClick = (leadEmail, leadName) => {
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
  const handleCallClick = (phoneNumber, leadName) => {
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

  if (isLoading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="h-full flex items-center justify-center">
          <Loader size="large" text="Loading Lead Details..." />
        </div>
      </div>
    );
  }

  if (error || !leadData) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Lead</h2>
            <p className="text-gray-600 mb-4">{error || "Lead not found"}</p>
            <button
              onClick={() => navigate('/leads')}
              className="bg-[#f20c32] hover:bg-black px-4 py-2 text-white rounded-md"
            >
              Back to Leads
            </button>
          </div>
        </div>
      </div>
    );
  }

return (
    <>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-gray-50 min-h-screen">
        <div className="h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/leads')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {leadData["Lead Name"] || "Lead Details"}
                </h1>
                <p className="text-gray-600">Lead ID: {leadData.id}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getStatusColor(leadData["Lead Status"])}`}>
              <span className="font-semibold">{leadData["Lead Status"] || "Unknown Status"}</span>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Profit 2 Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(leadData["Profit 2"])}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {leadData["Total Orders"] || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Order Value Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Order Value</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(leadData["Total Order Value"])}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {leadData["Conversion Rate 2"] || "0%"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaStar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Lead Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUser className="w-5 h-5 mr-2 text-[#f20c32]" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{leadData["Email"] || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{leadData["Phone"] || leadData["Phone Number"] || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaBuilding className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-medium">{leadData["Company Name"] || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{leadData["Address"] || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaTag className="w-5 h-5 mr-2 text-[#f20c32]" />
                  Lead Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">First Name</p>
                    <p className="font-medium">{leadData["First Name"] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Name</p>
                    <p className="font-medium">{leadData["Last Name"] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role in Company</p>
                    <p className="font-medium">
                      {Array.isArray(leadData["Role in Company"]) 
                        ? leadData["Role in Company"].join(", ") 
                        : leadData["Role in Company"] || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Merchandise Spend</p>
                    <p className="font-medium">{leadData["Annual Merchandise Spend"] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{leadData["City"] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">State</p>
                    <p className="font-medium">{leadData["State"] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium">{leadData["Country"] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Zip Code</p>
                    <p className="font-medium">{leadData["Zip Code"] || "N/A"}</p>
                  </div>
                </div>
              </div>
 {/* Email Conversation */}
 <EmailConversation 
                leadEmail={leadData["Email"]} 
                leadName={leadData["Lead Name"]} 
              />
              {/* Hat Usage and Preferences */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaImage className="w-5 h-5 mr-2 text-[#f20c32]" />
                  Hat Preferences
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Hat Usage</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(leadData["Hat Usage"]) ? 
                        leadData["Hat Usage"].map((usage, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {usage}
                          </span>
                        )) : 
                        <span className="text-gray-500">N/A</span>
                      }
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Past Headwear Issues</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(leadData["Past Headwear Issues"]) ? 
                        leadData["Past Headwear Issues"].map((issue, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            {issue}
                          </span>
                        )) : 
                        <span className="text-gray-500">N/A</span>
                      }
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">What&apos;s Most Important</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(leadData["What's Most Important"]) ? 
                        leadData["What's Most Important"].map((item, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {item}
                          </span>
                        )) : 
                        <span className="text-gray-500">N/A</span>
                      }
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Selected Hats</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(leadData["Selected Hats"]) ? 
                        leadData["Selected Hats"].map((hat, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {hat}
                          </span>
                        )) : 
                        <span className="text-gray-500">N/A</span>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              {/* {leadData["AI Pain Block"] && leadData["AI Pain Block"].value && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaCheckCircle className="w-5 h-5 mr-2 text-[#f20c32]" />
                    AI Pain Block Analysis
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 italic">&ldquo;{leadData["AI Pain Block"].value}&rdquo;</p>
                  </div>
                </div>
              )} */}

             
            </div>

            {/* Right Column - Timeline and Stats */}
            <div className="space-y-6">
              {/* Communication Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaEnvelope className="w-5 h-5 mr-2 text-[#f20c32]" />
                  Communication
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEmailClick(leadData["Email"], leadData["Lead Name"])}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <FaEnvelope className="w-4 h-4" />
                    Email
                  </button>
                  
                  <button
                    onClick={() => handleCallClick(leadData["Phone"] || leadData["Phone Number"], leadData["Lead Name"])}
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <IoDocumentTextOutline className="w-4 h-4" />
                    Text
                  </button>
                </div>
              </div>


              {/* Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCalendarAlt className="w-5 h-5 mr-2 text-[#f20c32]" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">First Contact</p>
                      <p className="text-xs text-gray-600">{formatDate(leadData["First Contact Date"])}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Contact</p>
                      <p className="text-xs text-gray-600">{formatDate(leadData["Last Contact Date"])}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Typeform Date</p>
                      <p className="text-xs text-gray-600">{formatDate(leadData["Typeform Date"])}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Sample Entry Date</p>
                      <p className="text-xs text-gray-600">{formatDate(leadData["Sample Entry Date"])}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Statistics */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaEnvelope className="w-5 h-5 mr-2 text-[#f20c32]" />
                  Email Statistics
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Open Email Count</span>
                    <span className="font-semibold text-blue-600">{leadData["Open Email Count"] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reply Email Count</span>
                    <span className="font-semibold text-green-600">{leadData["Reply Email Count"] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Samples Sent Count</span>
                    <span className="font-semibold text-purple-600">{leadData["Samples Sent Count"] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sample Ordered</span>
                    <span className="font-semibold text-orange-600">{leadData["Sample Ordered"] || 0}</span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaDollarSign className="w-5 h-5 mr-2 text-[#f20c32]" />
                  Financial Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold text-green-600">{formatCurrency(leadData["Revenue"])}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expenses</span>
                    <span className="font-semibold text-red-600">{formatCurrency(leadData["Expenses"])}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profit</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(leadData["Profit"])}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-purple-600">{leadData["Conversion Rate"] || "0%"}</span>
                  </div>
                </div>
              </div>

              {/* Logo Display */}
              {leadData["Logo Upload"] && leadData["Logo Upload"].length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FaImage className="w-5 h-5 mr-2 text-[#f20c32]" />
                    Company Logo
                  </h2>
                  <div className="flex justify-center">
                    <img
                      src={leadData["Logo Upload"][0].url}
                      alt="Company Logo"
                      className="max-w-full h-32 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
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
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
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
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
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
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(240, 147, 251, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isCallSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleLead;