import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  changeStatus,
  getMoodMaster,
  getMoodMasterSingle,
} from "../../Reducer/MoodMasterSlice";
import { MdDelete } from "react-icons/md";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer } from "react-toastify";
import { Button } from "flowbite-react";
import AddMoodMeterModal from "../MoodMeter/AddMoodMeterModal";
// import AddMoodMasterMdoal from "./AddMoodMasterMdoal";
// import UpdateMoodMasterModal from "./UpdateMoodMasterModal";
import { getBlog, getBlogDetails, publishUnPublished } from "../../Reducer/BlogSlice";
import AddBlogModal from "./AddBlogModal";
import UpdateBlogModal from "./UpdateBlogModal";

const ManageBlogs = () => {
  const { blogList,singleBlog } = useSelector(
    (state) => state?.blog
  );
  const dispatch = useDispatch();
  const [openBlogModal, setOpenBlogModal] = useState(false);
  const [blogId, setBlogId] = useState();
  const [openUpdateBlogModal, setOpenUpdateBlogModal] =
    useState(false);

  useEffect(() => {
    dispatch(getBlog());
  }, []);
  console.log("blogList", blogList);

  const rowData = useMemo(() => {
    return (
      blogList?.data?.map((tags) => ({
        id: tags?.id,
        title: tags?.title,
        content: tags?.content,
        image_url:tags?.image_url,
        is_published: tags.is_published,
      })) || []
    );
  }, [blogList?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: "title",
        headerName: "Blog Title",
        sortable: true,
        filter: true,
      },
     {
  field: "content",
  headerName: "Content",
  sortable: true,
  filter: true,
  cellRenderer: (params) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: params.value }}
      />
    );
  },
},

      // {
      //   field: "is_published",
      //   headerName: "Status",
      //   cellRenderer: (params) => {
      //     const isChecked = params.value;

      //     const handleStatusChange = () => {
      //       const newStatus = isChecked ? 0 : 1;
      //       dispatch(
      //         changeStatus({ id: params.data.id, status: newStatus })
      //       ).then(() => {
      //         dispatch(getMoodMaster()); // refresh data after success
      //       });
      //     };

      //     return (
      //       <label className="inline-flex items-center cursor-pointer">
      //         <input
      //           type="checkbox"
      //           checked={isChecked}
      //           onChange={() => handleStatusChange(params.data.id, isChecked)}
      //           className="sr-only peer"
      //         />
      //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 relative"></div>
      //       </label>
      //     );
      //   },
      // },


      {
  field: "is_published",
  headerName: "Status",
  cellRenderer: (params) => {
    const isChecked = params.value === 1; // true if published
    const isDisabled = params.value === 1; // disable toggle if published

    const handleStatusChange = () => {
      const newStatus = isChecked ? 0 : 1;
      dispatch(publishUnPublished({ blogId: params.data.id, status: newStatus }))
        .then(() => {
          dispatch(getBlog()); // refresh data after success
        });
    };

    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => handleStatusChange()}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 
          peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
          peer-checked:bg-green-500 relative ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ></div>
      </label>
    );
  },
},

      {
        field: "image_url",
        headerName: "Image",
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
        width: 400,
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleBlogUpdate(params?.data?.id)}
                className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Update
              </button>

              {/* <button
              // onClick={() => handleDeleteZone(params?.data?.id)}
              >
                <MdDelete size={20} color="red" />
              </button> */}
            </div>
          );
        },
      },
    ],
    []
  );

  const handleBlogUpdate = (id) => {
    console.log(id, "id");
    setOpenUpdateBlogModal(true);
    setBlogId(id);
    dispatch(getBlogDetails({ user_input: id }));
  };

  return (
    <>
      <>
        <ToastContainer />
        <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
          <div className="h-full lg:h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Blog</h2>
              <Button
                onClick={() => setOpenBlogModal(true)}
                className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
              >
                Add Blog
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
                getRowHeight={() => 50}
              />
            </div>
          </div>
          {openBlogModal && (
            <AddBlogModal
              openBlogModal={openBlogModal}
              setOpenBlogModal={setOpenBlogModal}
            />
          )}
          {singleBlog && openUpdateBlogModal && (
            <UpdateBlogModal
              openUpdateBlogModal={openUpdateBlogModal}
              setOpenUpdateBlogModal={setOpenUpdateBlogModal}
              blogId={blogId}
              singleBlog={singleBlog}
            />
          )}
        </div>
      </>
    </>
  );
};
export default ManageBlogs;
