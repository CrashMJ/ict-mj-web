import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useSearchParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { getUserByToken, requestOtp, requestPassword, validateOtp } from '../core/_requests'
import { useAuth } from '../core/Auth'

const initialValues = {
  otp: '',
}

const forgotPasswordSchema = Yup.object().shape({
  otp: Yup.string().required('OTP number is required').min(6, 'Minimum 6 symbols').max(6, 'Maximum 6 symbols'),
})

export function ValidateOTP() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [userData, setUser] = useState<any>()
  const [searchParams, setSearchParams] = useSearchParams();
  searchParams.get("token")
  const { saveAuth, setCurrentUser } = useAuth()
  const [counter, setCounter] = React.useState(60);

  useEffect(() => {
    const timer: any = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter])

   useEffect(() => {
    document.body.classList.remove('modal-open')
    document.body.style.overflow = 'auto'

    const backdrops = document.querySelectorAll('.modal-backdrop')
    backdrops.forEach((el) => el.remove())
  }, [])

  useEffect(() => {
    async function init() {
      if (searchParams.get("token") !== null) {
        try {
          const userD = atob(searchParams.get("token") || '')
          if (userD) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const userObj = JSON.parse(userD)
            setUser(userObj)
          }
        } catch (error) {
          console.log(error);
        }

      }
    }
    init();
  }, [searchParams.get("token")])

  const resendOTP = () => {
    if (userData && userData.id) {
      setCounter(60);
      requestOtp(userData.id, userData.phone);
    }
  }


  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setHasErrors(undefined)
      if (userData && userData.id) {
        const stateReturn = await validateOtp(values.otp, userData.phone);
        if (stateReturn && stateReturn.data && stateReturn.statusCode && stateReturn.statusCode === 200) {

          if (userData.token) {
            saveAuth(userData)
            const { data: user } = await getUserByToken(userData.token);
            setCurrentUser(user)
          } else if (stateReturn.data && stateReturn.data.user) {
            saveAuth(stateReturn.data.user)
            const { data: user } = await getUserByToken(stateReturn.data.user.token);
            setCurrentUser(user)
          }

          setHasErrors(false)
          setLoading(false)
        } else if (stateReturn && stateReturn.errors && stateReturn.errors.Error) {
          setHasErrors(true)
          setLoading(false)
          setSubmitting(false)
          setStatus(stateReturn.errors.Error)
        } else {
          setHasErrors(true)
          setLoading(false)
          setSubmitting(false)
          setStatus(stateReturn.data.data.Error ? stateReturn.data.data.Error : 'Something went wrong!')
        }
      } else {
        setHasErrors(true)
        setLoading(false)
        setSubmitting(false)
        setStatus('Something went wrong!')
      }
    },
  })

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3'>Validate Phone Number</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-400 fw-bold fs-4'>Enter OTP code received to your phone number. Please await couple of minutes to arrive the OTP SMS. </div>
          {/* end::Link */}
        </div>

        {formik.status && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>{formik.status}</div>
          </div>
        )}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>OTP</label>
          <input
            type='number'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('otp')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              { 'is-invalid': formik.touched.otp && formik.errors.otp },
              {
                'is-valid': formik.touched.otp && !formik.errors.otp,
              }
            )}
          />
          {formik.touched.otp && formik.errors.otp && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.otp}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0 mb-5'>
          <button

            id='kt_password_reset_submit'
            className='btn btn-lg btn-light-primary fw-bolder'
            style={{ width: '100%' }}
            disabled={counter > 0}
            onClick={() => { resendOTP(); }}
          >
            {counter > 0 ? (<span className='indicator-label'>Resend OTP in {counter}</span>) : (<span className='indicator-label'>Resend OTP</span>)}

            {loading && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>

          <button
            type='submit'
            id='kt_password_reset_submit'
            className='btn btn-lg btn-primary fw-bolder me-4'
            disabled={formik.isSubmitting || !formik.isValid}

          >
            <span className='indicator-label'>Submit</span>
            {loading && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-lg btn-light-primary fw-bolder'
            >
              Cancel
            </button>
          </Link>{' '}
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}
