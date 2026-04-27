import { useEffect, useMemo, useState } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns } from './columns/_columns'
import { Payment } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { UsersListPagination } from '../components/pagination/UsersListPagination'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { getPastPapers } from '../core/_requests'

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

  const [class_type, setClass_type] = useState<any>("");
  const [grade, setGrade] = useState<any>("");
  const [medium, setMedium] = useState<any>("");
  const [type, setType] = useState<any>("");


  useEffect(() => {
    async function func() {
      const pList = await getPastPapers({
        "class_type": "",
        "type": "",
        "grade": "",
        "medium": "",
        "sort_field": "id",
        "sort": "DESC",
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
      const pList = await getPastPapers({
        "class_type": class_type,
        "type": type,
        "grade": grade,
        "medium": medium,
        "sort_field": "id",
        "sort": "DESC",
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
  }, [skip, class_type, grade, medium, type, limit])

  // const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
  //   columns,
  //   paymentsList,
  // })

  return (<>
    <KTCardBody className='py-4'>
      <div className=''>
        <h5>Filter</h5>
        <div className='row mb-6'>
          <div className='col-lg-2'>
            <label className='col-lg-12 col-form-label fw-bold'>Class Type</label>
            <div className='col-lg-12'>
              <select
                name="class_type"
                className='form-control form-control-lg form-control-solid mb-lg-0'
                onChange={(event: any) => { setClass_type(event.target.value) }}
                value={class_type}
              >
                <option value="">Select</option>
                <option value="al">A/L</option>
                <option value="ol">O/L</option>
                <option value="miner">Miner</option>
              </select>
            </div>
          </div>
          <div className='col-lg-2'>
            <label className='col-lg-12 col-form-label fw-bold fs-6'>Class Grade</label>
            <div className='col-lg-12'>
              <select
                name="grade"
                className='form-control form-control-lg form-control-solid mb-lg-0'
                onChange={(event: any) => { setGrade(event.target.value) }}
                value={grade}
              >
                <option value="">Select</option>
                <option value="grade6">Grade 6</option>
                <option value="grade7">Grade 7</option>
                <option value="grade8">Grade 8</option>
                <option value="grade9">Grade 9</option>
                <option value="grade10">Grade 10</option>
                <option value="grade11">Grade 11</option>
                <option value="grade12">Grade 12</option>
                <option value="grade13">Grade 13</option>
              </select>
            </div>
          </div>
          <div className='col-lg-2'>
            <label className='col-lg-12 col-form-label fw-bold fs-6'>Medium</label>
            <div className='col-lg-12'>
              <select
                name="medium"
                className='form-control form-control-lg form-control-solid mb-lg-0'
                onChange={(event: any) => { setMedium(event.target.value) }}
                value={medium}
              >
                <option value="">Select</option>
                <option value="sinhala">Sinhala</option>
                <option value="tamil">Tamil</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>
          <div className='col-lg-2'>
            <label className='col-lg-12 col-form-label fw-bold fs-6'>Type</label>
            <div className='col-lg-12'>
              <select
                name="type"
                className='form-control form-control-lg form-control-solid mb-lg-0'
                onChange={(event: any) => { setType(event.target.value) }}
                value={type}
              >
                <option value="">Select</option>
                <option value="modal_papers">Modal Paper</option>
                <option value="past_papers">Past Paper</option>
              </select>
            </div>
          </div>
          <div className='col-lg-2'>
            <label className='col-lg-12 col-form-label fw-bold fs-6 mt-5'> </label>
            <button type='submit' className='btn' onClick={() => {
              setType("");
              setGrade("");
              setMedium("");
              setClass_type("");
            }}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </KTCardBody>
    <KTCardBody className='py-4'>

      <div className='table-responsive'>

        <table className="table table-row-dashed table-row-gray-300 gy-7">
          <thead>
            <tr className="fw-bolder fs-6 text-gray-800">
              <th>Title</th>
              <th>Class</th>
              <th>Grade</th>
              <th>Medium</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentsList.length > 0 ? (
              paymentsList.map((row: any, i: number) => {
                return <tr key={row.id + ''}>
                  <td>{row.title}</td>
                  <td>{row.class_type == 'al' ? "A/L" : row.class_type == 'ol' ? "O/L" : "Miner"}</td>
                  <td>{row.grade.toUpperCase()}</td>
                  <td>{row.medium}</td>
                  <td>{row.type == 'past_papers' ? "Past Paper" : "Modal Paper"}</td>
                  <td><a href={row.url} target="_blank" className='btn btn-sm btn-success fs-5 fw-bolder' rel="noreferrer">
                    <KTSVG path='/media/icons/duotune/files/fil017.svg' className='svg-icon-3 fs-5 fw-bolder' />
                  </a>
                  </td>
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
        <div className='fs-6 fw-bold text-gray-700'>{`Showing ${skip==1 ? skip : (skip * limit) - limit} to ${(limit * skip) - limit + pagination?.count} of ${pagination?.total} entries`}</div>

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
  </>

  )
}

export { UsersTable }
