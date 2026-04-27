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
import { getClasses } from '../core/_requests'
import { GCP_STORAGE_BASE_URL } from '../../../../../config'



const ClassTable = () => {
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => users, [users])
  const columns = useMemo(() => usersColumns, [])
  const [classesOl, setClassesOl] = useState<any>([])
  const [classesAl, setClassesAl] = useState<any>([])

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  })

  useEffect(() => {
    async function func() {
      const classList = await getClasses({
        "class_grade": "",
        "class_delivery_type": "online",
        "keyword": "",
        "status": "active",
        "sort_field": "id",
        "sort": "DESC",
        "limit": 100,
        "skip": 0
      });

      const olClassList: any[] = [];
      const alClassList: any[] = [];
      if (classList.results) {
        classList.results.forEach((result: any) => {
          if (result.class_grade === 'al')
            alClassList.push(result);
          else if (result.class_grade === 'ol')
            olClassList.push(result);
        });
        setClassesAl(alClassList);
        setClassesOl(olClassList);
      }
    }
    func();
  }, [JSON.stringify(classesOl)])


  return (
    <KTCardBody className='py-4'>
      {/* <div className='table-responsive'> */}

      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='f w-bolder my-2'>
          A/L Classes
        </h3>

        <div className='d-flex my-2'>
        </div>
      </div>

      <div className='row g-6 g-xl-9 mb-6'>

        {classesAl.map((classItem: any) => (
          <div className='col-md-6 col-xxl-4'>
            <Card3
              key={classItem.name_en}
              avatar={`${GCP_STORAGE_BASE_URL}${classItem.icon}`}
              name={classItem.name_en}
              job={classItem.description_1_en}
              avgEarnings={classItem.class_time}
              totalEarnings={`Rs. ${classItem.course_fee}`}
              class_date={classItem.class_date_en}
              language={classItem.language}
              link={`class/${classItem.id}?classid=${classItem.id}`}
              buttonText={"Pay and Join"}
            />
          </div>
        ))}
      </div>

      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='f w-bolder my-2'>
          O/L Classes
        </h3>

        <div className='d-flex my-2'>
        </div>
      </div>

      <div className='row g-6 g-xl-9 mb-6'>

        {classesOl.map((classItem: any) => (
          <div className='col-md-6 col-xxl-4'>
            <Card3
              key={classItem.name_en}
              avatar={`${GCP_STORAGE_BASE_URL}${classItem.icon}`}
              name={classItem.name_en}
              job={classItem.description_1_en}
              avgEarnings={classItem.class_time}
              totalEarnings={`Rs. ${classItem.course_fee}`}
              class_date={classItem.class_date_en}
              language={classItem.language}
              link={`class/${classItem.id}?classid=${classItem.id}`}
              buttonText={"Pay and Join"}
            />
          </div>
        ))}
      </div>

      {/* </div> */}
      {isLoading && <UsersListLoading />}
    </KTCardBody>
  )
}

export { ClassTable }
