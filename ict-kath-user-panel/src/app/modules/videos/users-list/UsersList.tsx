import { useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { LessonTabs } from './table/LessonTabs'
import { IndividualLessonTable } from './table/IndividualLessonTable'
import { LessonPackageTable } from './table/LessonPackageTable'
import { TutesTable } from './table/TutesTable'
const LessonCategoryList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      {/* <KTCard> */}
      {/* <UsersListHeader /> */}
      <LessonTabs />
      {/* </KTCard> */}
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const IndividualLessonList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      {/* <KTCard> */}
      {/* <UsersListHeader /> */}
      <IndividualLessonTable />
      {/* </KTCard> */}
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const LessonsPackageList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      {/* <KTCard> */}
      {/* <UsersListHeader /> */}
      <LessonPackageTable />
      {/* </KTCard> */}
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const TutesList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      {/* <KTCard> */}
      {/* <UsersListHeader /> */}
      <TutesTable />
      {/* </KTCard> */}
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

//====================================================//

const LessonCategoryListWrapper = () => (
  <QueryRequestProvider>
    {/* <QueryResponseProvider> */}
    {/* <ListViewProvider> */}
    <LessonCategoryList />
    {/* </ListViewProvider> */}
    {/* </QueryResponseProvider> */}
  </QueryRequestProvider>
)

const IndividualLessonListWrapper = () => (
  <QueryRequestProvider>
    {/* <QueryResponseProvider> */}
    {/* <ListViewProvider> */}
    <IndividualLessonList />
    {/* </ListViewProvider> */}
    {/* </QueryResponseProvider> */}
  </QueryRequestProvider>
)

const LessonsPackageListWrapper = () => (
  <QueryRequestProvider>
    {/* <QueryResponseProvider> */}
    {/* <ListViewProvider> */}
    <LessonsPackageList />
    {/* </ListViewProvider> */}
    {/* </QueryResponseProvider> */}
  </QueryRequestProvider>
)

const TutesListWrapper = () => (
  <QueryRequestProvider>
    {/* <QueryResponseProvider> */}
    {/* <ListViewProvider> */}
    <TutesList />
    {/* </ListViewProvider> */}
    {/* </QueryResponseProvider> */}
  </QueryRequestProvider>
)

export { LessonCategoryListWrapper, IndividualLessonListWrapper, LessonsPackageListWrapper, TutesListWrapper }
