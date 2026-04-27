// import { QueryRequestProvider } from './core/QueryRequestProvider'
import { useEffect, useState } from 'react';
import { KTCard, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getSiteContents } from '../classes/users-list/core/_requests';
import YouTube from 'react-youtube';
import { UsersTable } from './table/UsersTable';

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
        const finds = ['MAIN_PAGE_SUB_AL_VIDEO_1', 'MAIN_PAGE_SUB_AL_VIDEO_2', 'MAIN_PAGE_SUB_AL_VIDEO_3', 'MAIN_PAGE_SUB_AL_VIDEO_4'];
        const finds2 = ['MAIN_PAGE_SUB_OL_VIDEO_1', 'MAIN_PAGE_SUB_OL_VIDEO_2', 'MAIN_PAGE_SUB_OL_VIDEO_3', 'MAIN_PAGE_SUB_OL_VIDEO_4'];
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
        <UsersTable />

      </KTCard>
    </>
  )
}

const PapersPage = () => (
  <Information />
)

export { PapersPage }
