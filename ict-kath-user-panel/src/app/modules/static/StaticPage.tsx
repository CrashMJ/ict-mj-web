import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { InformationPage } from './InformationPage'
import { PapersPage } from './PapersPage'
import { SchedulePage } from './SchedulePage'
import { VideoPage } from './VideoPage'

const usersBreadcrumbs: Array<PageLink> = [
  // {
  //   title: 'Class Schedule',
  //   path: '/static/schedule',
  //   isSeparator: false,
  //   isActive: false,
  // },
  // {
  //   title: 'Class Information',
  //   path: '/static/information',
  //   isSeparator: false,
  //   isActive: false,
  // },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const StaticPage = () => {
  return (
    <Routes>
      {/* <Route element={<Outlet />}>
        <Route
          path='schedule'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Class Schedule</PageTitle>
              <SchedulePage />
            </>
          }
        />
      </Route> */}
      <Route element={<Outlet />}>
        <Route
          path='information'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Class Information</PageTitle>
              <InformationPage />
            </>
          }
        />
      </Route>
      {/* <Route element={<Outlet />}>
        <Route
          path='videos'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Supportive Videos</PageTitle>
              <VideoPage />
            </>
          }
        />
      </Route> */}
      <Route element={<Outlet />}>
        <Route
          path='papers'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Past & Modal Papers</PageTitle>
              <PapersPage />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default StaticPage
