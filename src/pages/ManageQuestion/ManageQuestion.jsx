import React, { useEffect, useMemo, useState } from "react";
import { Button } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  changeStatusQuestion,
  getQuestion,
  getQuestionDetails,
} from "../../Reducer/QuestionSlice";
import AddQuestion from "./AddQuestion";
import UpdateQuestionModal from "./UpdateQuestionModal";
import DeleteModalQue from "./DeleteModalQue";
import MappingModal from "./MappingModal";
import { getAnswer } from "../../Reducer/AnswerSlice";

const ManageQuestion = () => {
  const { questionList, singleQuestion } = useSelector(
    (state) => state?.questions
  );
  const { answerList } = useSelector((state) => state?.answers);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openAddQueModal, setOpenAddQueModal] = useState(false);
  const [cateGoryId, setCategoryId] = useState();
  const [openCateDeleteModal, setOpenCateDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [questionId, setQuestionId] = useState();
  const [openQueDeleteModal, setOpenQueDeleteModal] = useState(false);
  const [openMappingModal, setOpenMappingModal] = useState(false);

  useEffect(() => {
    dispatch(getQuestion());
  }, []);
  console.log("questionList", questionList);

  const transformedRowData = useMemo(() => {
    return questionList?.data?.map((batch) => ({
      id: batch?.id,
      question: batch?.question,
      question_description: batch?.question_description,
      status: batch?.status,
    }));
  }, [questionList]);

  const columnDefs = useMemo(() => {
    const columns = [
      {
        field: "question",
        headerName: "Question",
        sortable: true,
        filter: true,
      },
      {
        field: "question_description",
        headerName: "Question Description",
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
              changeStatusQuestion({
                question_id: params.data.id,
                status: newStatus,
              })
            ).then(() => {
              dispatch(getQuestion()); // refresh data
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
        headerName: "Action",
        field: "details",
        cellRenderer: (params) => (
          <div className="flex gap-2">
            <div>
              <Button
                onClick={() => handleUpdateQuestion(params?.data?.id)}
                className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-sm px-4 py-1"
              >
                Update
              </Button>
            </div>
            {/* <div>
              <button
                type="button"
                onClick={() => handleDeleteQue(params?.data?.id)}
              >
                <MdDelete size={20} color="red" />
              </button>
            </div> */}
          </div>
        ),
      },

      {
        headerName: "Mapped Answer",
        field: "details",
        cellRenderer: (params) => (
          <div>
            <Button
              onClick={() => handleMappedWithAnsModal(params?.data?.id)}
              className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-sm px-4 py-1"
            >
              Mapped With Answer
            </Button>
          </div>
        ),
      },
    ];

    return columns;
  }, []);

  const handleUpdateQuestion = (id) => {
    setOpenUpdateModal(true);
    setQuestionId(id);
    dispatch(getQuestionDetails({ user_input: id }));
  };
  const handleAddQuestion = () => {
    setOpenAddQueModal(true);
  };
  const handleShowDetails = (id) => {
    navigate("/manage-category-des", {
      state: { id: id },
    });
  };
  const handleDeleteQue = (id) => {
    setOpenQueDeleteModal(true);
    setQuestionId(id);
  };
  const handleMappedWithAnsModal = (id) => {
    dispatch(getAnswer());
    setOpenMappingModal(true);
    setQuestionId(id);
  };
  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Question</h2>
            <Button
              onClick={() => handleAddQuestion(true)}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add Question
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
      {openAddQueModal && (
        <AddQuestion
          openAddQueModal={openAddQueModal}
          setOpenAddQueModal={setOpenAddQueModal}
        />
      )}
      {openUpdateModal && singleQuestion && (
        <UpdateQuestionModal
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          singleQuestion={singleQuestion}
          questionId={questionId}
        />
      )}
      {openQueDeleteModal && (
        <DeleteModalQue
          openQueDeleteModal={openQueDeleteModal}
          setOpenQueDeleteModal={setOpenQueDeleteModal}
          questionId={questionId}
        />
      )}
      {openMappingModal && answerList && (
        <MappingModal
          openMappingModal={openMappingModal}
          setOpenMappingModal={setOpenMappingModal}
          questionId={questionId}
          answerList={answerList}
        />
      )}
    </div>
  );
};

export default ManageQuestion;
