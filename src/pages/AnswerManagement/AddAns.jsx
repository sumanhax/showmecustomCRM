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
import { addAnswer, getAnswer } from "../../Reducer/AnswerSlice";

const AddAns = ({ openAddAnsModal, setOpenAddAnsModal }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log("cate_Data: ", data);

    dispatch(addAnswer(data)).then((res) => {
      if (res?.payload?.status_code === 201) {
        dispatch(getAnswer());
        setOpenAddAnsModal(false);
        toast.success(res?.payload?.message);
      }
    });
  };
  return (
    <>
      <Modal show={openAddAnsModal} onClose={() => setOpenAddAnsModal(false)}>
        <Modal.Header>Add Answer</Modal.Header>
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
              onClick={() => setOpenAddAnsModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Answer
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddAns;
