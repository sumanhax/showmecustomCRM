import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getPlanDetails } from "../../Reducer/PlanSlice";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import EditDetailsModal from "./EditDetailsModal";
import AddPlanKeyModal from "./AddPlanKeyModal";
import PlanKeyListModal from "./PlanKeyListModal";

const ShowPlanDetailsModal = ({
  openDetailsModal,
  setOpenDetailsModal,
  editId,
}) => {
  const dispatch = useDispatch();
  const [openEditPlan, setOpenEditPlan] = useState(false);
  const [detailsId, setDetailsId] = useState();
  const { allPlans } = useSelector((state) => state?.plan);

  const [openAddPlanKeyModal, setOpenAddPlanKeyModal] = useState(false);
  const [openPlanKeyListModal, setOpenPlanKeyListModal] = useState(false);

  useEffect(() => {
    dispatch(getPlanDetails({ plan_id: editId }));
  }, [editId]);

  const handleEditDetails = (id) => {
    setDetailsId(id);
    if (id) {
      setOpenEditPlan(true);
    }
  };

  const EditButtonRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleEditDetails(props.data.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </button>
      </div>
    );
  };

  const handleAddPlanKey = (id) => {
    setDetailsId(id);
    setOpenAddPlanKeyModal(true);
  };

  const handlePlanKeyList = () => {
    setOpenPlanKeyListModal(true);
  };

  const AddPlanKey = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleAddPlanKey(props.data.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors mr-2"
        >
          Add
        </button>
        <button
          onClick={() => handlePlanKeyList()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          List
        </button>
      </div>
    );
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Plan Name",
        field: "Plan.plan_name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Price",
        field: "price",
        sortable: true,
        filter: "agNumberColumnFilter",
        flex: 1,
        minWidth: 100,
        // valueFormatter: (params) => {
        //   const currency = params.data?.currency || "";
        //   const price = params.value || "";
        //   return price ? `${currency} ${price}` : "";
        // },
      },
      {
        headerName: "Currency",
        field: "currency",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: "Country",
        field: "Country.country_name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
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
      {
        headerName: "Plan Key",
        field: "Plan Key",
        width: 150,
        cellRenderer: AddPlanKey,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
      },
    ],
    []
  );

  // Default column definition
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  // Grid options
  const gridOptions = useMemo(
    () => ({
      pagination: true,
      paginationPageSize: 10,
      domLayout: "autoHeight",
      suppressHorizontalScroll: false,
      enableCellTextSelection: true,
    }),
    []
  );

  return (
    <>
      <Modal show={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Modal.Header className="border-0 pb-0"> Plan Details</Modal.Header>
        <Modal.Body>
          <div
            className="ag-theme-alpine"
            style={{ height: "400px", width: "100%" }}
          >
            <AgGridReact
              rowData={allPlans?.results || []}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={gridOptions}
              animateRows={true}
              rowSelection="single"
              suppressMenuHide={true}
            />
          </div>
          {openEditPlan && (
            <>
              <EditDetailsModal
                openEditPlan={openEditPlan}
                setOpenEditPlan={setOpenEditPlan}
                detailsId={detailsId}
                editId={editId}
              />
            </>
          )}
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>

      {openAddPlanKeyModal && (
        <AddPlanKeyModal
          openAddPlanKeyModal={openAddPlanKeyModal}
          setOpenAddPlanKeyModal={setOpenAddPlanKeyModal}
          detailsId={detailsId}
        />
      )}

      {openPlanKeyListModal && (
        <PlanKeyListModal
          openPlanKeyListModal={openPlanKeyListModal}
          setOpenPlanKeyListModal={setOpenPlanKeyListModal}
        />
      )}
    </>
  );
};
export default ShowPlanDetailsModal;
