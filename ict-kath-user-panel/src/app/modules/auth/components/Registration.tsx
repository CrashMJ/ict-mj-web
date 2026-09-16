/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {getUserByToken, login, register, requestOtp} from '../core/_requests'
import {Link, useNavigate} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import {useAuth} from '../core/Auth'
import moment from 'moment'

const extractDOBFromNIC = (nic: string): string | null => {
  let year: number
  let dayText: string

  if (/^\d{9}[Vv]$/.test(nic)) {
    year = parseInt('19' + nic.substring(0, 2))
    dayText = nic.substring(2, 5)
  } else if (/^\d{12}$/.test(nic)) {
    year = parseInt(nic.substring(0, 4))
    dayText = nic.substring(4, 7)
  } else {
    return null
  }

  let dayOfYear = parseInt(dayText)
  if (dayOfYear > 500) dayOfYear -= 500
  if (dayOfYear < 1 || dayOfYear > 366) return null

  // 🟩 Handle leap year adjustment
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  console.log('isLeapYear', isLeapYear)

  // const monthDays = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  // console.log('monthDays',monthDays)

  // let month = 0
  // while (month < 12 && dayOfYear > monthDays[month]) {
  //   dayOfYear -= monthDays[month]
  // console.log('dayOfYear 3',dayOfYear)

  //   month++
  // }
  // console.log('month',month)

  // if (month >= 12) return null

  // const mm = String(month + 1).padStart(2, '0')
  // const dd = String(Number(mm) > 2 ? isLeapYear ? dayOfYear : dayOfYear - 1 : dayOfYear).padStart(2, '0')
  let date
  if (isLeapYear) {
    if (/^\d{9}[Vv]$/.test(nic)) {
      date = new Date(year, 0, dayOfYear)
      console.log('Leap year 9v date', date)
    } else {
      date = new Date(year, 0, dayOfYear)
      console.log('Leap year 12 date', date)
    }
  } else {
    if (dayOfYear <= 59) {
      if (/^\d{9}[Vv]$/.test(nic)) {
        date = new Date(year, 0, dayOfYear)
        console.log('Non Leap year <59 and 9v date', date)
      } else {
        date = new Date(year, 0, dayOfYear)
        console.log('Non Leap year < 59 and 12 date', date)
      }
    } else {
      if (/^\d{9}[Vv]$/.test(nic)) {
        date = new Date(year, 0, dayOfYear - 1)
        console.log('Non Leap year > 59 and 9v date', date)
      } else {
        date = new Date(year, 0, dayOfYear - 1)
        console.log('Non Leap year > 59 and 12 date', date)
      }
    }
  }

  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  console.log('Date', `${year}-${mm}-${dd}`)
  return `${year}-${mm}-${dd}`
}

// const extractDOBFromNIC = (nic: string): Date | null => {
//   let year: number, dayText: string;

//   if (/^\d{9}[Vv]$/.test(nic)) {
//     console.log('Enter 9v--------', nic)
//     year = parseInt('19' + nic.substring(0, 2));
//     dayText = nic.substring(2, 5);
//     console.log('Enter 9v year--------', year)
//     console.log('Enter 9v dayText--------', dayText)
//   } else if (/^\d{12}$/.test(nic)) {
//     console.log('Enter 12--------', nic)
//     year = parseInt(nic.substring(0, 4));
//     dayText = nic.substring(4, 7);
//     console.log('Enter 12 year--------', year)
//     console.log('Enter 12 dayText--------', dayText)

//   } else {
//     return null;
//   }

//   let dayOfYear = parseInt(dayText);
//     console.log('Enter dayOfYear--------', dayOfYear)

//   if (dayOfYear > 500) dayOfYear -= 500;

//   if (dayOfYear < 1 || dayOfYear > 366) return null;
//     console.log('Enter dayOfYear 2--------', dayOfYear)

//   const utcDate = new Date(Date.UTC(year, 0, dayOfYear));
//   console.log('=========utcDate================', utcDate)

//   const finalDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
//   console.log('=========FinalDate================', finalDate)
//   return finalDate
// }

