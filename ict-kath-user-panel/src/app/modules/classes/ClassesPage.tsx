import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { ClassPage } from './ClassPage'
import { UsersListWrapper } from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Classes',
    path: '/classes/list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
  {
    title: 'Class Details',
    path: '/classes/class',
    isSeparator: true,
    isActive: false,
  },
]

const ClassesPage = () => {
  return (
    <Routes>

      <Route element={<Outlet />}>
        <Route
          path='class/*'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Class</PageTitle>
              <ClassPage />
            </>
          }
        />
      </Route>
      <Route element={<Outlet />}>
        <Route
          path='list'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Online Class Link     </PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/classes/list' />} />
    </Routes>
  )
}

export default ClassesPage
