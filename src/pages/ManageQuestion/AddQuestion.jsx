import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  addCateGory,
  addCategoryDes,
  getCateGory,
} from "../../Reducer/CategorySlice";
import { toast } from "react-toastify";
import { addQuestions, getQuestion } from "../../Reducer/QuestionSlice";

const AddQuestion = ({ openAddQueModal, setOpenAddQueModal }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log("cate_Data: ", data);

    dispatch(addQuestions(data)).then((res) => {
      if (res?.payload?.status_code === 201) {
        dispatch(getQuestion());
        setOpenAddQueModal(false);

        toast.success(res?.payload?.message);
      }
    });
  };
  return (
    <>
      <Modal show={openAddQueModal} onClose={() => setOpenAddQueModal(false)}>
        <Modal.Header>Add Questions</Modal.Header>
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
              onClick={() => setOpenAddQueModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Question
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddQuestion;
