import { Button, Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { deleteQuestion, getQuestion } from "../../Reducer/QuestionSlice";

const DeleteModalQue = ({
  openQueDeleteModal,
  setOpenQueDeleteModal,
  questionId,
}) => {
  const dispatch = useDispatch();
  const handleYesQue = () => {
    dispatch(deleteQuestion({ question_id: questionId })).then((res) => {
      if (res?.payload?.status_code === 200) {
        setOpenQueDeleteModal(false);
        dispatch(getQuestion());
      }
    });
  };
  return (
    <>
      <Modal
        show={openQueDeleteModal}
        onClose={() => setOpenQueDeleteModal(false)}
      >
        <Modal.Header>Are You Want to delete this Question?</Modal.Header>

        <Modal.Body>
          <div className="flex gap-3">
            <div>
              <Button
                className="cnl_btn"
                onClick={() => setOpenQueDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button onClick={handleYesQue} color="success" type="button">
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteModalQue;
