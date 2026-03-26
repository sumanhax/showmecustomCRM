import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaArrowLeft,
  FaUserAlt,
  FaUserTie,
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaMoneyBillWave,
  FaFileAlt,
  FaTags,
  FaExternalLinkAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

import { getOfflineOrderDetails } from "../../../Reducer/OrderSlice";
import { leadList } from "../../../Reducer/AddSlice";
import Loader from "../../../components/Loader";

const money = (v) => {
  const n = Number(v ?? 0);
  return Number.isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
};

const OfflineOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { offlineOrderDetailsData, offlineOrderDetailsLoading } = useSelector(
    (state) => state.order
  );


  const { leadListData } = useSelector((state) => state.add);
  const [actualLeadId, setActualLeadId] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getOfflineOrderDetails(id)).catch(() => {
        toast.error("Failed to load offline order details");
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!leadListData?.data) {
      dispatch(leadList());
    }
  }, [dispatch, leadListData]);

  const orderData = offlineOrderDetailsData?.data;

  useEffect(() => {
    if (orderData && leadListData?.data) {
      let matchedLead = leadListData.data.find(
        (lead) => lead.email === orderData.email
      );
      
      if (!matchedLead) {
        matchedLead = leadListData.data.find(
          (lead) => lead.name === orderData.leadName
        );
      }

      if (matchedLead) {
        setActualLeadId(matchedLead.id);
      }
    }
  }, [orderData, leadListData]);

  if (offlineOrderDetailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <Loader size="large" text="Loading offline order details..." />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="p-10 text-center text-red-500 font-bold bg-[#f8f9fa] min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Order record not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleViewLeadProfile = () => {
    if (actualLeadId) {
      navigate(`/lead-details/${actualLeadId}`);
    } else {
      toast.warning("Could not find the original lead profile.");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8f9fa] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white hover:bg-gray-100 rounded-xl shadow-sm border border-gray-200 transition-all"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Offline Order #{orderData.orderId}
            </h1>
            <p className="text-sm text-gray-500">
              Details for Lead: <span className="font-semibold text-gray-700">{orderData.leadName}</span>
            </p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide uppercase ${getStatusColor(orderData.orderStatus)}`}>
          {orderData.orderStatus || "N/A"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PROFILES */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Lead Profile */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FaUserAlt /> Lead Information
              </h3>
              <button 
                onClick={handleViewLeadProfile}
                className="text-xs flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition"
                title="View Lead Details"
              >
                View Lead <FaExternalLinkAlt size={10} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                {orderData.leadName?.[0]?.toUpperCase() || "L"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 leading-tight">
                  {orderData.leadName}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <FaBuilding className="text-gray-400" /> {orderData.companyName || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <FaEnvelope size={12} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                  <span className="text-sm font-semibold text-gray-700">{orderData.email || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <FaPhoneAlt size={12} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
                  <span className="text-sm font-semibold text-gray-700">{orderData.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rep Profile */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaUserTie /> Sales Representative
            </h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                {orderData.repName?.[0]?.toUpperCase() || "R"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 leading-tight">
                  {orderData.repName}
                </h2>
                <p className="text-xs text-orange-500 font-semibold mt-1">Assigned Rep</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <FaEnvelope size={12} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                  <span className="text-sm font-semibold text-gray-700">{orderData.repEmail || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <FaPhoneAlt size={12} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
                  <span className="text-sm font-semibold text-gray-700">{orderData.repPhone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Financial Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaMoneyBillWave /> Financial Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Order Amount</p>
                <p className="text-xl font-black text-gray-800">{money(orderData.orderAmount)}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Expense</p>
                <p className="text-xl font-black text-red-600">{money(orderData.expense)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Profit</p>
                <p className="text-xl font-black text-blue-600">{money(orderData.profit)}</p>
              </div>
            </div>
          </div>

          {/* Order Specs & Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaFileAlt /> Additional Details
            </h3>

            {/* Order Types Tags */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-2">
                <FaTags /> Order Types
              </p>
              <div className="flex flex-wrap gap-2">
                {orderData.orderTypes?.length > 0 ? (
                  orderData.orderTypes.map((type, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold rounded-lg tracking-wide">
                      {type}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 italic">No order types specified</span>
                )}
              </div>
            </div>

            {/* Description / Notes */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Description / Notes</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[100px]">
                {orderData.description ? (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {orderData.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic flex h-full items-center justify-center">
                    No additional description provided.
                  </p>
                )}
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfflineOrderDetails;