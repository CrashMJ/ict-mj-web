import {FC} from 'react'
import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, QuickLinks, Search} from '../../../partials'
import {useLayout} from '../../core'
import GoogleTranslate from './GoogleTranslate'

const itemClass = 'ms-1 ms-lg-3',
  btnClass = 'btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px',
  userAvatarClass = 'symbol-30px symbol-md-40px',
  btnIconClass = 'svg-icon-1'

const Topbar: FC = () => {
  const {config} = useLayout()

  return (
    <div className='d-flex align-items-stretch justify-self-end flex-shrink-0'>
      {/* NOTIFICATIONS */}
      {/* <div className={clsx('d-flex align-items-center', itemClass)}>
        <div
          className={clsx('btn btn-icon btn-active-light-primary position-relative ', btnClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <KTSVG path='/media/icons/duotune/general/gen022.svg' className={btnIconClass} />
        </div>
        <HeaderNotificationsMenu />
      </div> */}

      {/* begin::Aside Toggler */}
      {/* {config.header.left === 'menu' && ( */}
      <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
        <div
          className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
          id='kt_header_menu_mobile_toggle'
        >
          <KTSVG path='/media/icons/duotune/text/txt001.svg' className='svg-icon-1' />
        </div>
      </div>
      {/* )} */}
      {/* <GoogleTranslate /> */}
    </div>
  )
}

export {Topbar}
