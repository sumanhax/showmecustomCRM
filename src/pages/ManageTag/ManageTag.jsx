import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getActiveDeactiveTags, getTags } from "../../Reducer/TagSlice";
import AddTagsModal from "./AddTagsModal";
import { ToastContainer } from "react-toastify";

const ManageTag = () => {
  const dispatch = useDispatch();
  const { allTags } = useSelector((state) => state?.tagsData);
  const [openAddTagModal, setOpenTagModal] = useState(false);
  const [openUpdateTagModal, setOpenUpdateTagModal] = useState(false);
  const [tagId, setTagId] = useState();
  useEffect(() => {
    dispatch(getTags());
  }, []);
  console.log("allTags", allTags);

  const rowData = useMemo(() => {
    return (
      allTags?.result?.map((tags) => ({
        id: tags?.id,
        tags: tags?.tags,
        status: tags.status,
      })) || []
    );
  }, [allTags?.result]);

  const columnDefs = useMemo(
    () => [
      {
        field: "tags",
        headerName: "Tags",
        sortable: true,
        filter: true,
      },
      {
        field: "status",
        headerName: "Status",
        cellRenderer: (params) => {
          const isChecked = params.value;

          const handleStatusChange = () => {
            const newStatus = isChecked ? 0 : 1;
            dispatch(
              getActiveDeactiveTags({
                tag_id: params.data.id,
                status: newStatus,
              })
            ).then(() => {
              dispatch(getTags()); // refresh data
            });
          };

          return (
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleStatusChange(params.data.id, isChecked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 relative"></div>
            </label>
          );
        },
      },
      {
        width: 400,
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateTags(params?.data?.id)}
                className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Update
              </button>

              <button
              // onClick={() => handleDeleteZone(params?.data?.id)}
              >
                <MdDelete size={20} color="red" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleUpdateTags = (id) => {
    setOpenUpdateTagModal(true);
    setTagId(id);
  };

  return (
    <>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Tag Details</h2>
            <Button
              onClick={() => setOpenTagModal(true)}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add Tag
            </Button>
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        </div>
        {openAddTagModal && (
          <AddTagsModal
            openAddTagModal={openAddTagModal}
            setOpenTagModal={setOpenTagModal}
          />
        )}
      </div>
    </>
  );
};
export default ManageTag;
