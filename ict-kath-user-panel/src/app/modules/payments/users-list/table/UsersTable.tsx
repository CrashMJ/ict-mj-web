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
import { getPayments } from '../core/_requests'

const UsersTable = () => {
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const [activeTab, setActiveTab] = useState('class') 

  // State for Class Payments
  const [classPayments, setClassPayments] = useState<any[]>([])
  const [classSkip, setClassSkip] = useState(1)
  const [classPagination, setClassPagination] = useState<any>(null)
  const [classPagesCount, setClassPagesCount] = useState<any[]>([1])
  
  // State for Lesson Payments
  const [lessonPayments, setLessonPayments] = useState<any[]>([])
  const [lessonSkip, setLessonSkip] = useState(1)
  const [lessonPagination, setLessonPagination] = useState<any>(null)
  const [lessonPagesCount, setLessonPagesCount] = useState<any[]>([1])

  const limit = 20

  // Fetch Payments Data
  const fetchPayments = async (type: string, skip: number) => {
    const response = await getPayments({
      sort: 'DESC',
      limit: limit,
      skip: skip - 1,
      type: type,
    })

    if (response.results) {
      console.log('response.results',response.results)
      if (type === 'class') {
        setClassPayments(response.results)
      } else if (type === 'lesson') {
        setLessonPayments(response.results)
      }
    }

    if (response.pagination) {
      const pages = Math.ceil(response.pagination.total / limit)
      const pagesList = Array.from({ length: pages }, (_, i) => i + 1)

      if (type === 'class') {
      console.log('response.pagination===--',response.pagination)

        setClassPagination(response.pagination)
        setClassPagesCount(pagesList)
      } else if (type === 'lesson') {
        setLessonPagination(response.pagination)
        setLessonPagesCount(pagesList)
      }
    }
  }

  useEffect(() => {
    if (activeTab === 'class') {
      fetchPayments('class', classSkip)
    } else if (activeTab === 'lesson') {
      fetchPayments('lesson', lessonSkip)
    }
  }, [activeTab, classSkip, lessonSkip])

  // Render Table
  const renderTable = (type: any, data: any[], pagination: any, skip: number, setSkip: any, columns: any[]) => {
    return (
      <>
        <div className="table-responsive mt-5">
          <table className="table table-row-dashed table-row-gray-300 gy-7">
            <thead>
              <tr className="fw-bolder fs-6 text-gray-800">
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {type == 'class' && data.length > 0 ? (
                data.map((row: any, i: number) => (
                    <tr key={i}>
                      <td>{row.classPayment.course_name_en}</td>
                      <td>{row.classPayment.amount}</td>
                      <td>{row.classPayment.payment_type == 'bank' ? (<span className="badge badge-primary">Bank Deposit</span>) : (<span className="badge badge-warning">Online - Payhere</span>)}</td>
                      <td>{row.classPayment.payment_status == 'rejected' ? (<span className="badge badge-danger">Rejected</span>) : row.classPayment.payment_status == 'approved' ? (<span className="badge badge-success">Approved</span>) : (<span className="badge badge-info">Pending</span>)}</td>
                      <td>{row.classPayment.paid_date}</td>
                  </tr>
                ))
              ) : (type == 'lesson' && data.length > 0) ? (
                data.map((row: any, i: number) => (
                  <tr key={i}>
                    <td>{row.videoName}</td>
                    <td>{row.total_price}</td>
                    <td>{row.start_date}</td>
                    <td>{row.end_date}</td>
                    <td>{row.payment_type == 'bank' ? (<span className="badge badge-primary">Bank Deposit</span>) : (<span className="badge badge-warning">Online - Payhere</span>)}</td>
                    <td>{row.payment_status == 'canceled' ? (<span className="badge badge-danger">Canceled</span>) : row.payment_status == 'approved' ? (<span className="badge badge-success">Approved</span>) : (<span className="badge badge-info">Pending</span>)}</td>
                    <td>{row.paid_date}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={columns.length}>
                    <div className="d-flex text-center w-100 align-content-center justify-content-center">
                      No matching records found
                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        <div className="d-flex flex-stack flex-wrap pt-10">
          <div className="fs-6 fw-bold text-gray-700">{`Showing ${(limit * (skip - 1)) + 1} to ${Math.min(
            limit * skip,
            pagination?.total || 0
          )} of ${pagination?.total || 0} entries`}</div>

          <ul className="pagination">
            <li className={`page-item previous ${skip === 1 ? 'disabled' : ''}`}>
              <a onClick={() => setSkip(1)} className="page-link">
                First
              </a>
            </li>

            {type == 'class' ? ( 
              <>
              {Array.isArray(classPagesCount) &&
                classPagesCount.map((page) => (
                  <li key={page} className={`page-item ${page === skip ? 'active' : ''}`}>
                    <a onClick={() => setSkip(page)} className="page-link">
                      {page}
                    </a>
                  </li>
                ))}

                <li className={`page-item next ${skip === classPagesCount.length ? 'disabled' : ''}`}>
                  <a onClick={() => setSkip(classPagesCount.length)} className="page-link">
                    Last
                  </a>
                </li>
              </>
            ) : (type == 'lesson') ? (
<>
              {Array.isArray(lessonPagesCount) &&
                lessonPagesCount.map((page) => (
                  <li key={page} className={`page-item ${page === skip ? 'active' : ''}`}>
                    <a onClick={() => setSkip(page)} className="page-link">
                      {page}
                    </a>
                  </li>
                ))}

                <li className={`page-item next ${skip === lessonPagesCount.length ? 'disabled' : ''}`}>
                  <a onClick={() => setSkip(lessonPagesCount.length)} className="page-link">
                    Last
                  </a>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </>
    )
  }


  // useEffect(() => {
  //   async function func() {
  //     const pList = await getPayments({
  //       "sort": "DESC",
  //       "limit": limit,
  //       "skip": skip - 1
  //     });

  //     if (pList.results) {
  //       setPaymentsList(pList.results);
  //     }
  //     if (pList.pagination) {
  //       setPagination(pList.pagination);
  //       const pages = Math.ceil(pList.pagination.total / limit);
  //       setLast(pages);
  //       const pageList = [];
  //       for (let i = 1; i <= pages; i++) {
  //         pageList.push(i);
  //       }
  //       setPagesCount(pageList);
  //     }
  //   }
  //   func();
  // }, [])

  // useEffect(() => {
  //   async function func() {
  //     const pList = await getPayments({
  //       "sort": "DESC",
  //       "limit": limit,
  //       "skip": skip - 1
  //     });

  //     if (pList.results) {
  //       setPaymentsList(pList.results);
  //     }

  //     if (pList.pagination) {
  //       setPagination(pList.pagination);
  //       const pages = Math.ceil(pList.pagination.total / limit);
  //       setLast(pages);

  //       const pageList = [];
  //       for (let i = 1; i <= pages; i++) {
  //         pageList.push(i);
  //       }
  //       setPagesCount(pageList);
  //     }
  //   }
  //   func();
  // }, [skip])

  // const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
  //   columns,
  //   paymentsList,
  // })

  return (
    <KTCardBody className="py-4">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'class' ? 'active' : ''}`}
            onClick={() => setActiveTab('class')}
          >
            Class Payments
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'lesson' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesson')}
          >
            Lesson Payments
          </a>
        </li>
      </ul>

      {activeTab === 'class' &&
        renderTable(
          'class',
          classPayments,
          classPagination,
          classSkip,
          setClassSkip,
          ['Class', 'Amount', 'Type', 'Payment Status', 'Payment Date']
        )}

      {activeTab === 'lesson' &&
        renderTable(
          'lesson',
          lessonPayments,
          lessonPagination,
          lessonSkip,
          setLessonSkip,
          ['Lesson', 'Amount', 'Start Date', 'End Date', 'Type', 'Payment Status', 'Payment Date']
        )}
    </KTCardBody>
  )
}

export { UsersTable }