const initialValues = {
  firstname: '',
  lastname: '',
  nic: '',
  phone: '',
  dob: '',
  email: '',
  password: '',
  changepassword: '',
  address: '',
  school: '',
  class_grade: '',
  class_type: '',
  location: '',
  account_type: 'student',
  district: '',
  nic_front: null,
  nic_back: null,
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First name is required'),
  nic: Yup.string().when('class_grade', {
    is: 'al',
    then: Yup.string()
      .required('NIC is required')
      .matches(/^(\d{12}|\d{9}[Vv])$/, 'NIC must be 12 digits or 9 digits followed by V or v'),
    otherwise: Yup.string().notRequired(),
  }),
  nic_front:  Yup.mixed().when('class_grade', {
    is: 'al',
    then: Yup.mixed().required('NIC Front image is required'),
    otherwise: Yup.mixed().notRequired(),
  }),
  nic_back: Yup.mixed().when('class_grade', {
    is: 'al',
    then: Yup.mixed().required('NIC Back image is required'),
    otherwise: Yup.mixed().notRequired(),
  }),
  phone: Yup.string().min(9, 'Minimum 10 symbols').required('Phone is required'),
  dob: Yup.string()
    .required('DOB is required')
    .test('match-nic', 'DOB does not match NIC', function (value) {
      const {nic, class_grade} = this.parent

      // 👉 Only check NIC match for AL
      if (class_grade !== 'al') return true

      if (!nic || !value) return true // skip if empty (let required handle it)

      const extractedDOB = extractDOBFromNIC(nic)
      if (!extractedDOB) return false

      const inputDOB = value.trim().slice(0, 10) // e.g., "2006-03-16"
      console.log('extractedDOB', extractedDOB)
      console.log('inputDOB', inputDOB)

      return inputDOB === extractedDOB
    }),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  account_type: Yup.string().required('Account type is required'),
  class_type: Yup.string().required('Clas type is required'),
  class_grade: Yup.string().required('Clas grade is required'),
  address: Yup.string().required('Address is required'),
  district: Yup.string().required('District is required'),
  school: Yup.string().required('School is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
  location: Yup.string().when('class_type', {
    is: 'physical',
    then: Yup.string().required('Location is required'),
  }),
})

const FIELD_LABELS: Record<string, string> = {
  firstname: 'First name',
  lastname: 'Last name',
  dob: 'Date of birth',
  phone: 'Phone number',
  class_grade: 'Class grade',
  nic: 'NIC',
  nic_front: 'NIC front image',
  nic_back: 'NIC back image',
  email: 'Email',
  school: 'School',
  address: 'Address',
  district: 'District',
  class_type: 'Class type',
  location: 'Location',
  password: 'Password',
  changepassword: 'Confirm password',
  acceptTerms: 'Accept terms',
}

const REQUIRED_FIELD_ORDER = [
  'firstname',
  'lastname',
  'dob',
  'phone',
  'class_grade',
  'nic',
  'nic_front',
  'nic_back',
  'email',
  'school',
  'address',
  'district',
  'class_type',
  'location',
  'password',
  'changepassword',
  'acceptTerms',
] as const

const isFieldApplicable = (field: string, values: typeof initialValues) => {
  if (['nic', 'nic_front', 'nic_back'].includes(field)) {
    return values.class_grade === 'al'
  }
  if (field === 'location') {
    return values.class_type === 'physical'
  }
  return true
}

const isFieldComplete = (
  field: string,
  values: typeof initialValues,
  errors: Record<string, any>
) => {
  if (field === 'acceptTerms') return Boolean(values.acceptTerms)
  const value = (values as any)[field]
  const hasValue = value instanceof File ? true : Boolean(value)
  return hasValue && !errors[field]
}

