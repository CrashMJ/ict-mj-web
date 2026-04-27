/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react'
import { getAuth, useAuth } from '../../auth';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getUserByToken, updateImage, uploadNicImages } from '../../auth/core/_requests';
import StarRatings from 'react-star-ratings';
import { GCP_STORAGE_BASE_URL } from '../../../../config';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';

const profileDetailsSchema = Yup.object().shape({
  // image: Yup.string().required('Image is required'),
})

type Props = {
  setAuthApp?: any
}

export const Overview: React.FC<Props> = ({ setAuthApp }) => {
  const [auth, setAuth] = useState<any | undefined>(getAuth())

  const [data, setData] = useState<any>({ image: "" })
  const updateData = (fieldsToUpdate: Partial<any>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [loading, setLoading] = useState(false)
  const [fieldValue, setFieldValue] = useState<any>(null)
  const [profileStateSuccess, setProfileStateSuccess] = useState<any>(null)
  const [profileStateErr, setProfileStateErr] = useState<any>(null)
  const [nicStateSuccess, setNicStateSuccess] = useState<any>(null)
  const [nicStateErr, setNicStateErr] = useState<any>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(auth?.nic_front || null)
  const [backPreview, setBackPreview] = useState<string | null>(auth?.nic_back || null)
  const [frontFile, setFrontFile] = useState<any>(null)
  const [backFile, setBackFile] = useState<any>(null)
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<any>({
    initialValues: { image: "",  },
    validationSchema: profileDetailsSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setProfileStateErr(null);
      setProfileStateSuccess(null);

      const formData = new FormData();
      formData.append("image", fieldValue)
      const res: any = await updateImage(formData);
      console.log('res',res)
      if (res && res.data && res.data.statusCode && res.data.statusCode === 200) {
        setProfileStateSuccess("Profile picture successfully updated");

        const { data: user }: any = await getUserByToken(auth.token)
        try {
          const lsValue: any = await localStorage.getItem('kt-auth-react-v');
          let d = JSON.parse(lsValue);
          d.image = user.data.user.image;
          const lsValue2 = JSON.stringify(d)
          localStorage.setItem('kt-auth-react-v', lsValue2)
          setAuth(d);
          setAuthApp(d);
          setFieldValue(null);
        } catch (error) {
          setFieldValue(null);
          console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
        }
        // setCurrentUser(user)
      } else {
        setFieldValue(null);
        setProfileStateErr("Something went wrong!");
      }

      setLoading(false)
      setTimeout(() => {
        setLoading(false)
      }, 2500);

      setTimeout(() => {
        setProfileStateErr(null);
        setProfileStateSuccess(null);
        setFieldValue(null);
      }, 15000);
    },
  })

  const submitNicImages = async () => {
    if (!frontFile && !backFile) return

    setLoading(true)
    setNicStateErr(null)
    setNicStateSuccess(null)

    try {
      const formData = new FormData()

      if (frontFile) {
        formData.append("nic_front", frontFile)
      }

      if (backFile) {
        formData.append("nic_back", backFile)
      }

      const res: any = await uploadNicImages(formData)

      if (res?.data?.statusCode === 200) {
        setNicStateSuccess("NIC images updated successfully")
        const { data: user }: any = await getUserByToken(auth.token)
        try {
          const lsValue: any = await localStorage.getItem('kt-auth-react-v');
          let d = JSON.parse(lsValue);
          if(frontFile){
            d.nic_front = user.data.user.nic_front;
          }

          if(backFile){
            d.nic_back = user.data.user.nic_back;
          }
          
          const lsValue2 = JSON.stringify(d)
          localStorage.setItem('kt-auth-react-v', lsValue2)
          setAuth(d);
          setAuthApp(d);
          if (frontInputRef.current) {
            frontInputRef.current.value = "";
          }

          if (backInputRef.current) {
            backInputRef.current.value = "";
          }
          setFrontFile(null);
          setBackFile(null);
        } catch (error) {
          setFieldValue(null);
          console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
        }
      } else {
        setNicStateErr("Something went wrong")
      }

    } catch (error) {
      setNicStateErr("Upload failed")
    }

    setLoading(false)
  }

  const handleFrontChange = (e:any) => {
    const file = e.target.files[0]
    if (file) {
      setFrontFile(file)
      setFrontPreview(URL.createObjectURL(file))
    }
  }

  const handleBackChange = (e:any) => {
    const file = e.target.files[0]
    if (file) {
      setBackFile(file)
      setBackPreview(URL.createObjectURL(file))
    }
  }

  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>First Name</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.fname}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Last Name</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.lname}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>NIC</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.nic}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Contact Phone
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{auth.phone}</span>

              <span className='badge badge-success'>Verified</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Class Level</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.class_grade == '' ? '' : (auth.class_grade == 'al' ? 'Advanced Level' : 'Ordinary Level')}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Class Type</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.class_type == '' ? '' : (auth.class_type == 'online' ? 'Online' : 'Physical')}</span>
            </div>
          </div>

          {auth.location != '' && <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Location</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.location == 'aone_montana' ? 'Aone Montana' : auth.location === 'montana_gampaha' ? 'Montana Gampaha' : auth.location === 'siyathra_kiribathgoda'? 'Siyathra Kiribathgoda' : auth.location === 'sisip_chilaw' ? 'Sisip Chilaw' : 'Unknown Location'}</span>
            </div>
          </div>}

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>School</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.school}</span>
            </div>
          </div>


          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>District</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.district}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Registered Date</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{auth.registered_date}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Account Status
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='badge badge-success'>{auth.status}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Student Rating
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <StarRatings
                rating={auth.star_ratings}
                starRatedColor="gold"
                starDimension="20px"
                starSpacing="5px"
              />
            </div>
          </div>

        </div>
      </div>
      <div className='card mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Update Profile Picture</h3>
          </div>
        </div>

        <div className='card-body p-9'>
          {profileStateSuccess ? (
            <div className='alert alert-success'>
              <div className='alert-text font-weight-bold'>{profileStateSuccess}</div>
            </div>
          ) : (
            <></>
          )}

          {profileStateErr ? (
            <div className='alert alert-danger'>
              <div className='alert-text font-weight-bold'>{profileStateErr}</div>
            </div>
          ) : (
            <></>
          )}
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body p-9'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Select Profile Image</label>
                <div className='col-lg-8'>
                  <input
                    type='file'
                    className='form-control form-control-lg form-control-solid mb-lg-0'
                    placeholder='Profile Image'
                    accept="image/png, image/jpeg, image/jpg, image/PNG"
                    onChange={(e: any) => setFieldValue(e.target.files[0])}
                  />
                </div>
              </div>
              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-primary' disabled={loading || !fieldValue}>
                  {!loading && 'Update'}
                  {loading && (
                    <span className='indicator-progress' style={{ display: 'block' }}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle'></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className='card mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Upload NIC Images</h3>
          </div>
        </div>

        <div className='card-body p-9'>
          {nicStateSuccess ? (
            <div className='alert alert-success'>
              <div className='alert-text font-weight-bold'>{nicStateSuccess}</div>
            </div>
          ) : (
            <></>
          )}

          {nicStateErr ? (
            <div className='alert alert-danger'>
              <div className='alert-text font-weight-bold'>{nicStateErr}</div>
            </div>
          ) : (
            <></>
          )}
          <div className="row">
              {/* NIC FRONT */}
              <div className="col-12 col-md-6">
                <form className="form">
                  <div className="card-body p-9">
                    <label className="fw-bold fs-6 mb-3">NIC Front Image (Maximum 1MB)</label>
                    {frontPreview && (
                      <div className="mb-4">
                        <img
                          src={auth && auth.nic_front !== "" ? `${GCP_STORAGE_BASE_URL}${auth.nic_front}` : toAbsoluteUrl('/media/static/nic_front.jpg')}
                            style={{
                            width:"100%",
                            maxWidth:"250px",
                            borderRadius:"8px",
                            border:"1px solid #ddd",
                            cursor:"pointer"
                          }}
                          onClick={()=>window.open(frontPreview!, "_blank")}
                        />
                      </div>
                    )}
                    <input
                      ref={frontInputRef}
                      type="file"
                      className="form-control form-control-lg form-control-solid"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFrontChange}
                    />

                    <div className="mt-5 text-end">
                      <button
                        className="btn btn-primary"
                        onClick={submitNicImages}
                        disabled={loading || !frontFile}
                      >
                        {!loading && "Update"}
                        {loading && (
                          <span className="indicator-progress">
                            Please wait...
                            <span className="spinner-border spinner-border-sm ms-2"></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* NIC BACK */}
              <div className="col-12 col-md-6">
                <form className="form">
                  <div className="card-body p-9">
                    <label className="fw-bold fs-6 mb-3">NIC Back Image (Maximum 1MB)</label>
                    {backPreview && (
                      <div className="mb-4">
                        <img
                          src={auth && auth.nic_back !== "" ? `${GCP_STORAGE_BASE_URL}${auth.nic_back}` : toAbsoluteUrl('/media/static/nic_back.jpg')}
                          style={{
                            width:"100%",
                            maxWidth:"250px",
                            borderRadius:"8px",
                            border:"1px solid #ddd",
                            cursor:"pointer"
                          }}
                          onClick={()=>window.open(backPreview!, "_blank")}
                        />
                      </div>
                    )}
                    <input
                      ref={backInputRef}
                      type="file"
                      className="form-control form-control-lg form-control-solid"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleBackChange}
                    />

                    <div className="mt-5 text-end">
                      <button
                        className="btn btn-primary"
                        onClick={submitNicImages}
                        disabled={loading || !backFile}
                      >
                        {!loading && "Update"}
                        {loading && (
                          <span className="indicator-progress">
                            Please wait...
                            <span className="spinner-border spinner-border-sm ms-2"></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

