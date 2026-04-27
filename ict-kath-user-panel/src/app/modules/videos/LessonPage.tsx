/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getAuth, useAuth } from '../auth'
import { authTokenValidate, buyVideo, getBankPendingVideos, getBuyLessonData, getSellVideoDetails } from './users-list/core/_requests'
import * as Yup from 'yup'
import moment from 'moment'
import PaymentModal from '../../PaymentModal/PaymentModal'
import { LessonsHeader } from './LessonsHeader'
import { LessonHeader } from './LessonHeader'
import { TuteHeader } from './TuteHeader'
import VideoPaymentModal from '../../PaymentModal/VideoPaymentModal'
import { useFormik } from 'formik'

const profileDetailsSchema = Yup.object().shape({
    // image: Yup.string().required('Image is required'),
})

export function LessonPage() {
    const location = useLocation();
    console.log('Enter', location.pathname);
    

    const [auth, setAuth] = useState<any | undefined>(getAuth())
    const { logout } = useAuth()
    const [videoDetails, setVideoDetails] = useState<any>('');
    const [loading2, setLoading2] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const [lessonId] = useState<any>(searchParams.get("lessonid"));
    const [paymentRe, setPaymentRe] = useState<boolean>(false)
    const [type, setType] = useState<any>('')
    const [data, setData] = useState<any>({ image: "" })
     const [loading, setLoading] = useState(true)
    const [fieldValue, setFieldValue] = useState<any>(null)
    const [stateSuccess, setStateSuccess] = useState<any>(null)
    const [stateSuccess2, setStateSuccess2] = useState<any>(null)
    const [stateErr, setStateErr] = useState<any>(null)
    const [stateErr2, setStateErr2] = useState<any>(null)
    const [orderInfo, setOrderInfo] = useState<any>(null)
    const [buyInfo, setBuyInfo] = useState<any>(null)
    const [pendingBankPayments, setPendingBankPayments] = useState<any>([])

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
        const url = location.pathname;
        const parts = url.split('/');
        console.log('parts',parts, auth.token)

        parts.find((part) => {
            if(part === "individual-lessons"){
        console.log('individual',part)

                setType('individual')
            }else if(part === 'package-lessons'){
                setType('package')
            }else if(part === 'tutes-lessons'){
                setType('tutes')
            }
        })
        
    },[location.pathname])

    useEffect(() => {
        const fetchData  = async () => {
            if (!type || !lessonId) return;
            setLoading(true)
            try{
                const videoInfo = await getSellVideoDetails(lessonId);
                if (videoInfo?.data?.type === type) {
                    setVideoDetails(videoInfo.data);
                }
           
                const buyInfo = await getBuyLessonData(lessonId);
                setBuyInfo(buyInfo?.data || null);

                const pendingBankPayment = await getBankPendingVideos({
                      "video_id": lessonId,
                      "status": "pending",
                      "payment_status": "pending",
                      "payment_type": "bank",
                      "limit": 100,
                      "skip": 0,
                      "sort": "DESC",
                    });
                    console.log('pendingBankPayment',pendingBankPayment)
                    setPendingBankPayments(pendingBankPayment.results ? pendingBankPayment.results : []);
           
            } catch (error) {
                console.error('Error fetching video details:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [type,lessonId, paymentRe])

    

    const getOrderInfo = async () => {
        if (!videoDetails) return;
      
        const submitData = {
            "payment_type": 'payhere',
            "days": videoDetails.days,
            "video_id": lessonId,
            "discount_price": videoDetails.discounted_price || 0,
            "price": videoDetails.price || 0
        }
        const res: any = await buyVideo(submitData);
        console.log(res)
        console.log(res.data)
        if (res && res.data){
            setOrderInfo(res.data.videoBuy);
        }else{
            alert('Something went wrong! Please contact site admins')

        }
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



    const formik = useFormik<any>({
        initialValues: { image: "" },
        validationSchema: profileDetailsSchema,
        onSubmit: async (values) => {
            setLoading(true)
            setStateErr(null);
            setStateSuccess(null);

            const formData = new FormData();
            formData.append("payment_type", "bank")
            formData.append("discount_price", videoDetails.discounted_price)
            formData.append("price", videoDetails.price)
            formData.append("days", videoDetails.days)
            formData.append("video_id", lessonId)
            formData.append("bank_name", "")
            formData.append("branch_name", "")
            formData.append("slip", fieldValue)

            const res: any = await buyVideo(formData);
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

    return (
        <>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {!loading && videoDetails && type ? (
                        type === 'individual' ? (
                            <>
                                {<LessonHeader videoInfo={videoDetails} buyInfo={buyInfo} phone={auth?.phone} />}
                            </>
                        ) : (type === 'package') ? (
                            <>
                                {<LessonsHeader videoInfo={videoDetails} buyInfo={buyInfo} phone={auth?.phone}/>}
                            </>
                        ) : (type === 'tutes') ? (
                            <>
                                {<TuteHeader videoInfo={videoDetails} buyInfo={buyInfo}/>}
                            </>
                        ) : (
                            <></>
                        )
                    ) : null}
                    {!buyInfo || (buyInfo && buyInfo.payment_status !== 'approved') ? (
                        <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
                            <div className='card-header cursor-pointer'>
                                <div className='card-title m-0'>
                                    <h3 className='fw-bolder m-0'>Lesson Payment</h3>
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
                                                Please use only following bank accounts to deposit lesson payment of Rs. {videoDetails.discounted_price ? videoDetails.discounted_price : videoDetails.price}.
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
                                {pendingBankPayments.length > 0 && (
                                    <div className='alert alert-danger'>
                                        <div className='alert-text font-weight-bold'>
                                            You cannot proceed with online payment while a bank payment is pending.
                                        </div>
                                    </div>
                                )}
                                <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6 mb-8'>
                                    <KTSVG
                                        path='icons/duotune/general/gen044.svg'
                                        className='svg-icon-2tx svg-icon-warning me-4'
                                    />
                                    <div className='d-flex flex-stack flex-grow-1'>
                                        <div className='fw-bold'>
                                            <h4 className='text-gray-800 fw-bolder text-wrap'>Proceed with Payhere Online Credit/Debit Card Payment</h4>
                                            <div className='fs-6 text-gray-600'>
                                                {orderInfo && orderInfo.id ? (
                                                <VideoPaymentModal
                                                    orderId={orderInfo.id}
                                                    name={`Payment for: ${orderInfo.videoSell.name}`}
                                                    amount={orderInfo.total_price}
                                                    first_name={auth.fname}
                                                    last_name={auth.lname}
                                                    email={auth.email}
                                                    phone={auth.phone}
                                                    address={auth.address}
                                                    city={auth.district}
                                                    hash={orderInfo.hash}
                                                    dismissed={dismissed}
                                                    paymentStatusUp={paymentStatusUp}
                                                    payType="lesson"
                                                />
                                                ) : (
                                                <>
                                                Pay with {' '}
                                                {pendingBankPayments.length > 0 ? (
                                                    <button className='btn btn-primary d-flex justify-content-center align-items-center p-2' style={{ cursor: 'pointer', width: '100%', maxWidth: '300px' }} disabled={pendingBankPayments.length > 0}>
                                                        <img className='img-fluid'
                                                            src='https://www.payhere.lk/downloads/images/payhere_long_banner.png'
                                                            alt='PayHere'
                                                        />
                                                    </button>
                                                ) : (
                                                    <button className='btn btn-primary d-flex justify-content-center align-items-center p-2' onClick={getOrderInfo} style={{ cursor: 'pointer', width: '100%', maxWidth: '300px' }} >
                                                        <img className='img-fluid'
                                                            src='https://www.payhere.lk/downloads/images/payhere_long_banner.png'
                                                            alt='PayHere'
                                                        />
                                                    </button>
                                                )}
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
                        <>
                            {/* <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                <h5 className="text-muted">No Lessons found</h5>
                            </div> */}
                        </>
                    )}
                </>
            )}
        </>
    )
}


