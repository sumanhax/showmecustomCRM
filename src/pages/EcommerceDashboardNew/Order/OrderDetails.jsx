// import { useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { orderList } from "../../../Reducer/EcommerceNewSlice";

// const money = (v) => {
//   const n = Number(v ?? 0);
//   if (Number.isNaN(n)) return "$0.00";
//   return `$${n.toFixed(2)}`;
// };

// const formatDate = (d) => {
//   if (!d) return "—";
//   const dt = new Date(d);
//   if (Number.isNaN(dt.getTime())) return "—";
//   return dt.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
// };

// const AddressCard = ({ title, address }) => {
//   if (!address) {
//     return (
//       <div className="border border-gray-200 rounded-lg p-4 bg-white">
//         <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
//         <p className="text-sm text-gray-500">No address available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="border border-gray-200 rounded-lg p-4 bg-white">
//       <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
//       <p className="text-sm text-gray-700">{address?.line1}</p>
//       {address?.line2 ? <p className="text-sm text-gray-700">{address?.line2}</p> : null}
//       <p className="text-sm text-gray-700">
//         {address?.city}, {address?.state} {address?.postal_code}
//       </p>
//       <p className="text-sm text-gray-700">{address?.country}</p>
//     </div>
//   );
// };

// const OrderDetails = () => {
//     const { customerId } = useParams(); // customer_id from route
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     console.log("paramsId",customerId)
//     const { orderListData, loading } = useSelector((state) => state.newecom);


//     useEffect(() => {
//       const list = orderListData?.data;
//       const hasData = Array.isArray(list) && list.length > 0;

//       if (!hasData) {
//         dispatch(orderList({ page: 1, limit: 1000 }))
//           .unwrap?.()
//           .catch((err) => {
//             console.error("orderList fetch in details error:", err);
//             toast.error("Failed to load order list for details page");
//           });
//       }
//     }, [dispatch]);

//     console.log("orderListData",orderListData)
//     //  filter from store once it exists
//     const customer = useMemo(() => {
//       const arr = orderListData?.data;
//       if (!Array.isArray(arr)) return null;
//       return arr.find((x) => x?.id === customerId) || null;
//     }, [orderListData, customerId]);

//     console.log("customer",customer)

//     if (loading && !customer) {
//         return (
//           <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//             <div className="h-full flex items-center justify-center">
//               <p className="text-gray-500">Loading order details...</p>
//             </div>
//           </div>
//         );
//       }

//   if (!customer) {
//     return (
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//         <div className="h-full flex items-center justify-center">
//           <div className="text-center">
//             <p className="text-gray-600">Order record not found in orderListData.</p>
//             <button
//               onClick={() => navigate(-1)}
//               className="mt-4 px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg"
//             >
//               Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const orders = Array.isArray(customer?.orders) ? customer.orders : [];

//   return (
//     <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             title="Back"
//           >
//             <FaArrowLeft className="w-5 h-5 text-gray-600" />
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Customer ID: <span className="font-mono">{customer?.id}</span> • Session:{" "}
//               <span className="font-mono">{customer?.session_uuid}</span>
//             </p>
//           </div>
//         </div>

//         {/* <div
//           className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
//             isActive ? "bg-green-500" : "bg-gray-400"
//           }`}
//         >
//           {isActive ? "Active" : "Inactive"}
//         </div> */}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left: Customer + Orders */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Customer Card */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Name</label>
//                 <p className="text-lg text-gray-900 mt-1">
//                   {customer?.first_name} {customer?.last_name}
//                 </p>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Company</label>
//                 <p className="text-lg text-gray-900 mt-1">{customer?.company_name || "—"}</p>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Email</label>
//                 <p className="text-sm text-gray-800 mt-1">{customer?.email || "—"}</p>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Phone</label>
//                 <p className="text-sm text-gray-800 mt-1">{customer?.phone || "—"}</p>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Created</label>
//                 <p className="text-sm text-gray-800 mt-1">{formatDate(customer?.created_at)}</p>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-600">Status</label>
//                 <div className="mt-2 flex items-center gap-2">
//                   {customer?.is_active ? (
//                     <>
//                       <FaCheckCircle className="text-green-500" />
//                       <span className="text-sm font-semibold text-green-600">Active</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaTimesCircle className="text-gray-500" />
//                       <span className="text-sm font-semibold text-gray-600">Inactive</span>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Orders List */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 Orders ({orders.length})
//               </h2>
//             </div>

