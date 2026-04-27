import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { LessonPage } from './LessonPage'
import { IndividualLessonListWrapper, LessonCategoryListWrapper, LessonsPackageListWrapper, TutesListWrapper } from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Lessons',
    path: '/lessons/category',
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
    title: 'Lesson Details',
    path: '/lessons/lesson',
    isSeparator: true,
    isActive: false,
  },
]

const LessonsPage = () => {
  return (
    <Routes>

      <Route element={<Outlet />}>
        <Route
          path='individual-lessons/lesson/*'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Lesson</PageTitle>
              <LessonPage />
            </>
          }
        />
      </Route>
      <Route element={<Outlet />}>
        <Route
          path='package-lessons/lesson/*'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Lesson</PageTitle>
              <LessonPage />
            </>
          }
        />
      </Route>
      <Route element={<Outlet />}>
        <Route
          path='tutes-lessons/lesson/*'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Lesson</PageTitle>
              <LessonPage />
            </>
          }
        />
      </Route>
      <Route element={<Outlet />}>
        <Route
          path='individual-lessons'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Individual Lessons List</PageTitle>
              <IndividualLessonListWrapper />
            </>
          }
        />
      </Route>
      <Route element={<Outlet />}>
        <Route
          path='package-lessons'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Lessons Packages List</PageTitle>
              <LessonsPackageListWrapper />
            </>
          }
        />
      </Route>
      <Route element={<Outlet />}>
        <Route
          path='tutes-lessons'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Tutes List</PageTitle>
              <TutesListWrapper />
            </>
          }
        />
      </Route>
      <Route element={<Outlet />}>
        <Route
          path='category'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Lessons Category</PageTitle>
              <LessonCategoryListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/lessons/category' />} />
    </Routes>
  )
}

export default LessonsPage
