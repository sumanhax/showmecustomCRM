import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addZone, getZoneList } from "../../Reducer/ZoneSlice";

const AddZoneModal = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(addZone(data)).then((res) => {
      console.log("Res", res);
      if (res?.payload?.status_code === 201) {
        setOpenModal(false);
        dispatch(getZoneList());
      }
    });
  };

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add New Zone</Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Zone Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter Zone name"
                  {...register("zone_name")}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cnl_btn" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button color="success" type="submit">
              Add Zone
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
export default AddZoneModal;
