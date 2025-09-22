import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  getQuestion,
  updateQuestionDetails,
} from "../../Reducer/QuestionSlice";

const UpdateQuestionModal = ({
  openUpdateModal,
  setOpenUpdateModal,
  singleQuestion,
  questionId,
}) => {
  const dispatch = useDispatch();
  console.log("singleQuestion", singleQuestion);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    setValue("question", singleQuestion?.data?.question);
    setValue(
      "question_description",
      singleQuestion?.data?.question_description
    );
  }, [singleQuestion]);
  const onSubmit = (data) => {
    dispatch(updateQuestionDetails({ question_id: questionId, ...data })).then(
      (res) => {
        if (res?.payload?.status_code === 200) {
          setOpenUpdateModal(false);
          dispatch(getQuestion());
        }
      }
    );
  };
  return (
    <>
      <Modal show={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <Modal.Header>Update Questions</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Question" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Question"
                  {...register("question")}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Question Description" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Question Description"
                  {...register("question_description")}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Update Question
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default UpdateQuestionModal;
