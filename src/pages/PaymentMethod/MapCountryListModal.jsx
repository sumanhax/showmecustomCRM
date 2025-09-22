import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { paymentMethodCountryDropdown } from "../../Reducer/PaymentMethodSlice";
import { Modal } from "flowbite-react";
import { AgGridReact } from "ag-grid-react";

const MapCountryListModal = ({ openMapCountryList, setOpenMapCountryList, paymentMethodId }) => {
    console.log("paymentMethodId", paymentMethodId)
    const dispatch = useDispatch();
    const { paymentMethodCountry } = useSelector((state) => state?.paymentMethod);
    console.log("paymentMethodCountry", paymentMethodCountry)
    // const [openUpdatePlanKeyModal, setOpenUpdatePlanKeyModal] = useState(false);
    // const [planKeyId, setPlanKeyId] = useState("");

    useEffect(() => {
        dispatch(paymentMethodCountryDropdown({ payment_method_id: paymentMethodId }))
    }, [dispatch, paymentMethodId]);

    // const handleEditPlanKey = (id) => {
    //     setPlanKeyId(id);
    //     setOpenUpdatePlanKeyModal(true);
    // };

    const StatusCellRenderer = (props) => {
        const isActive = props.value === 1;
        const statusText = isActive ? "Active" : "Inactive";
        const statusColor = isActive ? "#10B981" : "#EF4444"; // Green for active, Red for inactive

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
    // const EditButtonRenderer = (props) => {
    //     return (
    //         <div className="flex items-center h-full">
    //             <button
    //                 onClick={() => handleEditPlanKey(props.data.id)}
    //                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    //             >
    //                 Edit
    //             </button>
    //         </div>
    //     );
    // };

    // Column Definitions
    const columnDefs = useMemo(
        () => [
            {
                headerName: "Country Name",
                field: "country_name",
                flex: 1,
                minWidth: 200,
                cellClass: "flex items-center",
            },
            {
                headerName: "Country Short Name",
                field: "country_short_name",
                flex: 1,
                minWidth: 200,
                cellClass: "flex items-center",
            },
            {
                headerName: "Status",
                field: "status",
                width: 120,
                cellRenderer: StatusCellRenderer,
                cellClass: "flex items-center",
            },
            // {
            //     headerName: "Actions",
            //     field: "actions",
            //     width: 100,
            //     cellRenderer: EditButtonRenderer,
            //     sortable: false,
            //     filter: false,
            //     cellClass: "flex items-center",
            // },
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
        pagination: true,
        paginationPageSize: 5,
        domLayout: "autoHeight",
        suppressHorizontalScroll: false,
        rowHeight: 60,
    };

    return (
        <>
            <Modal show={openMapCountryList} onClose={() => setOpenMapCountryList(false)}>
                <Modal.Header>Map Country List</Modal.Header>
                <Modal.Body>
                    <div
                        className="ag-theme-alpine"
                        style={{ height: "400px", width: "100%" }}
                    >
                        <AgGridReact
                            rowData={paymentMethodCountry?.data || []}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            gridOptions={gridOptions}
                            animateRows={true}
                            rowSelection="single"
                            suppressMenuHide={true}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>

        </>
    )
};

export default MapCountryListModal;