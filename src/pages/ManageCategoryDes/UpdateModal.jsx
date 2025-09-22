import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getCateGoryDes,
  getSingleCateGory,
  updateCategoryDes,
} from "../../Reducer/CategorySlice";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const UpdateModal = ({ openDesModal, setOpenDesModal, desId, cateId }) => {
  const { allDes } = useSelector((state) => state?.cate);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    dispatch(getCateGoryDes({ category_desc_id: desId }));
  }, [desId]);
  console.log("allDes", allDes);
  useEffect(() => {
    setValue("content_type", allDes?.result?.[0]?.content_type);
    setValue("target_vibes", allDes?.result?.[0]?.target_vibes);
  }, [desId, setValue, allDes]);

  const onSubmit = (data) => {
    dispatch(updateCategoryDes({ ...data, category_desc_id: desId })).then(
      (res) => {
        if (res?.payload?.status_code === 200) {
          setOpenDesModal(false);
          dispatch(getSingleCateGory({ category_id: cateId }));
        }
      }
    );
  };

  return (
    <>
      <Modal show={openDesModal} onClose={() => setOpenDesModal(false)}>
        <Modal.Header>Update Category Description</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Content Type" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Content Type"
                  {...register("content_type")}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Target Vibes" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Target Vibes"
                  {...register("target_vibes")}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cnl_btn" onClick={() => setOpenDesModal(false)}>
              Cancel
            </Button>
            <Button color="success" type="submit">
              Update
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default UpdateModal;
