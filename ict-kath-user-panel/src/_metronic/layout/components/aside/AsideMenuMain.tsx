/* eslint-disable react/jsx-no-target-blank */
import { useIntl } from 'react-intl'
import { AsideMenuItemWithSubMain } from './AsideMenuItemWithSubMain'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'

export function AsideMenuMain() {
  const intl = useIntl()
  const { currentUser, logout } = useAuth()
  const test = () => {
    logout();
  }
  return (
    <>
      <AsideMenuItem
        to='/account/settings'
        title='Profile'
        bsTitle='Profile'
        fontIcon='bi-person-bounding-box'
        className='py-3'
      />
      <AsideMenuItem
        to='/dashboard'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-bar-chart-line'
        bsTitle={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        className='py-3'
      />
      <AsideMenuItem
        to='/classes/list'
        title='Online Class Link'
        bsTitle='Online Class Link'
        fontIcon='bi-calendar-check'
        className='py-3'
      />
      <AsideMenuItem
        to='/lessons/category'
        title='Lesson Purchase'
        bsTitle='Lesson Purchase'
        fontIcon='bi-camera-video'
        className='py-3'
      />
      <AsideMenuItem
        to='/payments/list'
        title='Payments'
        bsTitle='Payments'
        fontIcon='bi-credit-card'
        className='py-3'
      />

      <AsideMenuItem
        onClick={test}
        to=''
        title='Logout'
        bsTitle='Logout'
        fontIcon='bi-box-arrow-left'
        className='py-3'
      />
    </>
  )
}
