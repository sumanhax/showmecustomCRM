import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCateGory } from "../../Reducer/CategorySlice";
import { toast } from "react-toastify";

const AddCategoryModal = ({
  openCateGoryModal,
  setOpenCateGoryModal,
  zoneId,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(addCateGory({ ...data, zone_id: zoneId })).then((res) => {
      if (res?.payload?.status_code === 201) {
        setOpenCateGoryModal(false);
        toast.success(res?.payload?.message);
      }
    });
  };
  return (
    <>
      <Modal
        show={openCateGoryModal}
        onClose={() => setOpenCateGoryModal(false)}
      >
        <Modal.Header>Add New Category</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Category Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Category name"
                  {...register("category_name")}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenCateGoryModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Category
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddCategoryModal;
