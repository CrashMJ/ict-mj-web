/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import { toAbsoluteUrl, KTSVG } from '../../../helpers'
import { buyVideo, getBuyLessonData, payherePayment } from '../../../../app/modules/videos/users-list/core/_requests'
import PaymentModal from '../../../../app/PaymentModal/PaymentModal'
import { getAuth } from '../../../../app/modules/auth'
import { auto } from '@popperjs/core'

type Props = {
  videoId: string
  color?: string
  avatar?: string
  online?: boolean
  name: string
  days: number
  job: string
  discountedPrice: string
  price: string
  link: string
  buttonText: string
  type: string
}

const Card6: FC<Props> = ({
  videoId,
  color = '',
  avatar = '',
  online = false,
  name,
  days,
  job,
  discountedPrice,
  price,
  link,
  buttonText,
  type
}) => {
  const [buyInfo, setBuyInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
   
  useEffect(() => {

    const fetchBuyData = async () => {
        if (!videoId) return; // Validate inputs
        console.log('videoId fetchBuyData',videoId)
        try{
            const buyInfo = await getBuyLessonData(videoId);
            console.log('buyInfo',buyInfo)
            if (buyInfo) {
                setBuyInfo(buyInfo.data);
            }
        } catch (error) {
            console.error('Error fetching video details:', error);
        } finally {
          setIsLoading(false) // Set loading to false after fetching is complete
        }
    }

    fetchBuyData();
}, [videoId])
  return (
    <div className='card d-flex flex-column justify-content-between' style={{minHeight: "500px"}}>
      <div className='card-body d-flex flex-center flex-column p-9'>
        <div className='mb-5 w-100 d-flex justify-content-center align-items-center'>
          <div className="symbol symbol-100px position-relative d-flex align-items-center justify-content-center w-100 h-100" style={{ height: '250px', maxHeight: '250px', width: '100%' }}>
            {color ? (
              <span
                className={`symbol-label bg-light-${color} text-${color} fs-3 fw-bold d-flex align-items-center justify-content-center`}
                style={{ width: "100%", height: "100%" }}
              >
                {name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <img
                alt="Profile"
                src={toAbsoluteUrl(avatar)}
                className="img-thumbnail border border-secondary w-100 h-100"
                style={{ objectFit: 'cover', maxHeight: "250px", height: "250px", width: "100%" }}
              />
            )}
            {online && (
              <div
                className="symbol-badge bg-success position-absolute border border-white"
                style={{
                  width: "15px",
                  height: "15px",
                  bottom: "5px",
                  right: "5px",
                }}
              ></div>
            )}
          </div>

        </div>

        <a href='#' className='fs-4 text-primary text-hover-primary fw-bolder mb-0'>
          {name}
        </a>

        <div className='fw-bold text-center text-gray-400 mb-6'>{job}</div>

        <div className='d-flex flex-center flex-wrap mb-5'>
          {type !== 'tutes' && <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mx-3 mb-3'>
            <div className='fs-6 fw-bolder text-gray-700' style={{ textTransform: 'capitalize' }}>{days} Days</div>
            <div className='fw-bold text-gray-400'>Days</div>
          </div>}

          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 mx-3 px-4 mb-3'>
            <div className='fs-6 fw-bolder text-gray-700' >{(Number(discountedPrice) > 0 )? discountedPrice : price}</div>
            {type !== 'tutes' ? (
              <div className='fw-bold text-gray-400'>Lesson Price</div>
              ) : (
              <div className='fw-bold text-gray-400'>Tute Price</div>

              )}
          </div>
        </div>

        <a href={link} className='btn btn-sm btn-primary d-flex align-items-center'>
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
          {isLoading ? 'Loading...' : buyInfo?.payment_status === 'approved' ? 'View' : buttonText}
        </a>
      </div>
    </div >
  )
}

export { Card6 }
