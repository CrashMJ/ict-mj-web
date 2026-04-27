/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useLocation } from 'react-router'
import { API_BASE_URL, GCP_STORAGE_BASE_URL, LESSON_DRIVER_URL } from '../../../config'
import { createBuyLessonViewData } from './users-list/core/_requests'
import { VideoPlayerGDrive } from '../../../_metronic/partials/content/video-player/VideoPlayerGdrive'
import VideoPlayerBunny from '../../../_metronic/partials/content/video-player/VideoPlayerBunny'

type Props = {
  videoInfo?: any,
  buyInfo?: any,
  phone?: any
}

const LessonsHeader: React.FC<Props> = ({ videoInfo, buyInfo, phone }) => {
  console.log('videoInfo, buyInfo, phone',videoInfo, buyInfo, phone)
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);
    const [currentVideoName, setCurrentVideoName] = useState<string | null>(null);
    const [stateSuccess, setStateSuccess] = useState<string | null>(null);
    const [stateErr, setStateErr] = useState<string | null>(null);
    const [viewCount, setViewCount] = useState<string | 0>(0);
    const [viewedId, setViewedId] = useState<string | number>(0);
    const [isBunnyPlayer, setIsBunnyPlayer] = useState<boolean>(false);
  
  let freeChapters: any[] = [];
  let paidLessons: any[] = [];
  console.log('actualViewCount',buyInfo)

  // let actualViewCount = []
  // if(buyInfo){
  //  actualViewCount = buyInfo.viewCount && buyInfo.viewCount.counts ? JSON.parse(buyInfo.viewCount.counts) : [];
  // }else{
  //   actualViewCount = [];
  // }

// Properly handle asynchronous logic
for (const item of videoInfo.videoPackages) {
  if (item.paid_type === 'free') {
    const filteredData = {
      id: item.id,
      name: item.video.name,
      url: item.video.url,
      tuteUrl: item.video.tute_url,
      time: item.video.duration,
      vStatus: item.video.status,
      buttonLabel: 'PREVIEW',
    };
    freeChapters.push(filteredData);
  } else if (item.paid_type === 'paid') {
    const filteredData = {
      id: item.id,
      name: item.video.name,
      url: item.video.url,
      tuteUrl: item.video.tute_url,
      time: item.video.duration,
      vStatus: item.video.status,
      buttonLabel: 'START',
    };
    paidLessons.push(filteredData);
  }
}

const allLessons = freeChapters.concat(paidLessons);
//localstorage play count
// const handleStartClick = (videoUrl: string, name: string, videoId: number) => {
//   if (buyInfo && buyInfo.status === 'active' && buyInfo.payment_status === 'approved') {
//     const storageKey = `videoStartCount_${videoId}_${phone}`;
//     const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

//     if (currentCount >= 3) {
//       alert('🚫 You have reached the maximum of 3 allowed views for this video.');
//       return;
//     }

//     // Save updated count and allow video play
//     localStorage.setItem(storageKey, (currentCount + 1).toString());
//     setCurrentVideo(videoUrl);
//     setCurrentVideoName(name);
//   }
// };

const handleStartClick = async (videoUrl: string, name: string, videoId: number, type: any) => {
  if(type == 'paid'){
    if (!buyInfo || buyInfo.status !== 'active' || buyInfo.payment_status !== 'approved') return;
  }
  setIsBunnyPlayer(false);

  try {

      let videoNormalizedId;
      if(videoUrl.endsWith('_b')){
        videoNormalizedId = videoUrl.slice(0, -2);
        setIsBunnyPlayer(true);
      }else{
        videoNormalizedId = videoUrl;
      }

      setViewedId(videoId);
      setCurrentVideo(videoNormalizedId);
      setCurrentVideoName(name);
    // const viewCountData = {
    //         "main_id": videoInfo.id,
    //         "lesson_type": videoInfo.type,
    //         "video_id": videoId
    //     }

    // const res = await createBuyLessonViewData(viewCountData);

    // const data = res.data;

    // if (data.allowed) {
    //   setStateErr(null);
    //   setViewCount(data.count);
    //   setViewedId(videoId);
    //   setStateSuccess(`⚠️ You have ${data.maxCount - data.count} views remaining for this video.`)
    //   setCurrentVideo(videoUrl);
    //   setCurrentVideoName(name);
    // } else {
    //   setStateErr(`🚫 You have already watched this video all the available viewing times. Please contact support.`);
    //   setViewCount(data.count);
    //   setViewedId(videoId);
    //   setCurrentVideo(null);
    //   setCurrentVideoName(null);
    // }
  } catch (error) {
    console.error('Error starting video:', error);
    setStateErr('⚠️ Something went wrong. Please try again later.');
    // setViewCount(0);
    setViewedId(0);
    setCurrentVideo(null);
    setCurrentVideoName(null);
  }
};