//             {orders.length === 0 ? (
//               <div className="text-center py-10 bg-gray-50 rounded">
//                 <p className="text-gray-500">No orders found</p>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {orders.map((o) => {
//                   const groups = Array.isArray(o?.order_groups) ? o.order_groups : [];
//                   return (
//                     <div key={o?.id} className="border border-gray-200 rounded-lg p-5">
//                       {/* Order header */}
//                       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                         <div>
//                           <p className="text-sm text-gray-500">Order #</p>
//                           <p className="text-lg font-bold text-gray-900">{o?.order_number}</p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Order ID: <span className="font-mono">{o?.id}</span> • Created:{" "}
//                             {formatDate(o?.created_at)}
//                           </p>
//                         </div>

//                         <div className="flex gap-2 flex-wrap">
//                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
//                             {o?.status || "—"}
//                           </span>
//                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-100">
//                             {o?.payment_status || "—"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* totals */}
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
//                         <div className="bg-gray-50 rounded p-3">
//                           <p className="text-xs text-gray-500">Subtotal</p>
//                           <p className="font-bold text-gray-900">{money(o?.subtotal_amount)}</p>
//                         </div>
//                         <div className="bg-gray-50 rounded p-3">
//                           <p className="text-xs text-gray-500">Addons</p>
//                           <p className="font-bold text-gray-900">{money(o?.addons_amount)}</p>
//                         </div>
//                         <div className="bg-gray-50 rounded p-3">
//                           <p className="text-xs text-gray-500">Shipping</p>
//                           <p className="font-bold text-gray-900">{money(o?.shipping_amount)}</p>
//                         </div>
//                         <div className="bg-gray-900 rounded p-3">
//                           <p className="text-xs text-gray-200">Grand Total</p>
//                           <p className="font-bold text-white">{money(o?.grand_total_amount)}</p>
//                         </div>
//                       </div>

//                       {/* Addresses */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
//                         <AddressCard title="Billing Address" address={o?.billing_address} />
//                         <AddressCard title="Shipping Address" address={o?.shipping_address} />
//                       </div>

//                       {/* Groups */}
//                       <div className="mt-5">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           Order Groups ({groups.length})
//                         </h3>

//                         {groups.length === 0 ? (
//                           <p className="text-sm text-gray-500">No groups</p>
//                         ) : (
//                           <div className="space-y-4">
//                             {groups.map((g) => {
//                               const items = Array.isArray(g?.order_items) ? g.order_items : [];
//                               return (
//                                 <div key={g?.id} className="border border-gray-200 rounded-lg p-4 bg-white">
//                                   <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
//                                     <div>
//                                       <p className="text-sm font-semibold text-gray-800">
//                                         Hat: <span className="font-bold">{g?.hat?.name || "—"}</span>
//                                       </p>
//                                       <p className="text-xs text-gray-500 mt-1">
//                                         Group ID: <span className="font-mono">{g?.id}</span> • Qty:{" "}
//                                         <span className="font-semibold">{g?.group_qty}</span>
//                                       </p>
//                                       <p className="text-xs text-gray-500 mt-1">
//                                         Style: {g?.hat?.internal_style_code || "—"}
//                                       </p>
//                                     </div>

//                                     <div className="flex gap-2 flex-wrap">
//                                       <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
//                                         Unit: {money(g?.effective_unit_price)}
//                                       </span>
//                                       <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
//                                         Subtotal: {money(g?.group_subtotal)}
//                                       </span>
//                                     </div>
//                                   </div>

//                                   {/* Items */}
//                                   <div className="mt-4">
//                                     <h4 className="text-sm font-semibold text-gray-800 mb-2">
//                                       Items ({items.length})
//                                     </h4>

//                                     {items.length === 0 ? (
//                                       <p className="text-sm text-gray-500">No items</p>
//                                     ) : (
//                                       <div className="overflow-x-auto">
//                                         <table className="w-full text-sm">
//                                           <thead>
//                                             <tr className="text-left text-xs text-gray-500 border-b">
//                                               <th className="py-2 pr-2">Variant</th>
//                                               <th className="py-2 pr-2">Size</th>
//                                               <th className="py-2 pr-2">SKU</th>
//                                               <th className="py-2 pr-2">Qty</th>
//                                               <th className="py-2 pr-2">Unit</th>
//                                               <th className="py-2 pr-2">Subtotal</th>
//                                             </tr>
//                                           </thead>
//                                           <tbody>
//                                             {items.map((it) => (
//                                               <tr key={it?.id} className="border-b last:border-b-0">
//                                                 <td className="py-2 pr-2">
//                                                   {it?.hat_size_variant?.variant_name || "—"}
//                                                 </td>
//                                                 <td className="py-2 pr-2">
//                                                   {it?.hat_size_variant?.size_label || "—"}
//                                                 </td>
//                                                 <td className="py-2 pr-2 font-mono text-xs">
//                                                   {it?.supplier_sku || "—"}
//                                                 </td>
//                                                 <td className="py-2 pr-2 font-semibold">{it?.quantity}</td>
//                                                 <td className="py-2 pr-2">{money(it?.unit_price)}</td>
//                                                 <td className="py-2 pr-2 font-semibold">
//                                                   {money(it?.line_subtotal)}
//                                                 </td>
//                                               </tr>
//                                             ))}
//                                           </tbody>
//                                         </table>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right: Summary */}
//         {/* <div className="lg:col-span-1">
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600 font-semibold">Customer</span>
//                 <span className="text-sm text-gray-900 font-bold">
//                   {customer?.first_name} {customer?.last_name}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600 font-semibold">Orders</span>
//                 <span className="text-sm text-gray-900 font-bold">{orders.length}</span>
//               </div>