export function Registration() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()
  let navigate = useNavigate()
  const [showLocation, setShowLocation] = useState(false)
  const [nicFrontPreview, setNicFrontPreview] = useState<string | null>(null)
  const [nicBackPreview, setNicBackPreview] = useState<string | null>(null)
  const [checklistOpen, setChecklistOpen] = useState(true)

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    validateOnMount: true,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)

      const formData = new FormData()

      formData.append('email', values.email)
      formData.append('nic', values.nic)
      formData.append('dob', values.dob)
      formData.append('phone', '0' + values.phone)
      formData.append('school', values.school)
      formData.append('address', values.address)
      formData.append('district', values.district)
      formData.append('class_grade', values.class_grade)
      formData.append('class_type', values.class_type)
      formData.append('account_type', values.account_type)
      formData.append('fname', values.firstname)
      formData.append('lname', values.lastname)
      formData.append('password', values.password)
      formData.append('gender', '')
      formData.append('bio', '')
      formData.append('guardians_name', '')
      formData.append('guardians_phone', '')
      formData.append('location', values.location)

      // upload files
      if (values.nic_front) {
        formData.append('nic_front', values.nic_front)
      }

      if (values.nic_back) {
        formData.append('nic_back', values.nic_back)
      }

      try {
        const res:any = await register(formData)

        if (res && res.data && res.data.user) {
          // navigate(`/auth/login?msg=Student registration is a success! Please login.`);
          requestOtp(res.data.user.id, res.data.user.phone)
          navigate(`/auth/validate-otp?token=${btoa(JSON.stringify(res.data.user))}`)
        } else {
          if (res && res.statusCode === 400) {
            saveAuth(undefined)
            setStatus(res.message)
            setSubmitting(false)
            setLoading(false)
            return
          }
          saveAuth(undefined)
          setStatus('The registration details are incorrect')
          setSubmitting(false)
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  useEffect(() => {
    if (formik.values.class_type === 'physical') {
      setShowLocation(true)
    } else {
      setShowLocation(false)
    }
  }, [formik.values.class_type])

  const checklistItems = REQUIRED_FIELD_ORDER.filter((field) =>
    isFieldApplicable(field, formik.values)
  ).map((field) => ({
    field,
    label: FIELD_LABELS[field],
    done: isFieldComplete(field, formik.values, formik.errors),
    error: formik.errors[field as keyof typeof formik.errors],
  }))
  const pendingCount = checklistItems.filter((item) => !item.done).length

  const scrollToField = (field: string) => {
    const el = document.getElementById(`reg-field-${field}`)
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'center'})
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.focus()
      }
    }
  }

  return (
    <form
      className='form w-500 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='mb-10 text-center'>
        {/* begin::Title */}
        <h1 className='text-dark mb-3'>Create an Account</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-400 fw-bold fs-4'>
          Already have an account?
          <Link to='/auth/login' className='link-primary fw-bolder' style={{marginLeft: '5px'}}>
            Login
          </Link>
        </div>
        {/* end::Link */}
      </div>
      {/* end::Heading */}

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      <div className='row fv-row mb-4'>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>First name</label>
          <input
            id='reg-field-firstname'
            placeholder='First name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('firstname')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.firstname && formik.errors.firstname,
              },
              {
                'is-valid': formik.touched.firstname && !formik.errors.firstname,
              }
            )}
          />
          {formik.touched.firstname && formik.errors.firstname && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.firstname}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row'>
            <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
            <input
              id='reg-field-lastname'
              placeholder='Last name'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('lastname')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.lastname && formik.errors.lastname,
                },
                {
                  'is-valid': formik.touched.lastname && !formik.errors.lastname,
                }
              )}
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.lastname}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group DOB and Phone number */}
      <div className='row fv-row mb-4'>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>Date of Birth</label>
          <input
            id='reg-field-dob'
            type='date'
            autoComplete='off'
            {...formik.getFieldProps('dob')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.dob && formik.errors.dob},
              {
                'is-valid': formik.touched.dob && !formik.errors.dob,
              }
            )}
          />
          {formik.touched.dob && formik.errors.dob && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.dob}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>Phone number</label>
          <input
            id='reg-field-phone'
            placeholder='Phone number'
            type='number'
            autoComplete='off'
            {...formik.getFieldProps('phone')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.phone && formik.errors.phone},
              {
                'is-valid': formik.touched.phone && !formik.errors.phone,
              }
            )}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.phone}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form Class Grade */}
      <div className='fv-row mb-4'>
        <label className='class="form-label fw-bolder text-dark fs-6'>Class Grade</label>
        <select
          id='reg-field-class_grade'
          className='form-select form-select-solid form-select-lg'
          {...formik.getFieldProps('class_grade')}
        >
          <option value=''>Select Class Grade</option>
          <option value='al'>Advanced Level</option>
          <option value='ol'>Ordinary Level</option>
        </select>
        {formik.touched.class_grade && formik.errors.class_grade && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.class_grade}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group NIC */}
      {formik.values.class_grade === 'al' && (
        <>
        <div className='fv-row mb-2'>
          <label className='form-label fw-bolder text-dark fs-6'>NIC</label>
            <input
              id='reg-field-nic'
              placeholder='123456789v'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('nic')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.nic && formik.errors.nic,
                },
                {
                  'is-valid': formik.touched.nic && !formik.errors.nic,
                }
              )}
            />
            {formik.touched.nic && formik.errors.nic && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.nic}</span>
                </div>
              </div>
            )}
        </div>
        
        <div className='row fv-row mt-4 mb-3'>
          {/* NIC Front */}
            <label className='form-label fw-bolder text-dark fs-6'>NIC Front Image(Maximum 1MB)</label>

            <input
              id='reg-field-nic_front'
              type='file'
              accept='image/*'
              className='form-control form-control-lg form-control-solid'
              onChange={(e) => {
                const file = e.currentTarget.files?.[0]
                if (file) {
                  formik.setFieldValue('nic_front', file)
                  setNicFrontPreview(URL.createObjectURL(file))
                }
              }}
            />

            {nicFrontPreview && (
              <div className='mt-3 mb-2'>
                <img
                  src={nicFrontPreview}
                  alt='NIC Front Preview'
                  style={{width: '100%', maxHeight: '200px', objectFit: 'cover'}}
                  className='rounded border'
                />
              </div>
            )}

          {/* NIC Back */}
        <div className='row fv-row my-3'>
            <label className='form-label fw-bolder text-dark fs-6'>NIC Back Image(Maximum 1MB)</label>

            <input
              id='reg-field-nic_back'
              type='file'
              accept='image/*'
              className='form-control form-control-lg form-control-solid'
              onChange={(e) => {
                const file = e.currentTarget.files?.[0]
                if (file) {
                  formik.setFieldValue('nic_back', file)
                  setNicBackPreview(URL.createObjectURL(file))
                }
              }}
            />

            {nicBackPreview && (
              <div className='mt-3'>
                <img
                  src={nicBackPreview}
                  alt='NIC Back Preview'
                  style={{width: '100%', maxHeight: '200px', objectFit: 'cover'}}
                  className='rounded border'
                />
              </div>
            )}
          </div>
        </div>
        </>
      )}
      {/* end::Form group */}
      

      {/* begin::Form group Email */}
      <div className='fv-row mb-4'>
        <label className='form-label fw-bolder text-dark fs-6'>Email</label>
        <input
          id='reg-field-email'
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group School */}
      <div className='fv-row mb-4'>
        <label className='class="form-label fw-bolder text-dark fs-6'>School</label>
        <input
          id='reg-field-school'
          placeholder='School'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('school')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.school && formik.errors.school,
            },
            {
              'is-valid': formik.touched.school && !formik.errors.school,
            }
          )}
        />
        {formik.touched.school && formik.errors.school && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.school}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}
      {/* begin::Form group Address */}
      <div className='fv-row mb-4'>
        <label className='class="form-label fw-bolder text-dark fs-6'>Address</label>
        <input
          id='reg-field-address'
          placeholder='Address'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('address')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.address && formik.errors.address,
            },
            {
              'is-valid': formik.touched.address && !formik.errors.address,
            }
          )}
        />
        {formik.touched.address && formik.errors.address && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.address}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Address */}
      <div className='fv-row mb-4'>
        <label className='class="form-label fw-bolder text-dark fs-6'>District</label>
        <select
          id='reg-field-district'
          {...formik.getFieldProps('district')}
          className={clsx(
            'form-select form-select-solid form-select-lg',
            {'is-invalid': formik.touched.district && formik.errors.district},
            {
              'is-valid': formik.touched.district && !formik.errors.district,
            }
          )}
        >
          <option value=''>Select District</option>
          <option value='Colombo'>Colombo</option>
          <option value='Gampaha'>Gampaha</option>
          <option value='Kalutara'>Kalutara</option>
          <option value='Kandy'>Kandy</option>
          <option value='Matale'>Matale</option>
          <option value='Nuwara Eliya'>Nuwara Eliya</option>
          <option value='Galle'>Galle</option>
          <option value='Gampaha'>Gampaha</option>
          <option value='Matara'>Matara</option>
          <option value='Hambantota'>Hambantota</option>
          <option value='Kilinochchi'>Kilinochchi</option>
          <option value='Mannar'>Mannar</option>
          <option value='Vavuniya'>Vavuniya</option>
          <option value='Mullaitivu'>Mullaitivu</option>
          <option value='Batticaloa'>Batticaloa</option>
          <option value='Ampara'>Ampara</option>
          <option value='Trincomalee'>Trincomalee</option>
          <option value='Kurunegala'>Kurunegala</option>
          <option value='Puttalam'>Puttalam</option>
          <option value='Anuradhapura'>Anuradhapura</option>
          <option value='Polonnaruwa'>Polonnaruwa</option>
          <option value='Badulla'>Badulla</option>
          <option value='Moneragala'>Moneragala</option>
          <option value='Ratnapura'>Ratnapura</option>
          <option value='Kegalle'>Kegalle</option>
        </select>
        {formik.touched.district && formik.errors.district && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.district}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form Class Type */}
      <div className='fv-row mb-4'>
        <label className='class="form-label fw-bolder text-dark fs-6'>Class Type</label>
        <select
          id='reg-field-class_type'
          className='form-select form-select-solid form-select-lg'
          {...formik.getFieldProps('class_type')}
        >
          <option value=''>Select Class Type</option>
          <option value='online'>Online</option>
          <option value='physical'>Physical</option>
        </select>
        {formik.touched.class_type && formik.errors.class_type && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.class_type}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {showLocation && (
        <div className='fv-row mb-4'>
          <label className='class="form-label fw-bolder text-dark fs-6'>Location</label>
          <select
            id='reg-field-location'
            className='form-select form-select-solid form-select-lg'
            {...formik.getFieldProps('location')}
          >
            <option value=''>Select Location</option>
            <option value='aone_montana'>Aone Negambo</option>
            <option value='montana_gampaha'>Montana Gampaha</option>
            <option value='sisip_chilaw'>Sisip Chilaw</option>
            <option value='siyathra_kiribathgoda'>Siyathra Kiribathgoda</option>
          </select>
          {formik.touched.location && formik.errors.location && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.location}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* begin::Form group Address */}
      <div className='fv-row mb-7'>
        <label className='form-label fw-bolder text-dark fs-6'>Account Type</label>
        <select
          className='form-select form-select-solid form-select-lg'
          {...formik.getFieldProps('account_type')}
        >
          {/* <option value=''>Select Account Type</option> */}
          <option value='student'>Student</option>
          <option value='teacher'>Teacher</option>
        </select>
        {formik.touched.account_type && formik.errors.account_type && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.account_type}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='mb-2 fv-row' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-dark fs-6'>Password</label>
          <div className='position-relative mb-3'>
            <input
              id='reg-field-password'
              type='password'
              placeholder='Password'
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
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
        <input
          id='reg-field-changepassword'
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            id='reg-field-acceptTerms'
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className='form-check-label fw-bold text-gray-700 fs-6'
            htmlFor='reg-field-acceptTerms'
          >
            I Agree the{' '}
            <Link to='#' className='ms-1 link-primary'>
              terms and conditions
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            Cancel
          </button>
        </Link>
      </div>
      {/* end::Form group */}

      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 1050,
          width: checklistOpen ? 280 : 220,
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <div className='card shadow-lg border-0'>
          <button
            type='button'
            className='card-header py-3 px-4 d-flex align-items-center justify-content-between border-0'
            style={{background: pendingCount ? '#fff4de' : '#e8fff3', cursor: 'pointer'}}
            onClick={() => setChecklistOpen((open) => !open)}
          >
            <div className='text-start'>
              <div className='fw-bolder fs-7 text-gray-800'>Registration checklist</div>
              <div className={`fs-8 ${pendingCount ? 'text-warning' : 'text-success'}`}>
                {pendingCount ? `${pendingCount} pending` : 'All fields complete'}
              </div>
            </div>
            <span className='fw-bold text-gray-600'>{checklistOpen ? '−' : '+'}</span>
          </button>
          {checklistOpen && (
            <div className='card-body py-3 px-4' style={{maxHeight: 360, overflowY: 'auto'}}>
              {checklistItems.map((item) => (
                <button
                  key={item.field}
                  type='button'
                  className='d-flex align-items-start w-100 text-start mb-2 p-0 bg-transparent border-0'
                  onClick={() => scrollToField(item.field)}
                >
                  <span
                    className={`badge me-2 mt-1 ${item.done ? 'badge-light-success' : 'badge-light-warning'}`}
                    style={{minWidth: 62}}
                  >
                    {item.done ? 'Done' : 'Pending'}
                  </span>
                  <span>
                    <span className='d-block fs-7 fw-bold text-gray-800'>{item.label}</span>
                    {!item.done && item.error && (
                      <span className='d-block fs-8 text-danger'>{String(item.error)}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
