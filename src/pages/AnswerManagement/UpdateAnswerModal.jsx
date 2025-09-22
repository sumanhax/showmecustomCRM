import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  getQuestion,
  updateQuestionDetails,
} from "../../Reducer/QuestionSlice";
import { getAnswer, updateAnswerDetails } from "../../Reducer/AnswerSlice";

const UpdateAnswerModal = ({
  openUpdateAnsModal,
  setOpenUpdateAnsModal,
  singleAnswer,
  ansId,
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    setValue("answer", singleAnswer?.data?.answer);
    setValue("answer_point", singleAnswer?.data?.answer_point);
  }, [singleAnswer]);
  const onSubmit = (data) => {
    dispatch(updateAnswerDetails({ answer_id: ansId, ...data })).then((res) => {
      if (res?.payload?.status_code === 200) {
        setOpenUpdateAnsModal(false);
        dispatch(getAnswer());
      }
    });
  };
  return (
    <>
      <Modal
        show={openUpdateAnsModal}
        onClose={() => setOpenUpdateAnsModal(false)}
      >
        <Modal.Header>Update Questions</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Answer" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Answer"
                  {...register("answer")}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Answer Point" />
                </div>
                <TextInput
                  id="name"
                  type="number"
                  placeholder="Enter Answer Point"
                  {...register("answer_point")}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenUpdateAnsModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Update Answer
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default UpdateAnswerModal;
