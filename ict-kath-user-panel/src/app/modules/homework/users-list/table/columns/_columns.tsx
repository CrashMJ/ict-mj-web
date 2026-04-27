import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserTwoStepsCell } from './UserTwoStepsCell'
import { UserActionsCell } from './UserActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { Payment } from '../../core/_models'

const usersColumns: ReadonlyArray<Column<Payment>> = [
  // {
  //   Header: (props) => <UserCustomHeader tableProps={props} title='Class' className='min-w-125px' />,
  //   id: 'course_name_en',
  // },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Amount' className='min-w-125px' />,
    id: 'amount',
  },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Type' className='min-w-125px' />
  //   ),
  //   id: 'payment_type',
  //   Cell: ({ ...props }) => <UserLastLoginCell last_login={props.data[props.row.index].payment_type} />,
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Two steps' className='min-w-125px' />
  //   ),
  //   id: 'payment_status',
  //   Cell: ({ ...props }) => <UserTwoStepsCell two_steps={props.data[props.row.index].payment_status} />,
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Day' className='min-w-125px' />
  //   ),
  //   id: 'created_at',
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
  //   ),
  //   id: 'actions',
  //   Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  // },
]

export { usersColumns }
