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



const TutesTable = () => {
  const isLoading = useQueryResponseLoading()
  const [tutes, setTutes] = useState<any>([])
  const [grade, setGrade] = useState<any>('')
  const [classType, setClassType] = useState<any>('')
  const [searchParams] = useSearchParams();
  
    useEffect(() => {
      const selectedGrade = searchParams.get('selectedGrade');
      const selectedClassType = searchParams.get('selectedClassType');
      console.log('Selected Grade:', selectedGrade);
      console.log('Selected Class:', selectedClassType);

      setGrade(selectedGrade)
      setClassType(selectedClassType ? selectedClassType : '')
    }, [searchParams]);

  useEffect(() => {
    async function fetchTutes() {
      const tutesList = await getVideos({
        "keyword": "",
        "type": "tutes",
        "grade": grade,
        "grade_type": classType,
        "status": "active",
        "limit": 100,
        "skip": 0,
        "sort": "DESC",
      });
      console.log('tutesList',tutesList)
      setTutes(tutesList.results ? tutesList.results : []);
    }
    fetchTutes();
  }, [grade, classType])


  return (
    <KTCardBody className='py-4'>
      {/* <div className='table-responsive'> */}

      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='f w-bolder my-2'>
          Tutes
        </h3>

        <div className='d-flex my-2'>
        </div>
      </div>

      {!isLoading && tutes.length === 0 && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <h5 className="text-muted">No Tutes found</h5>
        </div>
      )}

    {!isLoading && tutes.length > 0 && (
      <div className='row g-6 g-xl-9 mb-6'>
        {tutes && tutes.map((tuteItem: any) => (
          <div className='col-md-6 col-xxl-4'>
            <Card6
              key={tuteItem.id}
              videoId={tuteItem.id}
              avatar={`${GCP_STORAGE_BASE_URL}${tuteItem.icon}`}
              name={tuteItem.name}
              days={0}
              job={tuteItem.description}
              discountedPrice={`Rs. ${tuteItem.discounted_price}`}
              price={`Rs. ${tuteItem.price}`}
              link={`lesson/${tuteItem.id}?lessonid=${tuteItem.id}`}
              buttonText={"Pay Now"}
              type={"tutes"}
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

export { TutesTable }
