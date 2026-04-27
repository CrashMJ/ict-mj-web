import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { UsersListHeader } from './components/header/UsersListHeader'
import { ClassTable } from './table/ClassTable'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { KTCard } from '../../../../_metronic/helpers'

const UsersList = () => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      {/* <KTCard> */}
      {/* <UsersListHeader /> */}
      <ClassTable />
      {/* </KTCard> */}
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider>
    {/* <QueryResponseProvider> */}
    {/* <ListViewProvider> */}
    <UsersList />
    {/* </ListViewProvider> */}
    {/* </QueryResponseProvider> */}
  </QueryRequestProvider>
)

export { UsersListWrapper }