//               <div className="pt-3 border-t border-gray-100">
//                 <button
//                   onClick={() => navigate(-1)}
//                   className="w-full px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold"
//                 >
//                   Back to Orders
//                 </button>
//               </div>

//               <p className="text-xs text-gray-500 pt-3 border-t border-gray-100">
//                 This page uses the existing <strong>orderListData</strong> from redux and filters by
//                 the URL param id.
//               </p>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaArrowLeft, FaCheckCircle, FaTimesCircle, FaChevronDown,
  FaChevronUp, FaBox, FaCreditCard, FaMapMarkerAlt, FaImage,
  FaHatWizard, FaStickyNote, FaInfoCircle
} from "react-icons/fa";
import { orderList } from "../../../Reducer/EcommerceNewSlice";
import { toast } from "react-toastify";

const money = (v) => {
  const n = Number(v ?? 0);
  return Number.isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
};

const AccordionItem = ({ title, children, defaultOpen = false, icon: Icon, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-gray-500" />}
          <span className="font-bold text-gray-700">{title}</span>
          {badge && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">{badge}</span>}
        </div>
        {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
      </button>
      {isOpen && <div className="p-4 border-t border-gray-100 bg-white">{children}</div>}
    </div>
  );
};

const OrderDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderListData, loading } = useSelector((state) => state.newecom);

  useEffect(() => {
    if (!orderListData?.data?.length) {
      dispatch(orderList({ page: 1, limit: 1000 })).catch(() => toast.error("Failed to load data"));
    }
  }, [dispatch, orderListData]);

  const customerData = useMemo(() => {
    const arr = orderListData?.data || [];
    return arr.find((x) => String(x?.customer?.id) === String(customerId)) || null;
  }, [orderListData, customerId]);

  if (loading && !customerData) return <div className="p-10 text-center font-bold animate-pulse">Loading detailed order info...</div>;
  if (!customerData) return <div className="p-10 text-center text-red-500">Order record not found.</div>;

  const { customer, orders } = customerData;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-[#f8f9fa] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-gray-100 rounded-xl shadow-sm border border-gray-200 transition-all">
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Details</h1>
            <p className="text-sm text-gray-500">Managing orders for {customer?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT: CUSTOMER PROFILE */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-4">
              {customer?.first_name?.[0]}
            </div>
            <h2 className="text-xl font-bold text-gray-800 uppercase leading-none">{customer?.first_name} {customer?.last_name}</h2>
            <p className="text-sm text-gray-400 font-medium mb-4 uppercase">Company: <span className="text-blue-600">{customer?.company_name}</span></p>

            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase">Phone</span>
                <span className="text-sm font-semibold">{customer?.phone || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase">Registered Email</span>
                <span className="text-sm font-semibold truncate">{customer?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ORDERS ACCORDION */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            Order History List
          </h3>

          {orders?.map((order) => (
            <AccordionItem
              key={order.id}
              title={`ORDER ${order.order_number}`}
              badge={order.status}
              icon={FaBox}
            >
              <div className="space-y-6">

                {/* 1. FINANCIAL SUMMARY */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Subtotal</p>
                    <p className="font-bold text-gray-700">{money(order.subtotal_amount)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Addons</p>
                    <p className="font-bold text-gray-700">{money(order.addons_amount)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Setup Fee</p>
                    <p className="font-bold text-gray-700">{money(order.artwork_setup_amount)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Shipping</p>
                    <p className="font-bold text-gray-700">{money(order.shipping_amount)}</p>
                  </div>
                  <div className="p-3 bg-green-600 text-white rounded-lg shadow-md">
                    <p className="text-[10px] font-bold opacity-80 uppercase">Grand Total</p>
                    <p className="text-lg font-black">{money(order.grand_total_amount)}</p>
                  </div>
                </div>

                {/* 2. PRODUCT DETAILS (HATS) */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b border-gray-100 flex items-center gap-2">
                    <FaHatWizard className="text-gray-500" />
                    <span className="text-xs font-black uppercase text-gray-600">Purchased Items</span>
                  </div>
                  <div className="p-0">
                    {order.order_groups?.map((group) => (
                      <div key={group.id} className="p-4 border-b last:border-0 border-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-black text-gray-800 uppercase tracking-tight text-lg">{group.hat?.name || 'Unknown Hat'}</h4>
                            <p className="text-xs text-blue-500 font-bold">Style Code: {group.hat?.internal_style_code || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-400">GROUP TOTAL</p>
                            <p className="font-black text-gray-800">{money(group.group_subtotal)}</p>
                          </div>
                        </div>

                        {/* Size Breakdown Table */}
                        <table className="w-full text-left text-sm">
                          <thead className="text-[10px] text-gray-400 uppercase font-black">
                            <tr>
                              <th className="pb-2">Size/Variant</th>
                              <th className="pb-2">SKU</th>
                              <th className="pb-2 text-center">Qty</th>
                              <th className="pb-2 text-right">Unit Price</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700">
                            {group.order_items?.map((item) => (
                              <tr key={item.id} className="border-t border-gray-50">
                                <td className="py-2 font-medium">{item.hat_size_variant?.size_label} ({item.hat_size_variant?.variant_name})</td>
                                <td className="py-2 font-mono text-xs">{item.supplier_sku}</td>
                                <td className="py-2 text-center font-bold">{item.quantity}</td>
                                <td className="py-2 text-right font-semibold">{money(item.unit_price)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ARTWORK & LOGO */}
                <AccordionItem title="Artwork & Decoration" icon={FaImage}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Artwork Logo</p>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${order.artwork_config?.logo?.original_file_url}`}
                        alt="Logo"
                        className="w-full max-w-[200px] h-auto border-2 border-gray-100 rounded-lg shadow-sm"
                      />
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-bold text-blue-700">Setup Plan: {order.artwork_config?.setup_plan?.name}</p>
                        <p className="text-[10px] text-blue-500 font-medium">{order.artwork_config?.setup_plan?.description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Logo Specs</p>
                        <ul className="text-sm mt-1 space-y-1">
                          <li><span className="text-gray-400">Shape:</span> <span className="font-bold">{order.artwork_config?.patch_shape}</span></li>
                          <li><span className="text-gray-400">Color:</span> <span className="font-bold">{order.artwork_config?.patch_color}</span></li>
                          <li><span className="text-gray-400">Placement:</span> <span className="font-bold uppercase">{order.artwork_config?.logo_placement?.replace('_', ' ')}</span></li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Decoration Addons</p>
                        <div className="flex flex-wrap gap-2">
                          {order.artwork_config?.addons?.map(a => (
                            <span
                              key={a.id}
                              className="
                              px-3 py-1
                              text-xs
                              font-semibold
                              tracking-wide
                              bg-gray-100
                              text-gray-800
                              rounded-full
                              uppercase
                              border
                            "
                            >
                              {a.decoration_addon?.name}
                            </span>
                          ))}
                        </div>

                      </div>
                    </div>

                  </div>
                  {/* 4. NOTES & INSTRUCTIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                      <h4 className="text-[10px] font-black text-yellow-700 uppercase flex items-center gap-2 mb-2">
                        <FaStickyNote /> Customer Order Notes
                      </h4>
                      <p className="text-sm text-yellow-900 italic">
                        {order.artwork_config?.order_notes || "No special instructions provided."}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                      {/* <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 ">
                        <FaInfoCircle /> Artwork Notes
                      </h4>
                      <p className="text-xs text-gray-600">
                        {order.artwork_config?.order_notes || "No artwork notes."}
                      </p> */}
                      <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 mt-4">
                        <FaInfoCircle /> Logo Placement Notes:
                      </h4>
                      <p className="text-xs text-gray-600">
                        {order.artwork_config?.placement_notes || "No Logo Placement Notes."}
                      </p>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 mt-4">
                        <FaInfoCircle /> Logo Color Notes:
                      </h4>
                      <p className="text-xs text-gray-600">
                        {order.artwork_config?.logo_size_notes || "No Color Notes."}
                      </p>
                    </div>
                  </div>
                </AccordionItem>
                {/* 5. DATES */}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Session: {order.session_uuid}</span>
                  <span>Created: {formatDate(order.created_at)}</span>
                </div>

              </div>
            </AccordionItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
