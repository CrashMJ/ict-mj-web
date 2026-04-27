/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { getUserByToken, login, requestOtp } from '../core/_requests'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { UAParser } from 'ua-parser-js'

const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .min(10, 'Minimum 10 symbols')
    .max(10, 'Maximum 10 symbols')
    .required('Phone is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  phone: '',
  password: '',
}



/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

const generateUUID = (): string => crypto.randomUUID();



export function Login() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  let navigate = useNavigate();
  const [msg, setMsg] = useState<any>(null)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [searchParams, setSearchParams] = useSearchParams();
  searchParams.get("redirect")


  // ✅ Preload FingerprintJS once when component mounts
  useEffect(() => {
    const loadDeviceInfo = async () => {
      let storedId = localStorage.getItem('deviceUUId')
      if (!storedId) {
        storedId = crypto.randomUUID()
        localStorage.setItem('deviceUUId', storedId)
      }

      try {
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        const parser = new UAParser()
        const ua = parser.getResult()

        setDeviceInfo({
          deviceUUId: storedId,
          deviceId: result.visitorId,
          browser: ua.browser.name,
          os: ua.os.name,
          deviceType: ua.device.type || 'desktop',
        })
      } catch (err) {
        console.warn('Fingerprint initialization failed:', err)
        setDeviceInfo({
          deviceUUId: storedId,
          deviceId: 'fallback',
          browser: 'unknown',
          os: 'unknown',
          deviceType: 'desktop',
        })
      }
    }
    loadDeviceInfo()
  }, [])

  useEffect(() => {
    async function init() {
      if (searchParams.get("redirect") !== null) {
        try {
          const userD = atob(searchParams.get("redirect") || '')
          if (userD) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const userObj = JSON.parse(userD)
            saveAuth(userObj)
            const { data: user } = await getUserByToken(userObj.token)
            setCurrentUser(user)
          }
        } catch (error) {
          console.log(error);
        }

      }
    }
    init();
  }, [searchParams.get("redirect")])


  useEffect(() => {
    async function init() {
      if (searchParams.get("msg") !== null) {
        try {
          const userD = searchParams.get("msg")
          if (userD) {
            setMsg(userD);
          }else{
            setMsg(null);
          }

        } catch (error) {
          console.log(error);
          setMsg(null);
        }

      }
    }
    
    init();
  }, [searchParams.get("msg")])

  // async function getDeviceInfo() {
  //   let storedId = localStorage.getItem("deviceUUId");
  //   if (!storedId) {
  //     storedId = crypto.randomUUID();
  //     localStorage.setItem("deviceUUId", storedId);
  //   }

  //   try {
  //     const fp = await FingerprintJS.load();
  //     const result = await fp.get();
  //     const parser = new UAParser();
  //     const uaResult = parser.getResult();
  //     return {
  //         deviceUUId: storedId,
  //         deviceId: result.visitorId,
  //         browser: uaResult.browser.name,
  //         os: uaResult.os.name,
  //         deviceType: uaResult.device.type || "desktop",
  //       };
  //   } catch (err) {
  //         console.warn("Device info fallback due to error:", err);

  //         // Always return defaults if something goes wrong
  //         return {
  //           deviceUUId: storedId,
  //           deviceId: storedId,
  //           browser: "unknown",
  //           os: "unknown",
  //           deviceType: "desktop",
  //         };
  //     }
  //   }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (!deviceInfo) {
        setStatus('Device info not ready. Please wait a few seconds.')
        return
      }
      setLoading(true)
      try {
        // const deviceInfo = await getDeviceInfo();
        // let auth: any;
        // if(deviceInfo){
        //   auth = await login(values.phone, values.password, deviceInfo)
        // }else{
        //   window.location.reload()
        //   return
        // }

        const auth: any = await login(values.phone, values.password, deviceInfo)
        
        if (auth?.data?.data?.user) {
          if (auth.data.data.user.is_phone_verified) {
            saveAuth(auth.data.data.user)
            const { data: user } = await getUserByToken(auth.data.data.user.token)
            setCurrentUser(user)
          } else {
            requestOtp(auth.data.data.user.id, auth.data.data.user.phone);
            // saveAuth(auth.data.data.user)
            // window.open("/auth/validate-otp");
            navigate(`/auth/validate-otp?token=${btoa(JSON.stringify(auth.data.data.user))}`);
          }
        }else if(auth.data.statusCode === 403) {
          console.log('AUTH2', auth)
          setStatus(auth.data.message || "Access forbidden")
          setSubmitting(false)
          setLoading(false)
        }else{
          // console.error('error', error)
          saveAuth(undefined)
          setStatus('The login detail is incorrect')
          setSubmitting(false)
          setLoading(false)
        }
      }catch (error: any) {
        console.error("Login error", error);

        if (error.response) {
          // Server responded with non-2xx status
          setStatus(error.response.data?.message || "Login failed. Please try again.");
        } else if (error.request) {
          // No response from server
          setStatus("No response from server. Check your internet connection.");
        } else {
          // Something else went wrong
          setStatus("An unexpected error occurred.");
        }
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
}
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Student Portal Login</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          New Here?{' '}
          <Link to='/auth/registration' className='link-primary fw-bolder'>
            Create an Account
          </Link>
        </div>
      </div>
      {/* begin::Heading */}

      {msg ? (
        <div className='mb-lg-15 alert alert-success'>
          <div className='alert-text font-weight-bold'>{msg}</div>
        </div>
      ) : (
        <></>
      )}

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <></>
      )}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>Phone number</label>
        <input
          placeholder='Phone number'
          {...formik.getFieldProps('phone')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.phone && formik.errors.phone },
            {
              'is-valid': formik.touched.phone && !formik.errors.phone,
            }
          )}
          type='phone'
          name='phone'
          autoComplete='off'
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.phone}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            {/* begin::Label */}
            <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
            {/* end::Label */}
            {/* begin::Link */}
            <Link
              to='/auth/forgot-password'
              className='link-primary fs-6 fw-bolder'
              style={{ marginLeft: '5px' }}
            >
              Forgot Password ?
            </Link>
            {/* end::Link */}
          </div>
        </div>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Action */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  )
}
