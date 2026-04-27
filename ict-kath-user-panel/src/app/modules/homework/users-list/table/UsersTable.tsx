import { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns } from './columns/_columns'
import { Payment } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { UsersListPagination } from '../components/pagination/UsersListPagination'
import { KTCardBody } from '../../../../../_metronic/helpers'
import { getHomework } from '../core/_requests'

const UsersTable = () => {
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => users, [users])
  const columns = useMemo(() => usersColumns, [])

  const [paymentsList, setPaymentsList] = useState<any>([]);
  const [skip, setSkip] = useState<any>(1);
  const [limit] = useState<any>(20);
  const [last, setLast] = useState<any>(skip);
  const [pagination, setPagination] = useState<any>();
  const [pagesCount, setPagesCount] = useState<any[]>([1]);


  useEffect(() => {
    async function func() {
      const pList = await getHomework({
        "course_id": null,
        "module_id": null,
        "status": "",
        "sort": "DESC",
        "sort_field": "id",
        "limit": limit,
        "skip": skip - 1
      });

      if (pList.results) {
        setPaymentsList(pList.results);
      }
      if (pList.pagination) {
        setPagination(pList.pagination);
        const pages = Math.ceil(pList.pagination.total / limit);
        setLast(pages);
        const pageList = [];
        for (let i = 1; i <= pages; i++) {
          pageList.push(i);
        }
        setPagesCount(pageList);
      }
    }
    func();
  }, [])

  useEffect(() => {
    async function func() {
      const pList = await getHomework({
        "course_id": null,
        "module_id": null,
        "status": "",
        "sort": "DESC",
        "sort_field": "id",
        "limit": limit,
        "skip": skip - 1
      });

      if (pList.results) {
        setPaymentsList(pList.results);
      }

      if (pList.pagination) {
        setPagination(pList.pagination);
        const pages = Math.ceil(pList.pagination.total / limit);
        setLast(pages);

        const pageList = [];
        for (let i = 1; i <= pages; i++) {
          pageList.push(i);
        }
        setPagesCount(pageList);
      }
    }
    func();
  }, [skip])

  // const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
  //   columns,
  //   paymentsList,
  // })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table className="table table-row-dashed table-row-gray-300 gy-7">
          <thead>
            <tr className="fw-bolder fs-6 text-gray-800">
              <th>Class</th>
              <th>Module</th>
              <th>Question</th>
              <th>Star Rating</th>
              <th>Teacher Comment</th>
              <th>Rated</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentsList.length > 0 ? (
              paymentsList.map((row: any, i: number) => {
                return <tr key={row.id + ''}>
                  <td>{row.course_en_name || ""}</td>
                  <td>{row.module_en_name || ""}</td>
                  <td>{row.question_title || ""}</td>
                  <td>{row.star_ratings+ '/5'}</td>
                  <td>{row.comments || "N/A"}</td>
                  <td>{!row.is_rated ? (<span className="badge badge-info">Pending</span>) : (<span className="badge badge-success">Rated</span>)}</td>
                  <td>{row.created_at || ""}</td>
                </tr>
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='d-flex flex-stack flex-wrap pt-10'>
        <div className='fs-6 fw-bold text-gray-700'>{`Showing ${skip} to ${limit * skip} of ${pagination?.total} entries`}</div>

        <ul className='pagination'>
          <li className='page-item previous' >
            <a onClick={() => setSkip(1)} className='page-link'>
              <i className='previous'></i>
            </a>
          </li>


          {pagesCount && pagesCount.map((page: any) => (
            <li className={`page-item ${page == skip ? 'active' : ''}`} key={page + ""}>
              <a onClick={() => setSkip(page)} className='page-link'>
                {page}
              </a>
            </li>
          ))}

          <li className='page-item next'>
            <a onClick={() => setSkip(last)} className='page-link'>
              <i className='next'></i>
            </a>
          </li>
        </ul>
      </div>
      {isLoading && <UsersListLoading />}
    </KTCardBody>
  )
}

export { UsersTable }
