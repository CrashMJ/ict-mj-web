// import { QueryRequestProvider } from './core/QueryRequestProvider'
import { useEffect, useState } from 'react';
import { KTCard, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getSiteContents } from '../classes/users-list/core/_requests';
import YouTube from 'react-youtube';

const _onReady = (event: any) => {
  event.target.pauseVideo();
};

const opts = {
  height: '300',
  width: '100%',
  playerVars: {
    autoplay: 0,
  },
};

const Information = () => {
  const [videoList, setVideos] = useState<any[]>([]);
  const [videoList2, setVideos2] = useState<any[]>([]);

  useEffect(() => {
    async function func() {
      const siteContents = await getSiteContents();
      if (siteContents && siteContents.data) {
        const videos: any[] = [];
        const videos2: any[] = [];
        const finds = ['MAIN_PAGE_SUB_AL_VIDEO_1', 'MAIN_PAGE_SUB_AL_VIDEO_2', 'MAIN_PAGE_SUB_AL_VIDEO_3', 'MAIN_PAGE_SUB_AL_VIDEO_4', 'MAIN_PAGE_SUB_AL_VIDEO_5', 'MAIN_PAGE_SUB_AL_VIDEO_6', 'MAIN_PAGE_SUB_AL_VIDEO_7', 'MAIN_PAGE_SUB_AL_VIDEO_8', 'MAIN_PAGE_SUB_AL_VIDEO_9', 'MAIN_PAGE_SUB_AL_VIDEO_10', 'MAIN_PAGE_SUB_AL_VIDEO_11', 'MAIN_PAGE_SUB_AL_VIDEO_12', 'MAIN_PAGE_SUB_AL_VIDEO_13', 'MAIN_PAGE_SUB_AL_VIDEO_14', 'MAIN_PAGE_SUB_AL_VIDEO_15', 'MAIN_PAGE_SUB_AL_VIDEO_16'];
        const finds2 = ['MAIN_PAGE_SUB_OL_VIDEO_1', 'MAIN_PAGE_SUB_OL_VIDEO_2', 'MAIN_PAGE_SUB_OL_VIDEO_3', 'MAIN_PAGE_SUB_OL_VIDEO_4', 'MAIN_PAGE_SUB_OL_VIDEO_5', 'MAIN_PAGE_SUB_OL_VIDEO_6', 'MAIN_PAGE_SUB_OL_VIDEO_7', 'MAIN_PAGE_SUB_OL_VIDEO_8', 'MAIN_PAGE_SUB_OL_VIDEO_9', 'MAIN_PAGE_SUB_OL_VIDEO_10', 'MAIN_PAGE_SUB_OL_VIDEO_11', 'MAIN_PAGE_SUB_OL_VIDEO_12', 'MAIN_PAGE_SUB_OL_VIDEO_13', 'MAIN_PAGE_SUB_OL_VIDEO_14', 'MAIN_PAGE_SUB_OL_VIDEO_15', 'MAIN_PAGE_SUB_OL_VIDEO_16'];
        siteContents.data.forEach((element: any) => {
          if (finds.includes(element.slug)) {
            videos.push(element);
          }
        });
        siteContents.data.forEach((element: any) => {
          if (finds2.includes(element.slug)) {
            videos2.push(element);
          }
        });
        setVideos(videos);
        setVideos2(videos2);
      }
    }
    func();
  }, [])

  // const { itemIdForUpdate } = useListView()
  return (
    <>
      <KTCard>
        <div className='row p-5'>
          <div className='col-lg-6 mt-4 mb-4'>
            <h3 className='mt-4 mb-4'>A/L Videos</h3>
            {videoList.map((value) => (
              <div key={value.slug} className='mb-4'>
                <YouTube videoId={value.url} opts={opts} onReady={_onReady} />
              </div>
            ))}
          </div>
          <div className='col-lg-6 mt-4 mb-4'>
            <h3 className='mt-4 mb-4'>O/L Videos</h3>
            {videoList2.map((value) => (
              <div key={value.slug} className='mb-4'>
                <YouTube videoId={value.url} opts={opts} onReady={_onReady} />
              </div>
            ))}
          </div>
        </div>

      </KTCard>
    </>
  )
}

const VideoPage = () => (
  <Information />
)

export { VideoPage }
