/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Link } from 'react-router-dom'
import { Dropdown1 } from '../../../_metronic/partials'
import { useLocation } from 'react-router'
import { GCP_STORAGE_BASE_URL } from '../../../config'

type Props = {
  classInfo?: any
  classesAl?: any
  isFreeClass?: boolean
}

const ClassHeader: React.FC<Props> = ({ classInfo, classesAl, isFreeClass }) => {
  const location = useLocation()

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              <img src={`${GCP_STORAGE_BASE_URL}${classInfo.icon}`} alt='ICT Kathurusingha' />

            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                    {classInfo.name_en}
                  </a>
                  <a href='#'>
                    <KTSVG
                      path='/media/icons/duotune/general/gen026.svg'
                      className='svg-icon-1 svg-icon-primary'
                    />
                  </a>
                  <span
                    className='btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3'
                  >
                    {classInfo.class_delivery_type}
                  </span>

                  {!isFreeClass && classesAl && classesAl.enrollment && classesAl.enrollment.payment_status === 'approved' ? (<span

                    className='btn btn-sm btn-light-info fw-bolder ms-2 fs-8 py-1 px-3'
                  >
                    Enrolled & Payment Success
                  </span>) : !isFreeClass && classesAl && classesAl.enrollment && classesAl.enrollment.payment_status === 'pending' ? (<span

                    className='btn btn-sm btn-light-warning fw-bolder ms-2 fs-8 py-1 px-3'
                  >Enrolled & Payment Pending
                  </span>) : isFreeClass ? (<span

                    className='btn btn-sm btn-light-info fw-bolder ms-2 fs-8 py-1 px-3'
                  >
                    Free Class
                  </span>) :
                    (<span

                      className='btn btn-sm btn-light-danger fw-bolder ms-2 fs-8 py-1 px-3'
                    >
                      Not Enrolled
                    </span>)}
                </div>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/finance/fin003.svg'
                      className='svg-icon-4 me-1'
                    />
                    Rs. {classInfo.course_fee}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen014.svg'
                      className='svg-icon-4 me-1'
                    />
                    {classInfo.class_date_en}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen013.svg'
                      className='svg-icon-4 me-1'
                    />
                    {classInfo.class_time}
                  </a>

                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <i className="bi bi-telephone-outbound fs-1x me-1"></i>
                    0779361706
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com011.svg'
                      className='svg-icon-4 me-1'
                    />
                    inquiry@ictkathurusingha.com
                  </a>
                </div>
                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <span>{classInfo.description_1_en}</span>
                </div>
                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <span>{classInfo.description_2_en}</span>
                </div>
              </div>


            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export { ClassHeader }
