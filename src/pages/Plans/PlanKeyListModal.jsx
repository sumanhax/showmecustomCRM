import { AgGridReact } from "ag-grid-react";
import { Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { planKeyList } from "../../Reducer/PlanKeySlice";
import UpdatePlanKeyModal from "./UpdatePlanKeyModal";

const PlanKeyListModal = ({ openPlanKeyListModal, setOpenPlanKeyListModal }) => {
    const dispatch = useDispatch();
    const { planKeys } = useSelector((state) => state?.plankey);
    console.log("planKeys", planKeys)
    const [openUpdatePlanKeyModal, setOpenUpdatePlanKeyModal] = useState(false);
    const [planKeyId, setPlanKeyId] = useState("");

    useEffect(() => {
        dispatch(planKeyList())
    }, [dispatch]);

    const handleEditPlanKey = (id) => {
        setPlanKeyId(id);
        setOpenUpdatePlanKeyModal(true);
    };

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
    const EditButtonRenderer = (props) => {
        return (
            <div className="flex items-center h-full">
                <button
                    onClick={() => handleEditPlanKey(props.data.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Edit
                </button>
            </div>
        );
    };

    // Column Definitions
    const columnDefs = useMemo(
        () => [
            {
                headerName: "Plan Price Keys",
                field: "plan_price_key",
                flex: 1,
                minWidth: 200,
                cellClass: "flex items-center",
            },
            {
                headerName: "Plan Extrakey Keys",
                field: "plan_extrakey_key",
                flex: 1,
                minWidth: 200,
                cellClass: "flex items-center",
            },
            {
                headerName: "Plan Price",
                field: "PlanDetail.price",
                flex: 1,
                minWidth: 120,
                cellClass: "flex items-center",
            },
            {
                headerName: "Status",
                field: "status",
                width: 120,
                cellRenderer: StatusCellRenderer,
                cellClass: "flex items-center",
            },
            {
                headerName: "Actions",
                field: "actions",
                width: 100,
                cellRenderer: EditButtonRenderer,
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
        pagination: true,
        paginationPageSize: 5,
        domLayout: "autoHeight",
        suppressHorizontalScroll: false,
        rowHeight: 60,
    };

    return (
        <>
            <Modal show={openPlanKeyListModal} onClose={() => setOpenPlanKeyListModal(false)}>
                <Modal.Header>Plan Key List</Modal.Header>
                <Modal.Body>
                    <div
                        className="ag-theme-alpine"
                        style={{ height: "400px", width: "100%" }}
                    >
                        <AgGridReact
                            rowData={planKeys?.results || []}
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

            {openUpdatePlanKeyModal &&
                <UpdatePlanKeyModal
                    openUpdatePlanKeyModal={openUpdatePlanKeyModal}
                    setOpenUpdatePlanKeyModal={setOpenUpdatePlanKeyModal}
                    planKeyId={planKeyId}
                />
            }
        </>
    )
};

export default PlanKeyListModal;