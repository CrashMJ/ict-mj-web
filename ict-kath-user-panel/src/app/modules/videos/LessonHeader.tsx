import React, { useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { useLocation } from 'react-router'
import { GCP_STORAGE_BASE_URL, LESSON_DRIVER_URL } from '../../../config'
import { createBuyLessonViewData } from './users-list/core/_requests'
import VideoPlayerBunny from '../../../_metronic/partials/content/video-player/VideoPlayerBunny'
import { VideoPlayerGDrive } from '../../../_metronic/partials/content/video-player/VideoPlayerGdrive'

type Props = {
  videoInfo?: any,
  buyInfo?: any,
  phone?: any
}

const LessonHeader: React.FC<Props> = ({ videoInfo, buyInfo, phone }) => {
  const [currentVideo, setCurrentVideo] = useState<string | null>('');
  const [currentVideoName, setCurrentVideoName] = useState<string | null>(null);
  const [stateSuccess, setStateSuccess] = useState<string | null>(null);
  const [stateErr, setStateErr] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<string | 0>(0);
  const [viewedId, setViewedId] = useState<string | number>(0);
  const [isBunnyPlayer, setIsBunnyPlayer] = useState<boolean>(false);

  // let actualViewCount = []
  // if(buyInfo){
  //  actualViewCount = buyInfo.viewCount && buyInfo.viewCount.counts ? JSON.parse(buyInfo.viewCount.counts) : [];
  // }else{
  //   actualViewCount = [];
  // }
    const handleStartClick = async (videoUrl: string, name: string, videoId: number) => {
    if (!buyInfo || buyInfo.status !== 'active' || buyInfo.payment_status !== 'approved') return;
      setIsBunnyPlayer(false);
    try {
      let videoNormalizedId;

      if(videoUrl.endsWith('_b')){
        videoNormalizedId = videoUrl.slice(0, -2);
        setIsBunnyPlayer(true);
      }else{
        videoNormalizedId = videoUrl;
      }
  //     const viewCountData = {
  //             "main_id": videoInfo.id,
  //             "lesson_type": videoInfo.type,
  //             "video_id": videoId
  //         }
  
  //     const res = await createBuyLessonViewData(viewCountData);
  // console.log('RESSSS',res)
  //     const data = res.data;
        setViewedId(videoId);
        setCurrentVideo(videoNormalizedId);
        setCurrentVideoName(name);
      // if (data.allowed) {
      //   setStateErr(null);
      //   setViewCount(data.count);
      //   setViewedId(videoId);
      //   setStateSuccess(`⚠️ You have ${2 - data.count} views remaining for this video.`)
      //   setCurrentVideo(videoUrl);
      //   setCurrentVideoName(name);
      // } else {
      //   setStateErr('🚫 You have already watched this video 2 times. Please contact support.');
      //   setViewCount(data.count);
      //   setViewedId(videoId);
      //   setCurrentVideo(null);
      //   setCurrentVideoName(null);
      // }
    } catch (error) {
      console.error('Error starting video:', error);
      setStateErr('⚠️ Something went wrong. Please try again later.');
    }
  };

  const handleDownloadPdf = (fileId: string) => {
  
      if (fileId) {
        const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId.trim()}`;
  
        const link = document.createElement('a');
        link.href = directDownloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = 'lesson.pdf'; // Change as needed
  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Invalid Google Drive URL.");
      }
  };
  
  
  const renderChapters = (chapters: any) => {
    return chapters.map((chapter: any) => (
      <div key={chapter.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
        <div>
          <strong>{chapter.id}.</strong> {chapter.name} <span>({chapter.duration})</span>
        </div>
        <button className={`btn ${chapter.buttonLabel === 'PREVIEW' ? 'btn-info' : 'btn-primary'}`} >
          {chapter.buttonLabel}
        </button>
      </div>
    ));
  };

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className="row py-5">
          <div className="col-12 text-center mb-4">
            {videoInfo.icon && (
              <img 
                src={`${GCP_STORAGE_BASE_URL}${videoInfo.icon}`} 
                alt='ICT Kathurusingha' 
                className="w-50 h-100 rounded"
              />
            )}
          </div>
        </div>
        <div className="row py-3">
          <div className="col-12 text-center">
            <h3 className="mt-3">{videoInfo.name}</h3>
          </div>
        </div>
        <div className="row justify-content-center text-center gap-5">
          <div className="col-12 col-md-10">
            <p>{videoInfo.description}</p>
          </div>
        </div>
        <div className="row justify-content-center py-5">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border rounded bg-light gap-3">
            <div>
              <i className="bi bi-tag me-2 text-primary"></i>
              <span>Price: <strong>Rs.{videoInfo.price}</strong></span>
            </div>
            <div>
              <i className="bi bi-play-circle me-2 text-primary"></i>
              <span>Videos: <strong>1</strong></span>
            </div>
            {videoInfo.duration !== 0 && (
              <div>
                <i className="bi bi-clock me-2 text-primary"></i>
                <span>Length: <strong>{videoInfo.duration}</strong></span>
              </div>
            )}
          </div>
        </div>
    
        {/* Trailer Section */}
        {videoInfo.trailer && (
          <div className="row justify-content-center my-4 py-5">
            <div className="col-md-8 col-sm-12">
              <div className="ratio ratio-16x9">
                <iframe
                  src={videoInfo.trailer}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
            </div>
          </div>
        )}
    
        {/* Lessons Section */}
        <div className="row text-center py-5">
          <h4>Watch Chapter Now</h4>
          {buyInfo && buyInfo.payment_status === 'approved' && buyInfo.status === 'active' ? (
            <></>
          ) : (
            <p>පහත chapter දැකීමට ඔබට ලියාපදිංචි විය යුතුය</p>
          )}
        </div>
        <div className="row justify-content-center py-5">
          <div className="col-12 col-md-10 text-center">
            <h5>What will you learn from this course</h5>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div className="p-3 order-1 order-md-1">
                <strong>1.</strong> {videoInfo.name} <span>{videoInfo.duration ? `(${videoInfo.duration})` : ""}</span>
              </div>
              
              {buyInfo && buyInfo.payment_status === 'approved' && buyInfo.status === 'active' ? (
                <>
                <div className="p-3 order-3 order-md-2">
                  {videoInfo.tute_url && 
                    videoInfo.tute_url.split(',').map((url: any, index: any) => (
                      <button
                        key={index} 
                        className='btn btn-sm btn-warning mx-1'
                        onClick={() => handleDownloadPdf(url)}
                      >
                        Tute {index + 1} <i className="bi bi-download"></i>
                      </button>
                    ))
                  }
                </div>
                <div className="p-3 order-2 order-md-3 d-flex align-items-center">
                  {/* <p className='text-warning'>
                    {viewCount !== 0 && viewedId == videoInfo.id
                      ?  viewCount
                      : actualViewCount.length > 0 && actualViewCount.find((item: any) => item.videoId === videoInfo.id)?.viewCount || 0
                    } / 2
                  </p> */}
                  <button 
                      className='btn btn-sm btn-success mx-2'
                      onClick={() => handleStartClick(videoInfo.url, videoInfo.name, videoInfo.id)}
                    >
                      START
                  </button>
                </div>
                </>
              ) : (
                <>
                <div className="p-3 order-3 order-md-2">
                  {videoInfo.tute_url &&
                    videoInfo.tute_url.split(',').map((url: any, index: any) => (
                      <button key={index} className='btn btn-sm btn-secondary m-1' disabled>Tute {index + 1} <i className="bi bi-download"></i></button>
                    ))
                  }
                </div>
                <div className="p-3 order-2 order-md-3">
                  <button className='btn btn-sm btn-secondary mx-2' disabled>START</button>
                </div>

                </>
              )}
            </div>

            {stateErr ? (
              <div className='alert alert-danger'>
                <div className='alert-text font-weight-bold'>{stateErr}</div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Video Player Section Inside Card */}
        {currentVideo && (
          <div className="row d-flex flex-column align-items-center text-center my-5 py-5 mx-5" style={{ width: "100%" }}>
            <div className="col-md-8 col-sm-12" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h4 className="pb-5 fw-bold">{currentVideoName}</h4>
                                {stateSuccess ? (
                      <div className='alert alert-success'>
                        <div className='alert-text font-weight-bold'>{stateSuccess}</div>
                      </div>
                    ) : (
                      <></>
                    )}
              <div style={{
                position: "relative",
                width: "100%",
                maxWidth: "100%", // Limit maximum width
                paddingTop: "56.25%", // Maintain 16:9 aspect ratio
                margin: "0 auto", // Center horizontally
                borderRadius: "10px", // Optional: Add rounded corners to match card style
                overflow: "hidden" // Optional: Prevent overflow
              }}>
                <div className='mx-auto'
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "70%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  {isBunnyPlayer? <VideoPlayerBunny videoId={currentVideo} phone={phone} /> : <VideoPlayerGDrive videoId={currentVideo} phone={phone} />}

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { LessonHeader }
