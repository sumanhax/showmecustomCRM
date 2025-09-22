import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, TextInput, Label, Select } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ohBatchList } from "../../Reducer/BatchSlice";
import userRoles from "../utils/userRoles";
import { getActiveDeactive, getCateGory } from "../../Reducer/CategorySlice";
import CategoryUpdateModal from "./CategoryUpdateModal";
import AddDes from "./AddDes";
import CategoryDeleteModal from "./CategoryDeleteModal";

const ManageCategory = () => {
  const { cateGory } = useSelector((state) => state?.cate);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openAddDesModal, setOpenAddDesModal] = useState(false);
  const [cateGoryId, setCategoryId] = useState();
  const [openCateDeleteModal, setOpenCateDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getCateGory());
  }, []);

  const transformedRowData = useMemo(() => {
    return cateGory?.res?.map((batch) => ({
      id: batch.id,
      name: batch.category_name,
      status: batch?.status,
      category_avatar: batch?.category_avatar,
    }));
  }, [cateGory]);

  const columnDefs = useMemo(() => {
    const columns = [
      {
        field: "name",
        headerName: "Category Name",
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
              getActiveDeactive({
                category_id: params.data.id,
                status: newStatus,
              })
            ).then(() => {
              dispatch(getCateGory()); // refresh data
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
        field: "category_avatar",
        headerName: "Avatar",
        cellRenderer: (params) => {
          return (
            <img
              src={params.value}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          );
        },
      },
      {
        headerName: "Action",
        field: "details",
        cellRenderer: (params) => (
          <div className="flex gap-2">
            <div>
              <Button
                onClick={() => handleBatchDetails(params?.data?.id)}
                className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-sm px-4 py-1"
              >
                Update
              </Button>
            </div>
            {/* <div>
              <button
                type="button"
                onClick={() => handleDeleteCate(params?.data?.id)}
              >
                <MdDelete size={20} color="red" />
              </button>
            </div> */}
          </div>
        ),
      },
    ];

    return columns;
  }, []);

  const handleBatchDetails = (id) => {
    setOpenCategoryModal(true);
    setCategoryId(id);
  };
  const handleAddDetails = () => {
    setOpenAddDesModal(true);
  };
  const handleShowDetails = (id) => {
    navigate("/manage-category-des", {
      state: { id: id },
    });
  };
  const handleDeleteCate = (id) => {
    setOpenCateDeleteModal(true);
    setCategoryId(id);
  };

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Funda-Mentals</h2>
            <Button
              onClick={() => handleAddDetails(true)}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add Funda-Mentals
            </Button>
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={transformedRowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              getRowHeight={() => 50}
            />
          </div>
        </div>
      </div>
      {openCategoryModal && (
        <CategoryUpdateModal
          openCategoryModal={openCategoryModal}
          setOpenCategoryModal={setOpenCategoryModal}
          cateGoryId={cateGoryId}
        />
      )}
      {openAddDesModal && (
        <AddDes
          openAddDesModal={openAddDesModal}
          setOpenAddDesModal={setOpenAddDesModal}
        />
      )}
      {openCateDeleteModal && (
        <CategoryDeleteModal
          openCateDeleteModal={openCateDeleteModal}
          setOpenCateDeleteModal={setOpenCateDeleteModal}
          cateGoryId={cateGoryId}
        />
      )}
    </div>
  );
};

export default ManageCategory;
