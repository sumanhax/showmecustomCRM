import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import userRoles from "../utils/userRoles";
import { getPaymentMethods } from "../../Reducer/PaymentMethodSlice";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import UpdatePaymentMethodModal from "./UpdatePaymentMethodModal";
import MapCountryListModal from "./MapCountryListModal";
import MapCountryAddModal from "./MapCountryAddModal";
import PaymentMethodKeyModal from "./PaymentMethodKeyModal";

const PaymentMethodList = () => {
  const dispatch = useDispatch();
  const { paymentMethods } = useSelector((state) => state?.paymentMethod);
  console.log("paymentMethods", paymentMethods);
  const currentUserRole = userRoles();
  const [openAddPaymentMethodModal, setOpenAddPaymentMethodModal] =
    useState(false);
  const [openUpdatePaymentMethodModal, setOpenUpdatePaymentMethodModal] =
    useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [openMapCountryList, setOpenMapCountryList] = useState(false);
  const [openMapCountryAdd, setOpenMapCountryAdd] = useState(false);
  const [openPaymentMethodKey, setOpenPaymentMethodKey] = useState(false);

  useEffect(() => {
    dispatch(getPaymentMethods());
  }, [dispatch]);

  const handleEditPaymentMethod = (id) => {
    setPaymentMethodId(id);
    setOpenUpdatePaymentMethodModal(true);
  };

  const handleMapCountryList = (id) => {
    setPaymentMethodId(id);
    setOpenMapCountryList(true);
  };

  const handleMapCountryAdd = (id) => {
    setPaymentMethodId(id);
    setOpenMapCountryAdd(true);
  };

  const handlePaymentMethodKey = (id) => {
    setPaymentMethodId(id);
    setOpenPaymentMethodKey(true);
  };

  const StatusCellRenderer = (props) => {
    const isActive = props.value === 1;
    const statusText = isActive ? "Active" : "Inactive";
    const statusColor = isActive ? "#52b69a" : "#EF4444"; // Green for active, Red for inactive

    return (
      <div className="flex items-center h-full">
        <span
          className="px-3 py-1 rounded-full text-white text-sm font-medium"
          style={{ backgroundColor: statusColor }}
        >
          {statusText}
        </span>
      </div>
    );
  };

  // Edit Button Cell Renderer Component
  const EditButtonRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleEditPaymentMethod(props.data.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handlePaymentMethodKey(props.data.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Plan Key
        </button>
      </div>
    );
  };

  const MapCountryHandler = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleMapCountryAdd(props.data.id)}
          className="bg-black hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors mr-2"
        >
          Add
        </button>
        <button
          onClick={() => handleMapCountryList(props.data.id)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          List
        </button>
      </div>
    );
  };

  // Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Payment Methods",
        field: "name",
        flex: 1,
        minWidth: 150,
        cellClass: "flex items-center",
      },
      {
        headerName: "Short Name",
        field: "short_name",
        flex: 1,
        minWidth: 100,
        cellClass: "flex items-center",
      },
      {
        headerName: "Status",
        field: "status",
        width: 100,
        cellRenderer: StatusCellRenderer,
        cellClass: "flex items-center",
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 200,
        cellRenderer: EditButtonRenderer,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
      },
      {
        headerName: "Map Country",
        field: "map country",
        width: 150,
        cellRenderer: MapCountryHandler,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
      },
    ],
    []
  );

  // Default Column Definition
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Grid Options
  const gridOptions = {
    domLayout: "autoHeight",
    suppressHorizontalScroll: false,
    rowHeight: 60,
  };

  const handleAddPaymentMethod = () => {
    setOpenAddPaymentMethodModal(true);
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
          <div className="h-full lg:h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Payment Method</h2>
              {/* {currentUserRole === "SA" && (
                <>
                  <Button
                    onClick={() => handleAddPaymentMethod()}
                    className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
                  >
                    Add Payment Method
                  </Button>
                </>
              )} */}
            </div>

            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              <AgGridReact
                rowData={paymentMethods?.data || []}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                gridOptions={gridOptions}
                animateRows={true}
                rowSelection="single"
                suppressMenuHide={true}
                pagination={true}
                paginationPageSize={5}
              />
            </div>
          </div>
        </div>
      </div>

      {openAddPaymentMethodModal && (
        <AddPaymentMethodModal
          openAddPaymentMethodModal={openAddPaymentMethodModal}
          setOpenAddPaymentMethodModal={setOpenAddPaymentMethodModal}
        />
      )}

      {openUpdatePaymentMethodModal && (
        <UpdatePaymentMethodModal
          openUpdatePaymentMethodModal={openUpdatePaymentMethodModal}
          setOpenUpdatePaymentMethodModal={setOpenUpdatePaymentMethodModal}
          paymentMethodId={paymentMethodId}
        />
      )}

      {openMapCountryList && (
        <MapCountryListModal
          openMapCountryList={openMapCountryList}
          setOpenMapCountryList={setOpenMapCountryList}
          paymentMethodId={paymentMethodId}
        />
      )}

      {openMapCountryAdd && (
        <MapCountryAddModal
          openMapCountryAdd={openMapCountryAdd}
          setOpenMapCountryAdd={setOpenMapCountryAdd}
          paymentMethodId={paymentMethodId}
        />
      )}

      {openPaymentMethodKey && (
        <PaymentMethodKeyModal
          openPaymentMethodKey={openPaymentMethodKey}
          setOpenPaymentMethodKey={setOpenPaymentMethodKey}
          paymentMethodId={paymentMethodId}
        />
      )}
    </>
  );
};

export default PaymentMethodList;
