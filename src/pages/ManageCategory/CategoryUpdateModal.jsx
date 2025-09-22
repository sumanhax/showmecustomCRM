import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  getCateGory,
  getSingleCateGory,
  updateCateGory,
  uploadAvatar,
} from "../../Reducer/CategorySlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";

const CategoryUpdateModal = ({
  openCategoryModal,
  setOpenCategoryModal,
  cateGoryId,
}) => {
  const dispatch = useDispatch();
  const { singleCate } = useSelector((state) => state?.cate);
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useState(() => {
    dispatch(getSingleCateGory({ category_id: cateGoryId }));
  }, [cateGoryId]);

  useEffect(() => {
    setValue("category_name", singleCate?.res?.[0]?.category_name);
    // setValue("category_avatar", singleCate?.res?.[0]?.category_avatar);
  }, [singleCate, setValue]);
  const onSubmit = (data) => {
    dispatch(updateCateGory({ ...data, category_id: cateGoryId })).then(
      (res) => {
        console.log("res", res);

        if (res?.payload?.status_code === 200) {
          setOpenCategoryModal(false);
          dispatch(getCateGory());
        }
      }
    );
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("category_file", file);
      formData.append("category_id", cateGoryId);
      dispatch(uploadAvatar(formData)).then((res) => {
        console.log("Res: ", res);
        if (res?.payload?.status_code === 200) {
          //  dispatch(getCateGory({ category_id: cateGoryId }));
          setOpenCategoryModal(false);
          dispatch(getCateGory());
        }
      });
    }
  };
  return (
    <>
      <Modal
        show={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
      >
        <Modal.Header>Update Funda-Mentals</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Funda-Mentals Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Funda-Mentals"
                  {...register("category_name")}
                />
              </div>
              <div className="account_user_section w-8/12 lg:w-4/12 mb-2 lg:mb-0">
                {singleCate?.res?.[0]?.category_avatar !== null ? (
                  <img
                    src={singleCate?.res?.[0]?.category_avatar}
                    alt="Profile Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <img
                    //src={photorealisticImage}
                    alt="Profile Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                )}
                <div className="absolute right-1 top-1">
                  <button
                    type="button"
                    className="bg-white p-2 rounded-full shadow-md text-[#757575] hover:bg-[#ff1a03] hover:text-white"
                  >
                    <FileInput
                      className="absolute opacity-0 h-3 w-5 border border-black"
                      id="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <MdEdit className="text-xl" />
                  </button>
                </div>
                &nbsp;
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="cnl_btn"
              onClick={() => setOpenCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button color="success" type="submit">
              Update Funda-Mentals
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default CategoryUpdateModal;
