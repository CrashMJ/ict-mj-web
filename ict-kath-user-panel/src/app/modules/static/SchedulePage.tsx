// import { QueryRequestProvider } from './core/QueryRequestProvider'
import { KTCard, toAbsoluteUrl } from '../../../_metronic/helpers'

const Schedule = () => {
  // const { itemIdForUpdate } = useListView()
  return (
    <>
      <KTCard>
        <img
          src={toAbsoluteUrl('/media/static/class.png')}
          className='h-50 align-self-center mt-10 mb-10'
          style={{ width: '90%' }}
          alt=''
        />
      </KTCard>
    </>
  )
}

const SchedulePage = () => (
  <Schedule />
)

export { SchedulePage }
