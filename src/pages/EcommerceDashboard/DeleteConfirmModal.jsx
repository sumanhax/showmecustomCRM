import { Modal } from "flowbite-react";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteConfirmModal = ({ openModal, setOpenModal, onConfirm, supplierName, itemType = "item" }) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
      <Modal.Header>Confirm Delete</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this {itemType}?
            </h3>
            <p className="text-sm text-gray-600">
              This will permanently delete <span className="font-semibold">{supplierName}</span>.
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={() => setOpenModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Delete
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;

