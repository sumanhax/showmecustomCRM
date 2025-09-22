import { Pagination } from "flowbite-react";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { lisingOfAudio, lisingOfVideo } from "../../Reducer/WalletSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import VideoModal from "./VideoModal";
import AudioModal from "./AudioModal";

const VideoAudioPage = () => {
  const { listOfVideo, listOfAudio } = useSelector(
    (state) => state?.transactions
  );
  const baseUrl = listOfVideo?.baseUrl;
  const [videoModal, setVideoModal] = useState(false);
  const [audioModal, setAudioModal] = useState(false);
  const [audioPath, setAudioPath] = useState();
  const [videoPath, setVideoPath] = useState("");
  const id = useParams();
  const dispatch = useDispatch();
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPage1, setTotalPage1] = useState(1);
  const [limit1, setLimit1] = useState(8);
  const [currentPage1, setCurrentPage1] = useState(1);
  useEffect(() => {
    dispatch(
      lisingOfVideo({
        entity: "video_image",
        limit: 8,
        page: currentPage1,
        user_id: id?.id,
      })
    ).then((res) => {
      // console.log("Res", res);
      const total = res?.payload?.total_page;
      setTotalPage1(Number.isInteger(total) && total > 0 ? total : 1);
    });
  }, [currentPage1, limit1]);
  const onPageChange1 = (page1) => {
    setCurrentPage1(page1);
  };
  useEffect(() => {
    dispatch(
      lisingOfAudio({
        entity: "audio_image",
        limit: 8,
        page: currentPage,
        user_id: id?.id,
      })
    ).then((res) => {
      // console.log("res", res);
      const total = res?.payload?.total_page;
      setTotalPage(Number.isInteger(total) && total > 0 ? total : 1);
    });
  }, [currentPage, limit]);
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleVideoModal = (videoData) => {
    setVideoModal(true);
    setVideoPath(videoData);
  };
  const handleAudioModal = (audioData) => {
    setAudioModal(true);
    setAudioPath(audioData);
  };

  return (
    <>
      <div className="mt-6 lg:mt-12">
        <div className="tab_section_home">
          <Tabs>
            <div className="mb-2 lg:mb-6">
              <div>
                <TabList>
                  <Tab>My Audio</Tab>
                  <Tab>My Video</Tab>
                </TabList>
              </div>
            </div>
            <TabPanel>
              <div className="audio_list">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {listOfAudio?.data?.length > 0 ? (
                    listOfAudio?.data?.map((items) => {
                      return (
                        <>
                          <div className="mb-4">
                            <button
                              type="button"
                              onClick={() => {
                                handleAudioModal(items?.video);
                              }}
                            >
                              <div className="h-full bg-[#FFFFFF] p-2 rounded-2xl overflow-hidden flex justify-center items-center mb-4">
                                <img
                                  src={items?.thumbnail}
                                  alt="projects03"
                                  className="rounded-2xl overflow-hidden"
                                />
                              </div>
                            </button>
                            <div>
                              <p className="text-[#303030] text-base font-medium pb-2">
                                Night we got Stuck Story video
                              </p>
                              <p className="text-[#808080] text-sm font-medium">
                                AI Video Storybook
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <p>No Audio Avilable</p>
                    </>
                  )}
                </div>
                {listOfAudio?.total_page > 1 && (
                  <div className="flex justify-center items-center mt-4 pagination_sec">
                    <Pagination
                      layout="pagination"
                      currentPage={currentPage}
                      totalPages={totalPage}
                      onPageChange={onPageChange}
                      previousLabel=""
                      nextLabel=""
                      showIcons
                    />
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="video_list">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {listOfVideo?.data?.length > 0 ? (
                    listOfVideo?.data?.map((vItems) => {
                      return (
                        <>
                          <div className="mb-4">
                            <button
                              type="button"
                              onClick={() => {
                                handleVideoModal(vItems?.video);
                              }}
                            >
                              <div className="h-full bg-[#FFFFFF] p-2 rounded-2xl overflow-hidden flex justify-center items-center mb-4">
                                <img
                                  src={vItems?.thumbnail}
                                  alt="projects02"
                                  className="rounded-2xl overflow-hidden"
                                />
                              </div>
                            </button>
                            <div>
                              <p className="text-[#303030] text-base font-medium pb-2">
                                Night we got Stuck Story video
                              </p>
                              <p className="text-[#808080] text-sm font-medium">
                                AI Video Storybook
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <p>Video Not Found</p>
                    </>
                  )}
                </div>
                {listOfVideo?.total_page > 1 && (
                  <div className="flex justify-center items-center mt-4 pagination_sec">
                    <Pagination
                      layout="pagination"
                      currentPage={currentPage1}
                      totalPages={totalPage1}
                      onPageChange={onPageChange1}
                      previousLabel=""
                      nextLabel=""
                      showIcons
                    />
                  </div>
                )}
              </div>
            </TabPanel>
          </Tabs>
        </div>
        {audioModal && (
          <AudioModal
            audioModal={audioModal}
            setAudioModal={setAudioModal}
            baseUrl={baseUrl}
            audioPath={audioPath}
          />
        )}
        {videoModal && (
          <VideoModal
            videoModal={videoModal}
            setVideoModal={setVideoModal}
            baseUrl={baseUrl}
            videoPath={videoPath}
          />
        )}
      </div>
    </>
  );
};
export default VideoAudioPage;
