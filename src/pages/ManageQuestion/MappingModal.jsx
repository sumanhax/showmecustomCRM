import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { questionAnswerMap } from "../../Reducer/AnswerSlice";
import { data } from "autoprefixer";
import { toast } from "react-toastify";

const MappingModal = ({
  openMappingModal,
  setOpenMappingModal,
  questionId,
  answerList,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(questionAnswerMap({ ...data, question_id: questionId })).then(
      (res) => {
        console.log("res", res);

        if (res?.payload?.status_code === 201) {
          setOpenMappingModal(false);
        } else if (res?.payload?.response?.data?.status_code === 422) {
          toast.error(res?.payload?.response?.data?.message);
        }
      }
    );
  };
  return (
    <>
      <Modal show={openMappingModal} onClose={() => setOpenMappingModal(false)}>
        <Modal.Header>Mapped Answer</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Answer" />
                </div>
                <Select {...register("answer_id")}>
                  <option>Select Answer</option>
                  {answerList?.data?.map((ans) => {
                    return (
                      <>
                        <option value={ans?.id}>{ans?.answer}</option>
                      </>
                    );
                  })}
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenMappingModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Mapped
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default MappingModal;
