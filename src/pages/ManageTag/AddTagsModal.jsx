import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addTags, getTags } from "../../Reducer/TagSlice";
import { toast } from "react-toastify";

const AddTagsModal = ({ openAddTagModal, setOpenTagModal }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(addTags(data)).then((res) => {
      console.log("res", res);

      if (res?.payload?.status_code === 201) {
        setOpenTagModal(false);
        dispatch(getTags());
      } else if (res?.payload?.response?.data?.status_code) {
        toast.error(res?.payload?.response?.data?.message);
      }
    });
  };
  return (
    <>
      <Modal show={openAddTagModal} onClose={() => setOpenTagModal(false)}>
        <Modal.Header>Add New Tags</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Tag" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Tag"
                  {...register("tag")}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cnl_btn" onClick={() => setOpenTagModal(false)}>
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Tags
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddTagsModal;
