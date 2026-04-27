/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {toAbsoluteUrl, KTSVG} from '../../../helpers'
import {Dropdown1} from '../dropdown/Dropdown1'

type Props = {
  image: string
  title: string
  description: string
  duration: string
  expireDate: string
  link: string
  buttonText: string
}

const Card7: FC<Props> = ({image, title, description, duration, expireDate, link, buttonText}) => {
  console.log('image', image, duration)
  return (
    <div className='card h-100'>
      <div className='card-header d-flex justify-content-between align-items-center flex-wrap flex-md-nowrap border-0 pt-9'>
        <div className='d-flex flex-column flex-sm-row justify-content-center align-items-center text-center mb-3 mb-md-0'>
          <div className='symbol symbol-100px symbol-lg-100px symbol-fixed position-relative mb-4 mb-sm-0 me-sm-4'>
            <img
              src={toAbsoluteUrl(image)}
              alt='icon'
              style={{objectFit: 'cover', height: '100%'}}
            />
          </div>
          <a
            href='#'
            className='fs-4 fw-bold text-hover-primary text-gray-600 m-5 mb-2 text-truncate text-wrap'
          >
            {title}
          </a>
        </div>
        <div className='w-100 w-md-auto text-center mt-3 mt-md-0'>
          <a
            href={link}
            className='btn btn-sm btn-primary d-flex align-items-center justify-content-center mx-5'
          >
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
            {buttonText}
          </a>
        </div>
      </div>

      <div className='card-body d-flex flex-column px-9 pt-6 pb-8'>
        <div className='row'>
          <div className='col d-flex justify-content-between text-muted fs-7 mb-3'>
            <span>Duration: {duration}</span>
            <span>Expires: {expireDate}</span>
          </div>
        </div>
        <div className='fs-6 mb-3'>{description}</div>
      </div>
    </div>
  )
}

export {Card7}
