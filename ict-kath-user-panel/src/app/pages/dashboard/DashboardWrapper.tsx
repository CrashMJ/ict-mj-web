import React, {FC, Suspense, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {GCP_STORAGE_BASE_URL} from '../../../config'
import {PageTitle} from '../../../_metronic/layout/core'
import {Card3} from '../../../_metronic/partials/content/cards/Card3'
import {AccountHeader} from '../../modules/accounts/AccountHeader'
import {useAuth} from '../../modules/auth'
import {getAuth} from '../../modules/auth/core/AuthHelpers'
import {getEnClasses} from '../../modules/classes/users-list/core/_requests'
import {getPurchasedLessons} from '../../modules/videos/users-list/core/_requests'
import {Card7} from '../../../_metronic/partials/content/cards/Card7'
import CountdownTimer from '../../modules/widgets/components/CountdownTimer'
import { UpdateNicImagesModal } from './_modals/update-profile/UpdateNicImagesModal'
// import OneSignal from 'react-onesignal';

const UpdateProfileModal = React.lazy(() =>
  import('./_modals/update-profile/UpdateProfileModal').then((module) => ({
    default: module.UpdateProfileModal,
  }))
)

const UpdateProfileNicImagesModal = React.lazy(() =>
  import('./_modals/update-profile/UpdateNicImagesModal').then((module) => ({
    default: module.UpdateNicImagesModal,
  }))
)

const DashboardPage: FC = () => {
  const auth = useMemo(() => getAuth(), [])

  const {logout} = useAuth()
  const [greet, setGreet] = useState<string>('Welcome Student!')
  const [classesAl, setClassesAl] = useState<any[]>([])
  const [showUpdateProfile, setShowUpdateProfile] = useState<boolean>(true)
  const [showUpdateNIcImage, setShowUpdateNIcImage] = useState<boolean>(true)
  const [nic, setNic] = useState<string>(auth.nic || '')
  const [classType, setClassType] = useState<string>(auth.class_type || '')
  const [location, setLocation] = useState<string>(auth.location || '')
  const [lessons, setLessons] = useState<any[]>([])
  const [nicFront, setNicFront] = useState<string>(auth.nic_front || null)
  const [nicBack, setNicBack] = useState<string>(auth.nic_back || null)

  useEffect(() => {
    // We have to show toolbar only for dashboard page
    document.getElementById('kt_layout_toolbar')?.classList.remove('d-none')
    return () => {
      document.getElementById('kt_layout_toolbar')?.classList.add('d-none')
    }
  }, [])

  useEffect(() => {
    // Greet user based on the time of day
    const myDate = new Date()
    const hours = myDate.getHours()
    var greet

    if (hours < 12) greet = 'Morning'
    else if (hours >= 12 && hours <= 17) greet = 'Afternoon'
    else if (hours >= 17 && hours <= 24) greet = 'Evening'

    setGreet(`Good ${greet}, ${auth.fname}!`)
  }, [auth.fname])

  useEffect(() => {
    let isCancelled = false
    async function fetchData() {
      try {
        // Fetch both class list and lessons in parallel
        const [classList, lessonList] = await Promise.all([
          getEnClasses({
            course_id: null,
            payment_id: null,
            date_begin: '',
            date_end: '',
            payment_status: 'approved',
            status: '',
            sort: 'DESC',
            sort_field: 'id',
            limit: 50,
            skip: 0,
          }),
          getPurchasedLessons({
            video_id: null,
            payment_type: '',
            payment_status: 'approved',
            status: 'active',
            sort: 'DESC',
            sort_field: 'id',
            limit: 100,
            skip: 0,
          }),
        ])
        console.log('lessonList', lessonList.results)
        if (!isCancelled) {
          if (classList.statusCode === 401 || lessonList.statusCode === 401) {
            logout()
          }

          if (classList.results) setClassesAl(classList.results)
          if (lessonList.results) setLessons(lessonList.results)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // OneSignal.push(function() {
    //   OneSignal.setExternalUserId(externalUserId);
    // });
    fetchData()
    return () => {
      isCancelled = true // Prevent state updates on unmounted component
    }
  }, [logout])

  // useEffect(() => {
  // Ensure this code runs only on the client side
  // if (typeof window !== 'undefined') {
  //   OneSignal.init({
  //     appId: 'd2a52bc5-9db3-4ece-8fc9-bda2cc82bdd4',
  //     // You can add other initialization options here
  //     notifyButton: {
  //       enable: true,
  //     },
  //     // Uncomment the below line to run on localhost. See: https://documentation.onesignal.com/docs/local-testing
  //     // allowLocalhostAsSecureOrigin: true
  //   });
  // }
  // }, []);

  return (
    <>
      {auth &&
        ((auth.class_grade == 'al' && auth.nic == '') ||
          auth.class_type == '' ||
          (auth.class_type == 'physical' && auth.location == '')) && (
          <Suspense fallback={<div>Loading...</div>}>
            <UpdateProfileModal
              data={{nic, classType, location, setNic, setClassType, setLocation}}
              show={showUpdateProfile}
              handleClose={() => setShowUpdateProfile(false)}
            />
          </Suspense>
        )}

        {auth && auth.class_grade == 'al' &&        
        (auth.nic_front == '' ||
          auth.nic_back == '' ) && (
          <Suspense fallback={<div>Loading...</div>}>
            <UpdateNicImagesModal
              data={{nicFront, nicBack, setNicFront, setNicBack}}
              show={showUpdateNIcImage}
              handleClose={() => setShowUpdateNIcImage(false)}
            />
          </Suspense>
        )}
      {/* <div id="google_translate_element222222"></div> */}
      {/* begin::Row  */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xxl-8'>
          <h2 style={{fontSize: 30}}>{greet}</h2>
        </div>
        <AccountHeader />
        <div className='separator border-3 my-10'></div>
      </div>

      {classesAl.length > 0 && (
        <div className='row g-6 g-xl-9 mb-6'>
          <h5>Enrolled Classes</h5>
          {classesAl.map((classItem: any) => (
            <div className='col-md-6 col-xxl-4' key={classItem.course.id}>
              <Card3
                avatar={`${GCP_STORAGE_BASE_URL}${classItem.course.icon}`}
                name={classItem.course.name_en}
                job={classItem.course.description_1_en}
                avgEarnings={classItem.course.class_time}
                totalEarnings={`Rs. ${classItem.course.course_fee}`}
                class_date={classItem.course.class_date_en}
                language={classItem.course.language}
                link={`/classes/class/${classItem.course.id}?classid=${classItem.course.id}`}
                buttonText={'Go to Class'}
              />
            </div>
          ))}
        </div>
      )}

      {lessons.length > 0 && (
        <div className='row g-6 g-xl-9 mb-6'>
          <h5>Purchased Lessons</h5>
          {lessons.map((lessonItem: any) => (
            <div className='col-md-12 col-lg-6 col-xxl-6' key={lessonItem.id}>
              <Card7
                image={`${GCP_STORAGE_BASE_URL}${lessonItem.video_icon}`}
                title={lessonItem.videoName}
                description={lessonItem.videoDescription}
                duration={lessonItem.videoDuration}
                expireDate={lessonItem.expire_date}
                link={`/lessons/${lessonItem.videoType}-lessons/lesson/${lessonItem.video_id}?lessonid=${lessonItem.video_id}`}
                buttonText={'View Lesson'}
              />
            </div>
          ))}
        </div>
      )}
      {/* end::Row  */}
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
