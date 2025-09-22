import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  addCateGory,
  addCategoryDes,
  getCateGory,
} from "../../Reducer/CategorySlice";
import { toast } from "react-toastify";

const AddDes = ({ openAddDesModal, setOpenAddDesModal }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log("cate_Data: ", data);
    const formData = new FormData();
    formData.append("category_name", data?.category_name);
    formData.append("category_file", data?.category_file?.[0]);
    dispatch(addCateGory(formData)).then((res) => {
      if (res?.payload?.status_code === 201) {
        dispatch(getCateGory());
        setOpenAddDesModal(false);

        toast.success(res?.payload?.message);
      }
    });
  };
  return (
    <>
      <Modal show={openAddDesModal} onClose={() => setOpenAddDesModal(false)}>
        <Modal.Header>Add Funda-Mentals</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Funda-Mentals" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Funda-Mentals"
                  {...register("category_name")}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Funda-Mentals Image" />
                </div>
                <FileInput id="file-upload" {...register("category_file")} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenAddDesModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Funda-Mentals
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddDes;
