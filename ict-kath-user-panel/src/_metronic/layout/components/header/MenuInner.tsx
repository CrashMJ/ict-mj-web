import React from 'react'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import {useIntl} from 'react-intl'
import GoogleTranslate from './GoogleTranslate'

// const siteTranslate = () => {
//   return (
//     <div id="google_translate_element"></div>
//   );
// }

export function MenuInner() {
  const intl = useIntl()

  return (
    <>
      <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuItem title='Classes' to='/classes/list' />
      <MenuItem title='Lessons' to='/lessons/category' />
      <MenuItem title='Payments' to='/payments/list' />
      <MenuItem title='Homework' to='/homework/list' />
      {/* <MenuItem title='Class Schedule' to='/static/schedule' /> */}
      <MenuItem title='Help & Information' to='/static/information' />
      {/* <MenuItem title='Supportive Videos' to='/static/videos' /> */}
      <MenuItem title='Past & Modal Papers' to='/static/papers' />
      {/* <GoogleTranslate /> */}
    </>
  )
}
