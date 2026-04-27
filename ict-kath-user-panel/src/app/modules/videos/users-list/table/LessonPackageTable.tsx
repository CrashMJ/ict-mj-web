import { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns } from './columns/_columns'
import { User } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { UsersListPagination } from '../components/pagination/UsersListPagination'
import { KTCardBody } from '../../../../../_metronic/helpers'
import { Card3 } from '../../../../../_metronic/partials/content/cards/Card3'
import { getVideos } from '../core/_requests'
import { GCP_STORAGE_BASE_URL } from '../../../../../config'
import { Card6 } from '../../../../../_metronic/partials/content/cards/Card6'
import { useSearchParams } from 'react-router-dom'



const LessonPackageTable = () => {
  console.log('Enter')
  const isLoading = useQueryResponseLoading()
  const [videoPackages, setVideoPackages] = useState<any>([])
  const [grade, setGrade] = useState<any>('')
  const [classType, setClassType] = useState<any>('')
  const [searchParams] = useSearchParams();
  
    useEffect(() => {
      const selectedGrade = searchParams.get('selectedGrade');
      const selectedClassType = searchParams.get('selectedClassType');
      console.log('Selected Grade:', selectedGrade);
      console.log('Selected Class:', selectedClassType);

      setGrade(selectedGrade === 'Sonic Team Speed Revision' ? 'sonic' : selectedGrade)
      setClassType(selectedClassType ? selectedClassType : '')
    }, [searchParams]);

  useEffect(() => {
    if (!grade) return;
    
    async function fetchVideos() {
      const videosList = await getVideos({
        "keyword": "",
        "type": "package",
        "grade": grade,
        "grade_type": classType,
        "status": "active",
        "limit": 100,
        "skip": 0,
        "sort": "DESC",
      });
      console.log('videosList',videosList)
      setVideoPackages(videosList.results ? videosList.results : []);
    }
    fetchVideos();
  }, [grade, classType])


  return (
    <KTCardBody className='py-4'>
      {/* <div className='table-responsive'> */}

      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='f w-bolder my-2'>
          Lessons Packages
        </h3>

        <div className='d-flex my-2'>
        </div>
      </div>

      {!isLoading && videoPackages.length === 0 && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <h5 className="text-muted">No Lessons found</h5>
        </div>
      )}

    {!isLoading && videoPackages.length > 0 && (
      <div className='row g-6 g-xl-9 mb-6'>
        {videoPackages && videoPackages.map((videoItem: any) => (
          <div key={videoItem.id} className='col-md-4 col-xxl-4'>
            <Card6
              key={videoItem.id}
              videoId={videoItem.id}
              avatar={`${GCP_STORAGE_BASE_URL}${videoItem.icon}`}
              name={videoItem.name}
              days={videoItem.days}
              job={videoItem.description}
              discountedPrice={`Rs. ${videoItem.discounted_price}`}
              price={`Rs. ${videoItem.price}`}
              link={`lesson/${videoItem.id}?lessonid=${videoItem.id}`}
              buttonText={"Pay Now"}
              type={"package"}
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

export { LessonPackageTable }