const handleDownloadPdf = (fileId: string) => {
  
  if (fileId) {
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

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
    console.log('chapters----',chapters)
    return chapters
    .filter((chapter: any) => chapter.vStatus === 'active') // Only keep active chapters
    .map((chapter: any, index: any) => (
      <div key={chapter.id} className="d-flex flex-column flex-md-row justify-content-between align-items-center py-2 border-bottom">
        <div className="p-3 order-1 order-md-1">
          <strong>{index + 1}.</strong> {chapter.name} <span>{chapter.time ? `(${chapter.time})` : ""}</span>
        </div>
        {chapter.buttonLabel === 'PREVIEW' ? (
          <>  
          <div className="p-3 order-3 order-md-2"></div>

          <div className="p-3 order-2 order-md-3">
            <button 
              className='btn btn-sm mx-5 btn-info'
              onClick={() => handleStartClick(chapter.url, chapter.name, chapter.id, 'free')}
              >
                {chapter.buttonLabel}
            </button>
          </div> 
          </>
        ) : buyInfo ? (
            buyInfo.payment_status === 'approved' && buyInfo.status === 'active' ? ( 
              <>
              <div className="p-3 order-3 order-md-2">
                {chapter.tuteUrl &&
                  chapter.tuteUrl.split(',').map((url: any, index: any) => (
                      <button 
                        key={index}
                        className='btn btn-sm btn-warning m-1'
                        onClick={() => handleDownloadPdf(url)}
                      >
                        Tute {index + 1} <i className="bi bi-download"></i>
                      </button>
                  )) 
                    
                }
                </div>
                <div className="p-3 order-2 order-md-3 d-flex align-items-center ">
                  {/* <p className='text-warning'>
                    {viewCount !== 0 && viewedId == chapter.id
                      ?  viewCount
                      : actualViewCount.length > 0 && actualViewCount.find((item: any) => item.videoId === chapter.id)?.viewCount || 0
                    } / 10
                  </p> */}

                  <button 
                      className='btn btn-sm mx-5 btn-success'
                      onClick={() => handleStartClick(chapter.url, chapter.name, chapter.id, 'paid')}
                    >
                      {chapter.buttonLabel}
                  </button>
                </div>
              </>
            ) : (
              <>
              <div className="p-3 order-3 order-md-2">
                {chapter.tuteUrl && 
                  chapter.tuteUrl.split(',').map((url: any, index: any) => {
                    <button key={index} className='btn btn-sm btn-secondary m-1' disabled>Tute {index + 1} <i className="bi bi-download"></i></button>
                  })
                }
                </div>
                <div className="p-3 order-2 order-md-3">
                  <button className='btn btn-sm mx-5 btn-secondary disabled'>
                    {chapter.buttonLabel}
                  </button>
                </div>
              </>
            )
        ) : (
          <>
            <div className="p-3 order-3 order-md-2">
              {chapter.tuteUrl && 
                chapter.tuteUrl.split(',').map((url: any, index: any) => (
                  <button key={index} className='btn btn-sm btn-secondary m-1' disabled>Tute {index + 1} <i className="bi bi-download"></i></button>
                ))
              }
            </div>
            <div className="p-3 order-2 order-md-3">
              <button className='btn btn-sm mx-5 btn-secondary disabled'>
                {chapter.buttonLabel}
              </button>
            </div>
          </>
            
        )}
        
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
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border rounded bg-light">
            <div>
              <i className="bi bi-tag me-2 text-primary"></i>
              <span>Price: <strong>Rs.{videoInfo.price}</strong></span>
            </div>
            <div>
              <i className="bi bi-play-circle me-2 text-primary"></i>
              <span>Videos: <strong>{videoInfo.videoPackages.length}</strong></span>
            </div>
            {videoInfo.duration != 0 && <div>
              <i className="bi bi-clock me-2 text-primary"></i>
              <span>Length: <strong>{videoInfo.duration}</strong></span>
            </div>}
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
        {freeChapters.length > 0 && (
          <>
            <div className="row text-center py-5">
              <h4>Watch {freeChapters.length} Free Chapters Now</h4>
              <p>පහත Preview ලැබෙන නමුත් අනෙකුත් chapters දැකීමට ඔබට ලියාපදිංචි විය යුතුය</p>
            </div>
            <div className="row justify-content-center py-5">
              <div className="col-12 col-md-10 text-center">
                <h5>Free Chapters</h5>
                <div className="border p-3 mt-5">{renderChapters(freeChapters)}</div>
              </div>
            </div>
          </>
        )}
        <div className="row justify-content-center py-5">
          <div className="col-12 col-md-10 text-center">
            <h5>What will you learn from this course</h5>

            {stateErr ? (
              <div className='alert alert-danger'>
                <div className='alert-text font-weight-bold'>{stateErr}</div>
              </div>
            ) : (
              <></>
            )}
            <div className="border p-3 mt-5">{renderChapters(allLessons)}</div>
          </div>
        </div>
      </div>
      {currentVideo && (
          <div className="row d-flex flex-column align-items-center text-center my-5 py-5 mx-5" style={{ width: "100%" }}>
            <div className="col-md-8 col-sm-12" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h4 className="pb-5 fw-bold">{currentVideoName}</h4>
              {stateSuccess && (
                      <div className='alert alert-success'>
                        <div className='alert-text font-weight-bold'>{stateSuccess}</div>
                      </div>
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
               
                  {isBunnyPlayer ? (
                    <VideoPlayerBunny key={currentVideo} videoId={currentVideo} phone={phone} />
                  ) : (
                    <VideoPlayerGDrive key={currentVideo} videoId={currentVideo} phone={phone} />
                  )}
            </div>
          </div>
          </div>
          </div>
        )}
    </div>
  )
}

export { LessonsHeader }
function async(video: any) {
  throw new Error('Function not implemented.')
}

