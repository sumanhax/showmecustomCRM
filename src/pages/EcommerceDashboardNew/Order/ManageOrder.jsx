import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaEye, FaSearch, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";


import { orderList } from "../../../Reducer/EcommerceNewSlice";

const ManageOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gridRef = useRef(null);

  const { orderListData, loading, error } = useSelector((state) => state.newecom);

  const [searchTerm, setSearchTerm] = useState("");


  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchOrders = useCallback(
    (p = page, l = limit) => {
      
      dispatch(orderList({ page: p, limit: l }))
        .unwrap?.()
        .catch((err) => {
          console.error("orderList error:", err);
          toast.error("Failed to fetch orders");
        });
    },
    [dispatch, page, limit]
  );

  // load on mount + whenever page/limit changes
  useEffect(() => {
    fetchOrders(page, limit);
  }, [fetchOrders, page, limit]);

  const rowData = useMemo(() => {
    const data = orderListData?.data;
    if (!Array.isArray(data)) return [];

    return data.map((c) => {
      const orders = Array.isArray(c?.orders) ? c.orders : [];
      const latest = orders?.[0];

      return {
        id: c?.id,
        first_name: c?.first_name || "",
        last_name: c?.last_name || "",
        email: c?.email || "",
        phone: c?.phone || "",
        company_name: c?.company_name || "",
        orders_count: orders.length,
        latest_order_number: latest?.order_number || "-",
        latest_status: latest?.status || "-",
        latest_payment_status: latest?.payment_status || "-",
        created_at: c?.created_at,
        is_active: c?.is_active === 1 || c?.is_active === true,
      };
    });
  }, [orderListData]);

  // local filtering (within current page)
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rowData;
    const s = searchTerm.toLowerCase();
    return rowData.filter(
      (r) =>
        (r.first_name && r.first_name.toLowerCase().includes(s)) ||
        (r.last_name && r.last_name.toLowerCase().includes(s)) ||
        (r.email && r.email.toLowerCase().includes(s)) ||
        (r.phone && String(r.phone).toLowerCase().includes(s)) ||
        (r.company_name && r.company_name.toLowerCase().includes(s)) ||
        (r.latest_order_number && r.latest_order_number.toLowerCase().includes(s))
    );
  }, [rowData, searchTerm]);

  const ActionsRenderer = (params) => {
    const customerId = params?.data?.id;
    return (
      <div className="flex justify-center items-center">
        <button
          onClick={() => navigate(`/order/${customerId}`)}
          className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded-full transition-colors"
          title="View"
        >
          <FaEye size={14} />
        </button>
      </div>
    );
  };

  const StatusRenderer = (params) => {
    const isActive = params.value === true;
    return (
      <span
        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const columnDefs = [
    {
      headerName: "Customer",
      flex: 1.2,
      valueGetter: (p) => `${p.data.first_name || ""} ${p.data.last_name || ""}`.trim(),
      sortable: true,
      filter: true,
    },
    { field: "email", headerName: "Email", flex: 1.4, sortable: true, filter: true },
    { field: "phone", headerName: "Phone", flex: 1, sortable: true, filter: true },
    { field: "company_name", headerName: "Company", flex: 1, sortable: true, filter: true },
    { field: "orders_count", headerName: "Orders", width: 110, sortable: true, filter: true },
    {
      field: "latest_order_number",
      headerName: "Latest Order #",
      flex: 1.4,
      sortable: true,
      filter: true,
    },
    { field: "latest_status", headerName: "Status", flex: 1, sortable: true, filter: true },
    {
      field: "latest_payment_status",
      headerName: "Payment",
      flex: 1,
      sortable: true,
      filter: true,
    },
    { field: "is_active", headerName: "Account", width: 120, cellRenderer: StatusRenderer },
    { headerName: "Actions", width: 110, pinned: "right", cellRenderer: ActionsRenderer },
  ];

  // ✅ AgGrid pagination -> update payload
  const onPaginationChanged = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const currentPageIndex = api.paginationGetCurrentPage(); // 0-based
    const newPage = currentPageIndex + 1;

    // update page only if changed (prevents loops)
    if (newPage !== page) setPage(newPage);
  };

  const onPageSizeChanged = (newLimit) => {
    // reset to first page when page size changes
    setLimit(newLimit);
    setPage(1);

    // update aggrid local page size too
    const api = gridRef.current?.api;
    api?.paginationSetPageSize?.(newLimit);
  };

  if (loading) {
    return (
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen flex items-center justify-center">
          <Loader size="large" text="Loading orders..." />
        </div>
      </div>
    );
  }

  if (error) console.error("order error:", error);

  return (
    <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
      <div className="h-full lg:h-screen">
        <div className="flex justify-start items-center mb-4 gap-72 relative">
          <h1 className="text-2xl font-semibold">Orders</h1>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customer, email, phone, order #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="w-4 h-4 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  type="button"
                >
                  <FaTimes className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* ✅ Page Size selector (syncs with server payload) */}
          {/* <select
            value={limit}
            onChange={(e) => onPageSizeChanged(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            title="Rows per page"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select> */}
        </div>

        {searchTerm && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredRows.length} of {rowData.length} customers (current page)
            </p>
          </div>
        )}

        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={filteredRows}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={limit}
            suppressPaginationPanel={false}
            onPaginationChanged={onPaginationChanged}
            domLayout="autoHeight"
            getRowHeight={() => 52}
          />
        </div>

        {/* Optional: show current server paging */}
        <div className="mt-3 text-xs text-gray-500 flex justify-end">
          Page: <span className="font-semibold ml-1">{page}</span> • Limit:{" "}
          <span className="font-semibold ml-1">{limit}</span>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;
