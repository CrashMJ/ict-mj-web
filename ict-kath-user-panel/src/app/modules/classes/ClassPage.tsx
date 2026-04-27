/* eslint-disable jsx-a11y/anchor-is-valid */
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getAuth, useAuth } from '../auth'
import { ClassHeader } from './ClassHeader'
import { authTokenValidate, bankPay, getClassDetails, getCourseClasses, getCourseMaterials, getEnClasses, getModules, homeworkUp } from './users-list/core/_requests'
import * as Yup from 'yup'
import moment from 'moment'
import PaymentModal from '../../PaymentModal/PaymentModal'
import { createBuyLessonViewData } from '../videos/users-list/core/_requests'

const profileDetailsSchema = Yup.object().shape({
    // image: Yup.string().required('Image is required'),
})

export function ClassPage() {
    const [auth, setAuth] = useState<any | undefined>(getAuth())
    const { logout } = useAuth()
    const [classDetails, setClassDetails] = useState<any>([]);
    const [loading2, setLoading2] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const [classId] = useState<any>(searchParams.get("classid"));
    const [classesAl, setClassesAl] = useState<any>()
    const [courseClasses, setCourseClasses] = useState<any>([])
    const [courseMaterial, setCourseMaterial] = useState<any>([])
    const [courseExams, setCourseExams] = useState<any>([])
    const [courseRec, setCourseRec] = useState<any>([])
    const [courseRep, setCourseRep] = useState<any>([])
    const [moduleList, setModuleList] = useState<any>([])
    const [isPaymentSuccess, setPaymentSuccess] = useState<boolean>(false)
    const [isWithingMonth, setWithinMonth] = useState<boolean>(false)
    const [isFreeClass, setFreeClass] = useState<boolean>(false)
    const [paymentRe, setPaymentRe] = useState<boolean>(false)

    const openInNewTab = (url: string | URL | undefined) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const validateAuth = async (url: string | URL | undefined) => {
        const ret = await authTokenValidate(auth?.token);
        if (ret && ret.Success && ret.Success === 'Authorized') {
            openInNewTab(url)
            return true;
        } else {
            logout();
            return false;
        }
    };

    useEffect(() => {
        async function func() {
            setLoading2(true)
            const classInfo = await getClassDetails(classId);
            const classList = await getEnClasses({
                "course_id": classId,
                "payment_id": null,
                "date_begin": "",
                "date_end": "",
                "payment_status": "",
                "status": "active",
                "sort": "DESC",
                "sort_field": "id",
                "limit": 10,
                "skip": 0
            });

            const moduleInfo = await getModules({
                "keyword": "",
                "course_id": classId,
                "status": "active",
                "sort": "DESC",
                "sort_field": "id",
                "limit": 100,
                "skip": 0
            });
            console.log(moduleInfo)

            if (classList.statusCode === 401 || classInfo.statusCode === 401) {
                logout();
            }

            if (moduleInfo.results && moduleInfo.results.length > 0) {
                setModuleList(moduleInfo.results);
            }

            if (classList.results && classList.results.length > 0) {
                setClassesAl(classList.results[0]);
                const courseClassList = await getCourseClasses({
                    "keyword": "",
                    "course_id": classId,
                    "module_id": null,
                    "status": "active",
                    "sort_field": "id",
                    "sort": "DESC",
                    "limit": 200,
                    "skip": 0
                });

                if (courseClassList && courseClassList.data && courseClassList.data.results) {
                    setCourseClasses(courseClassList.data.results);
                }

                const courseMaterialList = await getCourseMaterials({
                    "keyword": "",
                    "type": "",
                    "course_id": classId,
                    "status": "active",
                    "sort_field": "id",
                    "sort": "DESC",
                    "limit": 200,
                    "skip": 0
                });

                if (courseMaterialList && courseMaterialList.data && courseMaterialList.data.results) {
                    const exams: any[] = [];
                    const mats: any[] = [];
                    const recs: any[] = [];
                    const reps: any[] = [];
                    courseMaterialList.data.results.forEach((mat: any) => {
                        if (mat.type === 'exam')
                            exams.push(mat)
                        else if (mat.type === 'repeat-class')
                            reps.push(mat)
                        else if (mat.type === 'recording')
                            recs.push(mat)
                        else if (mat.type === 'document')
                            mats.push(mat)
                    });
                    setCourseMaterial(mats);
                    setCourseExams(exams);
                    setCourseRec(recs);
                    setCourseRep(reps);
                }

            }


            if (classInfo && classInfo.data) {
                setClassDetails(classInfo.data);
                setPaymentSuccess(classInfo.data.enrollment && classInfo.data.enrollment.length > 0 && classInfo.data.enrollment[0] && classInfo.data.enrollment[0].payment_status === 'approved' && classInfo.data.enrollment[0].status === 'active' ? true : false)
                if (classInfo.data.enrollment && classInfo.data.enrollment[0] && classInfo.data.enrollment[0].payment_date) {
                    if (moment().isSame(classInfo.data.enrollment[0].payment_date, 'month')) {
                        setPaymentSuccess(true);
                    } else {
                        let addedMOnth = moment(classInfo.data.enrollment[0].payment_date, "YYYY-MM-DD").add(1, 'month').format("YYYY-MM-DD");
                        if (moment().isSame(addedMOnth, 'month')) {
                            setWithinMonth(true);
                        } else {
                            setWithinMonth(false);
                        }
                        setPaymentSuccess(false);
                    }
                }

                setFreeClass(classInfo.data.course_fee === 0 ? true : false)
            }


            setLoading2(false)
        }
        func();
    }, [paymentRe])

    const [data, setData] = useState<any>({ image: "" })
    const updateData = (fieldsToUpdate: Partial<any>): void => {
        const updatedData = Object.assign(data, fieldsToUpdate)
        setData(updatedData)
    }

    const [loading, setLoading] = useState(false)

    const [fieldValue, setFieldValue] = useState<any>(null)
    const [stateSuccess, setStateSuccess] = useState<any>(null)
    const [stateSuccess2, setStateSuccess2] = useState<any>(null)

    const [stateErr, setStateErr] = useState<any>(null)
    const [stateErr2, setStateErr2] = useState<any>(null)
    const [recordStateErr, setRecordStateErr] = useState<any>(null)
    const [orderInfo, setOrderInfo] = useState<any>(null)

    const [course_module_id, setcourse_module_id] = useState<any>(null)
    const [question_description, setquestion_description] = useState<any>(null)
    const [question_title, setquestion_title] = useState<any>(null)
    const [question_pdf, setquestion_pdf] = useState<any>(null)
    const [currentVideo, setCurrentVideo] = useState<any>(null)
    const [btnName, setBtnName] = useState<any>(null)

    const getOrderInfo = async () => {
        const formData = new FormData();
        formData.append("amount", classDetails.course_fee)
        formData.append("course_id", classId)
        formData.append("payment_type", "payhere")

        const res: any = await bankPay(formData);
        console.log(res)
        console.log(res.data)
        if (res && res.data)
            setOrderInfo(res.data);
        else
            alert('Something went wrong! Please contact site admins')
    }

    const paymentStatusUp = () => {
        setPaymentRe(true);
        setTimeout(() => {
            setPaymentRe(false);
        }, 500);
    }

    const dismissed = () => {
        setOrderInfo(null);
    }

    const formik2 = useFormik<any>({
        initialValues: { image: "" },
        validationSchema: profileDetailsSchema,
        onSubmit: async (values) => {
            setLoading(true)
            setStateErr(null);
            setStateSuccess(null);

            const formData = new FormData();
            formData.append("course_id", classId + "")
            formData.append("course_module_id", course_module_id + "")
            formData.append("question_title", question_title)
            formData.append("question_description", question_description)
            formData.append("question_pdf", question_pdf)

            const res: any = await homeworkUp(formData);
            if (res && res.statusCode && res.statusCode === 200) {
                setStateSuccess2("Homework successfully uploaded. Please wait for teachers feedback.");
                formik2.resetForm();
                setquestion_description("");
                setquestion_pdf(null);
                setcourse_module_id("");
                setquestion_title("");
            } else if (res && res.statusCode && res.statusCode === 400) {
                setStateErr2(res.message);
                setquestion_description("");
                setquestion_pdf(null);
                setcourse_module_id("");
                setquestion_title("");
            } else {
                setquestion_description("");
                setquestion_pdf(null);
                setcourse_module_id("");
                setquestion_title("");
                setStateErr2("Something went wrong.");
            }

            setLoading(false)
            setTimeout(() => {
                setLoading2(false)
            }, 2500);

            setTimeout(() => {
                setStateErr2(null);
                setStateSuccess2(null);
                setquestion_description("");
                setquestion_pdf(null);
                setcourse_module_id("");
                setquestion_title("");
            }, 25000);
        },
    })

    const formik = useFormik<any>({
        initialValues: { image: "" },
        validationSchema: profileDetailsSchema,
        onSubmit: async (values) => {
            setLoading(true)
            setStateErr(null);
            setStateSuccess(null);

            const formData = new FormData();
            formData.append("payment_type", "bank")
            formData.append("amount", classDetails.course_fee)
            formData.append("course_id", classId)
            formData.append("bank_name", "")
            formData.append("branch_name", "")
            formData.append("slip", fieldValue)

            const res: any = await bankPay(formData);
            if (res && res.statusCode && res.statusCode === 200) {
                setStateSuccess("Payment receipt successfully uploaded. Please wait for admin approval. You'll get a confirmation message after approval. If you haven't received an sms within 30-45 mins please send a message via chat box.");
                setFieldValue(null);
            } else if (res && res.statusCode && res.statusCode === 400) {
                setFieldValue(null);
                setStateErr(res.message);
            } else {
                setFieldValue(null);
                setStateErr("Something went wrong.\nYou may have already uploaded a payment slip. If yes, please await for approval");
            }

            setLoading(false)
            setTimeout(() => {
                setLoading(false)
            }, 2500);

            setTimeout(() => {
                setStateErr(null);
                setStateSuccess(null);
                setFieldValue(null);
            }, 25000);
        },
    })

    const handleStartClick = async (videoUrl: string, videoId: number) => {
    try {
        setBtnName('LOADING...')
      const viewCountData = {
              "main_id": classId,
              "lesson_type": "class",
              "video_id": videoId
          }
  
      const res = await createBuyLessonViewData(viewCountData);
  console.log('RESSSS',res)
      const data = res.data;
  
      if (data.allowed) {
        setCurrentVideo(videoUrl);
      } else {
        setRecordStateErr('🚫 You have already watched this video 2 times. Please contact support.');
        setBtnName('START')
      }
    } catch (error) {
      console.error('Error starting video:', error);
      setRecordStateErr('⚠️ Something went wrong. Please try again later.');
      setBtnName('START')

    }
  };

    return (
        <>
            {!loading2 && (<ClassHeader classInfo={classDetails} classesAl={classesAl} isFreeClass={isFreeClass} />)}
            {((isPaymentSuccess) || (!isPaymentSuccess && isWithingMonth)) && !loading2 && !isFreeClass ? (
                <>
                    <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                        <div className='card-header'>
                            <div className='card-title m-0'>
                                <h3 className='fw-bolder m-0'>Class Information</h3>
                            </div>
                        </div>
                        {courseClasses && courseClasses.length > 0 ? (
                            <>
                                <div className='card-body p-9'>
                                    {/* <div className='notice bg-light-info rounded border-info border border-dashed p-6 mb-8 row'> */}
                                    <div className='row mb-7'>
                                        <label className='col-lg-4 fw-bolder text-dark'>Title</label>

                                        <div className='col-lg-8'>
                                            <span className='fw-bolder fs-6 text-dark'>{courseClasses[0].title}</span>
                                        </div>
                                    </div>

                                    <div className='row mb-7'>
                                        <label className='col-lg-4 fw-bolder text-dark'>Class Starting Date</label>

                                        <div className='col-lg-8'>
                                            <span className='fw-bolder fs-6 text-dark'>{courseClasses[0].start_date}</span>
                                        </div>
                                    </div>
                                    <div className='row mb-7'>
                                        <label className='col-lg-4 fw-bolder text-dark'>Class Starting Time</label>

                                        <div className='col-lg-8'>
                                            <span className='fw-bolder fs-6 text-dark'>{courseClasses[0].start_time}</span>
                                        </div>
                                    </div>
                                    <div className='row mb-7'>
                                        <label className='col-lg-4 fw-bolder text-dark'>Description</label>

                                        <div className='col-lg-8'>
                                            <span className='fw-bolder fs-6 text-dark'>{courseClasses[0].description}</span>
                                        </div>
                                    </div>
                                    
                                    {courseClasses[0].record_url ? (
                                        <>
                                        <div className='row mb-7'>
                                            <label className='col-lg-4 fw-bolder text-dark'>Recording Link</label>                                            
                                            <div className='col-lg-8'>
                                                <button 
                                                    className='btn btn-sm btn-success mx-2'
                                                    onClick={() => handleStartClick(courseClasses[0].record_url, courseClasses[0].id)}
                                                    >
                                                    {btnName ? btnName : 'START'}
                                                </button>
                                            </div>
                                        </div>
                                        {recordStateErr ? (
                                            <div className='alert alert-danger'>
                                                <div className='alert-text font-weight-bold'>{recordStateErr}</div>
                                             </div>
                                            ) : (
                                            <></>
                                        )}
                                        </>
                                    ) : (
                                        <div className='row mb-7'>
                                            <label className='col-lg-4 fw-bolder text-dark'>Zoom Link</label>
                                            <div className='col-lg-8'>
                                                <a href={courseClasses[0].zoom_link} target="_blank" className='btn btn-sm btn-success fs-5 fw-bolder' rel="noreferrer">
                                                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3 fs-5 fw-bolder' />
                                                    Click Here To Join Zoom Class Room
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* </div> */}
                                    {/* Recoding Video player */}
                                    {currentVideo && (
                                        <div className="row d-flex flex-column align-items-center text-center my-5 py-5 mx-5" style={{ width: "100%" }}>
                                            <div className="col-md-8 col-sm-12" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div style={{
                                                position: "relative",
                                                width: "100%",
                                                maxWidth: "100%", // Limit maximum width
                                                paddingTop: "56.25%", // Maintain 16:9 aspect ratio
                                                margin: "0 auto", // Center horizontally
                                                borderRadius: "10px", // Optional: Add rounded corners to match card style
                                                overflow: "hidden" // Optional: Prevent overflow
                                            }}>
                                                <div className='mx-auto'
                                                style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    width: "70%",
                                                    height: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    transform: "translate(-50%, -50%)",
                                                    textAlign: "center",
                                                }}
                                                >
                                                {/* <VideoPlayer videoId={currentVideo} phone={auth.phone} /> */}
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        )}
                                </div>

                            </>
                        ) : (<div className='card-body p-9'><h4 className='text-gray-800 fw-bolder'>No classes available!</h4></div>)}

                    </div>
                    <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                        <div className='card-header'>
                            <div className='card-title m-0'>
                                <h3 className='fw-bolder m-0'>Class Material(s)</h3>
                            </div>
                        </div>
                        {courseMaterial && courseMaterial.length > 0 ? (
                            <div className='card-body p-9' >
                                {courseMaterial.map((material: any) => (
                                    <div className='row mb-7' key={JSON.stringify(material)}>
                                        <div className='col-lg-6'>
                                            <label className='col-lg-12 fw-bolder text-dark'>{material.title_en}</label>
                                            <p>{material.description_en}</p>
                                        </div>
                                        <div className='col-lg-6'>
                                            <div className='col-lg-12'>
                                                <a className='btn btn-sm btn-success fs-5 fw-bolder' target="_blank" onClick={() => {
                                                    validateAuth(material.url);
                                                }} download rel="noreferrer">
                                                    <KTSVG path='/media/icons/duotune/arrows/arr044.svg' className='svg-icon-3 fs-5 fw-bolder' /> Download File
                                                </a>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='card-body p-9'>
                                <h4>Materials not available</h4></div>
                        )}
                    </div>

                    <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                        <div className='card-header'>
                            <div className='card-title m-0'>
                                <h3 className='fw-bolder m-0'>Online Exam(s)</h3>
                            </div>
                        </div>
                        {courseExams && courseExams.length > 0 ? (
                            <div className='card-body p-9' >
                                {courseExams.map((exam: any) => (
                                    <div className='row mb-7' key={JSON.stringify(exam)}>
                                        <div className='col-lg-6'>
                                            <label className='col-lg-12 fw-bolder text-dark'>{exam.title_en}</label>
                                            <p>{exam.description_en}</p>
                                        </div>
                                        <div className='col-lg-6'>
                                            <div className='col-lg-12'>
                                                <a className='btn btn-sm btn-success fs-5 fw-bolder' target="_blank" onClick={() => {
                                                    validateAuth(exam.url);
                                                }} download rel="noreferrer"> Go to Exam
                                                </a>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='card-body p-9'>
                                <h4>Exams not available</h4></div>
                        )}
                    </div>

                    <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                        <div className='card-header'>
                            <div className='card-title m-0'>
                                <h3 className='fw-bolder m-0'>Repeat class</h3>
                            </div>
                        </div>
                        {courseRep && courseRep.length > 0 ? (
                            <div className='card-body p-9' >
                                {courseRep.map((rep: any) => (
                                    <div className='row mb-7' key={JSON.stringify(rep)}>
                                        <div className='col-lg-6'>
                                            <label className='col-lg-12 fw-bolder text-dark'>{rep.title_en}</label>
                                            <p>{rep.description_en}</p>
                                        </div>
                                        <div className='col-lg-6'>
                                            <div className='col-lg-12'>
                                                <a className='btn btn-sm btn-success fs-5 fw-bolder' target="_blank" onClick={() => {
                                                    validateAuth(rep.url);
                                                }} download rel="noreferrer"> Go to Repeat Session
                                                </a>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='card-body p-9'>
                                <h4>Repeat classes not available</h4></div>
                        )}
                    </div>

                    <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                        <div className='card-header'>
                            <div className='card-title m-0'>
                                <h3 className='fw-bolder m-0'>Recording(s)</h3>
                            </div>
                        </div>
                        {courseRec && courseRec.length > 0 ? (
                            <div className='card-body p-9' >
                                {courseRec.map((rec: any) => (
                                    <div className='row mb-7' key={JSON.stringify(rec)}>
                                        <div className='col-lg-6'>
                                            <label className='col-lg-12 fw-bolder text-dark'>{rec.title_en}</label>
                                            <p>{rec.description_en}</p>
                                        </div>
                                        <div className='col-lg-6'>
                                            <div className='col-lg-12'>
                                                <a className='btn btn-sm btn-success fs-5 fw-bolder' target="_blank" onClick={() => {
                                                    validateAuth(rec.url);
                                                }} download rel="noreferrer"> Go to Recording
                                                </a>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='card-body p-9'>
                                <h4>Recordings not available</h4></div>
                        )}
                    </div>
                </>
            ) : (<></>)}

            {!isPaymentSuccess && !loading2 && !isFreeClass ? (
                <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                    <div className='card-header cursor-pointer'>
                        <div className='card-title m-0'>
                            <h3 className='fw-bolder m-0'>Class Payment</h3>
                        </div>
                    </div>

                    <div className='card-body p-9'>
                        {stateSuccess ? (
                            <div className='alert alert-success'>
                                <div className='alert-text font-weight-bold'>{stateSuccess}</div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {stateErr ? (
                            <div className='alert alert-danger'>
                                <div className='alert-text font-weight-bold'>{stateErr}</div>
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6 mb-8'>
                            <KTSVG
                                path='icons/duotune/general/gen044.svg'
                                className='svg-icon-2tx svg-icon-warning me-4'
                            />
                            <div className='d-flex flex-stack flex-grow-1'>
                                <div className='fw-bold'>
                                    <h4 className='text-gray-800 fw-bolder'>Proceed With Bank Payment</h4>
                                    <div className='fs-6 text-gray-600'>
                                        Please use only following bank accounts to deposit class payment of Rs. {classDetails.course_fee}.
                                    </div>
                                    <img
                                        src={toAbsoluteUrl('/media/static/bank.jpg')}
                                        className='align-self-center mt-10'
                                        style={{ width: '50%' }}
                                        alt=''
                                    />
                                    <form onSubmit={formik.handleSubmit} noValidate className='form'>
                                        <div className='card-body p-9'>
                                            <div className='row'>
                                                <label className='col-lg-3 col-form-label fw-bold fs-6'>Select Payment Slip</label>
                                                <div className='col-lg-5'>
                                                    <input
                                                        type='file'
                                                        className='form-control form-control-lg form-control-solid mb-lg-0'
                                                        placeholder='Payment Slip'
                                                        accept="image/png, image/jpeg, image/jpg, image/PNG"
                                                        onChange={(e: any) => setFieldValue(e.target.files[0])}
                                                    />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <button type='submit' className='btn btn-primary' disabled={loading || !fieldValue}>
                                                        {!loading && 'Upload Slip'}
                                                        {loading && (
                                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                                Please wait...{' '}
                                                                <span className='spinner-border spinner-border-sm align-middle'></span>
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6 mb-8'>
                            <KTSVG
                                path='icons/duotune/general/gen044.svg'
                                className='svg-icon-2tx svg-icon-warning me-4'
                            />
                            <div className='d-flex flex-stack flex-grow-1'>
                                <div className='fw-bold'>
                                    <h4 className='text-gray-800 fw-bolder'>Proceed with Payhere Online Credit/Debit Card Payment</h4>
                                    <div className='fs-6 text-gray-600'>
                                        {orderInfo && orderInfo.classPayment && orderInfo.classPayment.id ? (
                                            <PaymentModal
                                                orderId={orderInfo.classPayment.id}
                                                name={'Payment for: ' + classDetails.name_en}
                                                amount={classDetails.course_fee}
                                                first_name={auth.fname}
                                                last_name={auth.lname}
                                                email={auth.email}
                                                phone={auth.phone}
                                                address={auth.address}
                                                city={auth.district}
                                                hash={orderInfo.classPayment.hash}
                                                dismissed={dismissed}
                                                paymentStatusUp={paymentStatusUp}
                                                payType="class"
                                            />
                                        ) : (
                                            <>
                                                Pay with {' '}
                                                <button className='btn btn-primary' onClick={getOrderInfo} style={{ cursor: 'pointer' }}>
                                                    <img
                                                        src='https://www.payhere.lk/downloads/images/payhere_long_banner.png'
                                                        alt='PayHere'
                                                        width='400'
                                                    />
                                                </button>
                                            </>
                                        )}
                                        {/* මෙම සේවාව තාවකාලිකව නවතා ඇත */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}

            <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                <div className='card-header cursor-pointer'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Homework Submission</h3>
                    </div>
                </div>

                <div className='card-body p-9'>
                    {stateSuccess2 ? (
                        <div className='alert alert-success'>
                            <div className='alert-text font-weight-bold'>{stateSuccess2}</div>
                        </div>
                    ) : (
                        <></>
                    )}

                    {stateErr2 ? (
                        <div className='alert alert-danger'>
                            <div className='alert-text font-weight-bold'>{stateErr2}</div>
                        </div>
                    ) : (
                        <></>
                    )}

                    <div className='notice d-flex p-6 mb-8'>
                        <KTSVG
                            path='icons/duotune/general/gen044.svg'
                            className='svg-icon-2tx svg-icon-warning me-4'
                        />
                        <div className='d-flex flex-stack flex-grow-1'>
                            <div className='fw-bold'>
                                <form onSubmit={formik2.handleSubmit} noValidate className='form'>
                                    <div className='card-body p-9'>
                                        <div className='row'>
                                            <div className='col-lg-12 row mb-2'>
                                                <label className='col-lg-3 col-form-label fw-bold fs-6'>Select Module</label>
                                                <div className='col-lg-5'>
                                                    <select
                                                        className='form-select form-select-solid form-select-lg'
                                                        onChange={(e: any) => {setcourse_module_id(e.target.value); console.log(e.target.value)}}
                                                        value={course_module_id}
                                                    >
                                                        <option value=''>Select module</option>
                                                        {moduleList.map((module: any) => {
                                                            return (
                                                                <option value={module.id}>{module.name_en}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-lg-12 row mb-2'>
                                                <label className='col-lg-3 col-form-label fw-bold fs-6'>Homework Title</label>
                                                <div className='col-lg-5'>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-lg-0'
                                                        placeholder='Title'
                                                        accept="image/png, image/jpeg, image/jpg, image/PNG"
                                                        value={question_title}
                                                        onChange={(e: any) => setquestion_title(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-12 row mb-2'>
                                                <label className='col-lg-3 col-form-label fw-bold fs-6'>Homework Description</label>
                                                <div className='col-lg-5'>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-lg-0'
                                                        placeholder='Description'
                                                        accept="image/png, image/jpeg, image/jpg, image/PNG"
                                                        value={question_description}
                                                        onChange={(e: any) => setquestion_description(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-12 row mb-2'>
                                                <label className='col-lg-3 col-form-label fw-bold fs-6'>Select Payment Slip</label>
                                                <div className='col-lg-5'>
                                                    <input
                                                        type='file'
                                                        className='form-control form-control-lg form-control-solid mb-lg-0'
                                                        placeholder='Payment Slip'
                                                        onChange={(e: any) => setquestion_pdf(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-12'>
                                                <div className='col-lg-4'>
                                                    <button type='submit' className='btn btn-primary' disabled={loading || !question_pdf || !question_title || !course_module_id}>
                                                        {!loading && 'Upload Homework'}
                                                        {loading && (
                                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                                Please wait...{' '}
                                                                <span className='spinner-border spinner-border-sm align-middle'></span>
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isPaymentSuccess && !loading2 && isFreeClass ? (
                <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                    <div className='card-header cursor-pointer'>
                        <div className='card-title m-0'>
                            <h3 className='fw-bolder m-0'>Free Class Information</h3>
                        </div>
                    </div>

                    <div className='card-body p-9'>
                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bolder text-dark'>Details</label>

                            <div className='col-lg-8'>
                                <span className='fw-bolder fs-6 text-dark'>{classDetails.description_2_sn}</span>
                            </div>
                        </div>
                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bolder text-dark'>Zoom Link</label>

                            <div className='col-lg-8'>
                                <a href={classDetails.description_1_sn} target="_blank" className='btn btn-sm btn-success fs-5 fw-bolder' rel="noreferrer">
                                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3 fs-5 fw-bolder' />
                                    Click Here To Join Zoom Class Room
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}

        </>
    )
}
function getUserByToken(token: any): any {
    throw new Error('Function not implemented.')
}

