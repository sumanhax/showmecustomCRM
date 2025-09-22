import { Modal } from "flowbite-react";
import ReactPlayer from "react-player";

const AudioModal = ({ audioModal, setAudioModal, baseUrl, audioPath }) => {
  return (
    <>
      <Modal show={audioModal} onClose={() => setAudioModal(false)}>
        <Modal.Header className="border-0 absolute right-1 top-[-0.75rem]"></Modal.Header>

        <Modal.Body>
          <div className="rounded-xl">
            {/* <img src={videoFrameNew} alt="videoFrameNew" /> */}
            <ReactPlayer
              className="w-full h-[260px] lg:h-[500px]"
              url={baseUrl + "/" + audioPath}
              width="100%"
              controls={true} // Show player controls
              playing={true}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AudioModal;
