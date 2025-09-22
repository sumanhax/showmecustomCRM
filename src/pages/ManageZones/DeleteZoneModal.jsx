import { Button, Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { deleteZone, getZoneList } from "../../Reducer/ZoneSlice";

const DeleteZoneModal = ({ openDeleteModal, setOpenDeleteModal, zoneId }) => {
  const dispatch = useDispatch();
  const handleYes = () => {
    dispatch(deleteZone({ zone_id: zoneId })).then((res) => {
      if (res?.payload?.status_code === 200) {
        setOpenDeleteModal(false);
        dispatch(getZoneList());
      }
    });
  };
  return (
    <>
      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header>Are You Want to delete this Zone?</Modal.Header>

        <Modal.Body>
          <div className="flex gap-3">
            <div>
              <Button
                className="cnl_btn"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button onClick={handleYes} color="success" type="button">
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
export default DeleteZoneModal;
