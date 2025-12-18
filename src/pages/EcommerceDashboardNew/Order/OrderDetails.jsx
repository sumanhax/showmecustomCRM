import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { orderList } from "../../../Reducer/EcommerceNewSlice";

const money = (v) => {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return "$0.00";
  return `$${n.toFixed(2)}`;
};

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const AddressCard = ({ title, address }) => {
  if (!address) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-sm text-gray-500">No address available</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-700">{address?.line1}</p>
      {address?.line2 ? <p className="text-sm text-gray-700">{address?.line2}</p> : null}
      <p className="text-sm text-gray-700">
        {address?.city}, {address?.state} {address?.postal_code}
      </p>
      <p className="text-sm text-gray-700">{address?.country}</p>
    </div>
  );
};

const OrderDetails = () => {
    const { customerId } = useParams(); // customer_id from route
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    console.log("paramsId",customerId)
    const { orderListData, loading } = useSelector((state) => state.newecom);
  

    useEffect(() => {
      const list = orderListData?.data;
      const hasData = Array.isArray(list) && list.length > 0;
  
      if (!hasData) {
        dispatch(orderList({ page: 1, limit: 1000 }))
          .unwrap?.()
          .catch((err) => {
            console.error("orderList fetch in details error:", err);
            toast.error("Failed to load order list for details page");
          });
      }
    }, [dispatch]);
  
    console.log("orderListData",orderListData)
    //  filter from store once it exists
    const customer = useMemo(() => {
      const arr = orderListData?.data;
      if (!Array.isArray(arr)) return null;
      return arr.find((x) => x?.id === customerId) || null;
    }, [orderListData, customerId]);

    console.log("customer",customer)

    if (loading && !customer) {
        return (
          <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Loading order details...</p>
            </div>
          </div>
        );
      }

  if (!customer) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Order record not found in orderListData.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orders = Array.isArray(customer?.orders) ? customer.orders : [];

  return (
    <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
            <p className="text-sm text-gray-500 mt-1">
              Customer ID: <span className="font-mono">{customer?.id}</span> • Session:{" "}
              <span className="font-mono">{customer?.session_uuid}</span>
            </p>
          </div>
        </div>

        {/* <div
          className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
            isActive ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Customer + Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Name</label>
                <p className="text-lg text-gray-900 mt-1">
                  {customer?.first_name} {customer?.last_name}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Company</label>
                <p className="text-lg text-gray-900 mt-1">{customer?.company_name || "—"}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <p className="text-sm text-gray-800 mt-1">{customer?.email || "—"}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Phone</label>
                <p className="text-sm text-gray-800 mt-1">{customer?.phone || "—"}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Created</label>
                <p className="text-sm text-gray-800 mt-1">{formatDate(customer?.created_at)}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <div className="mt-2 flex items-center gap-2">
                  {customer?.is_active ? (
                    <>
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-sm font-semibold text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-gray-500" />
                      <span className="text-sm font-semibold text-gray-600">Inactive</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Orders ({orders.length})
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((o) => {
                  const groups = Array.isArray(o?.order_groups) ? o.order_groups : [];
                  return (
                    <div key={o?.id} className="border border-gray-200 rounded-lg p-5">
                      {/* Order header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-500">Order #</p>
                          <p className="text-lg font-bold text-gray-900">{o?.order_number}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Order ID: <span className="font-mono">{o?.id}</span> • Created:{" "}
                            {formatDate(o?.created_at)}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            {o?.status || "—"}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-100">
                            {o?.payment_status || "—"}
                          </span>
                        </div>
                      </div>

                      {/* totals */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="font-bold text-gray-900">{money(o?.subtotal_amount)}</p>
                        </div>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-500">Addons</p>
                          <p className="font-bold text-gray-900">{money(o?.addons_amount)}</p>
                        </div>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-500">Shipping</p>
                          <p className="font-bold text-gray-900">{money(o?.shipping_amount)}</p>
                        </div>
                        <div className="bg-gray-900 rounded p-3">
                          <p className="text-xs text-gray-200">Grand Total</p>
                          <p className="font-bold text-white">{money(o?.grand_total_amount)}</p>
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                        <AddressCard title="Billing Address" address={o?.billing_address} />
                        <AddressCard title="Shipping Address" address={o?.shipping_address} />
                      </div>

                      {/* Groups */}
                      <div className="mt-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Order Groups ({groups.length})
                        </h3>

                        {groups.length === 0 ? (
                          <p className="text-sm text-gray-500">No groups</p>
                        ) : (
                          <div className="space-y-4">
                            {groups.map((g) => {
                              const items = Array.isArray(g?.order_items) ? g.order_items : [];
                              return (
                                <div key={g?.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800">
                                        Hat: <span className="font-bold">{g?.hat?.name || "—"}</span>
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Group ID: <span className="font-mono">{g?.id}</span> • Qty:{" "}
                                        <span className="font-semibold">{g?.group_qty}</span>
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Style: {g?.hat?.internal_style_code || "—"}
                                      </p>
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                        Unit: {money(g?.effective_unit_price)}
                                      </span>
                                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                                        Subtotal: {money(g?.group_subtotal)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Items */}
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                      Items ({items.length})
                                    </h4>

                                    {items.length === 0 ? (
                                      <p className="text-sm text-gray-500">No items</p>
                                    ) : (
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="text-left text-xs text-gray-500 border-b">
                                              <th className="py-2 pr-2">Variant</th>
                                              <th className="py-2 pr-2">Size</th>
                                              <th className="py-2 pr-2">SKU</th>
                                              <th className="py-2 pr-2">Qty</th>
                                              <th className="py-2 pr-2">Unit</th>
                                              <th className="py-2 pr-2">Subtotal</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {items.map((it) => (
                                              <tr key={it?.id} className="border-b last:border-b-0">
                                                <td className="py-2 pr-2">
                                                  {it?.hat_size_variant?.variant_name || "—"}
                                                </td>
                                                <td className="py-2 pr-2">
                                                  {it?.hat_size_variant?.size_label || "—"}
                                                </td>
                                                <td className="py-2 pr-2 font-mono text-xs">
                                                  {it?.supplier_sku || "—"}
                                                </td>
                                                <td className="py-2 pr-2 font-semibold">{it?.quantity}</td>
                                                <td className="py-2 pr-2">{money(it?.unit_price)}</td>
                                                <td className="py-2 pr-2 font-semibold">
                                                  {money(it?.line_subtotal)}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        {/* <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-semibold">Customer</span>
                <span className="text-sm text-gray-900 font-bold">
                  {customer?.first_name} {customer?.last_name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-semibold">Orders</span>
                <span className="text-sm text-gray-900 font-bold">{orders.length}</span>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full px-4 py-2 bg-[#f20c32] hover:bg-black text-white rounded-lg text-sm font-semibold"
                >
                  Back to Orders
                </button>
              </div>

              <p className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                This page uses the existing <strong>orderListData</strong> from redux and filters by
                the URL param id.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default OrderDetails;
