import { useEffect, useState } from 'react'
import { useQueryResponseLoading } from '../core/QueryResponseProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { KTCardBody } from '../../../../../_metronic/helpers'
import { getVideos } from '../core/_requests'
import { GCP_STORAGE_BASE_URL } from '../../../../../config'
import { Card6 } from '../../../../../_metronic/partials/content/cards/Card6'
import { useSearchParams } from 'react-router-dom'

const IndividualLessonTable = () => {
  const isLoading = useQueryResponseLoading()
  const [videos, setVideos] = useState<any>([])
  const [grade, setGrade] = useState<any>('')
  const [classType, setClassType] = useState<any>('')
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const selectedGrade = searchParams.get('selectedGrade');
    const selectedClassType = searchParams.get('selectedClassType');
    console.log('Selected Grade:', selectedGrade);
    console.log('Selected Class:', selectedClassType);
    if(selectedGrade === 'Sonic Team Speed Revision'){
      setGrade('sonic')
    }else{
      setGrade(selectedGrade)
    }
    setClassType(selectedClassType ? selectedClassType : '')
  }, [searchParams]);

  useEffect(() => {
    async function fetchVideos() {
      if(!grade) return;
      const videosList = await getVideos({
        "keyword": "",
        "type": "individual",
        "grade": grade,
        "grade_type": classType,
        "status": "active",
        "limit": 100,
        "skip": 0,
        "sort": "DESC",
      });
      console.log('videosList',videosList)
      setVideos(videosList.results ? videosList.results : []);
    }
    fetchVideos();
  }, [grade, classType])


  return (
    <KTCardBody className='py-4'>
      {/* <div className='table-responsive'> */}

      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='f w-bolder my-2'>
          Individual Lessons
        </h3>

        <div className='d-flex my-2'>
        </div>
      </div>

      {!isLoading && videos.length === 0 && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <h5 className="text-muted">No Lessons found</h5>
        </div>
      )}

      {!isLoading && videos.length > 0 && (
        <div className='row g-6 g-xl-9 mb-6'>
          {videos && videos.map((videoItem: any, index: number) => (
            <div className='col-md-4 col-xxl-4' key={index}>
              <Card6
                videoId={videoItem.id}
                avatar={`${GCP_STORAGE_BASE_URL}${videoItem?.icon}`}
                name={videoItem.name}
                days={videoItem.days}
                job={videoItem.description}
                discountedPrice={`Rs. ${videoItem.discounted_price}`}
                price={`Rs. ${videoItem.price}`}
                link={`lesson/${videoItem.id}?lessonid=${videoItem.id}`}
                buttonText={"Pay Now"}
                type={"individual"}
              />
            </div>
          ))}
        </div>
      )}
      {/* </div> */}
      {isLoading && <UsersListLoading />}
    </KTCardBody>
  )
}

export { IndividualLessonTable }
