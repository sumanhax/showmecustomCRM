import { Button, Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { deleteCategory, getCateGory } from "../../Reducer/CategorySlice";

const CategoryDeleteModal = ({
  openCateDeleteModal,
  setOpenCateDeleteModal,
  cateGoryId,
}) => {
  const dispatch = useDispatch();
  const handleYesCate = () => {
    dispatch(deleteCategory({ category_id: cateGoryId })).then((res) => {
      if (res?.payload?.status_code === 200) {
        setOpenCateDeleteModal(false);
        dispatch(getCateGory());
      }
    });
  };
  return (
    <>
      <Modal
        show={openCateDeleteModal}
        onClose={() => setOpenCateDeleteModal(false)}
      >
        <Modal.Header>Are You Want to delete this Category?</Modal.Header>

        <Modal.Body>
          <div className="flex gap-3">
            <div>
              <Button
                className="cnl_btn"
                onClick={() => setOpenCateDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button onClick={handleYesCate} color="success" type="button">
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
export default CategoryDeleteModal;
