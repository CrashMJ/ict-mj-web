import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { KTSVG } from '../../../../../_metronic/helpers';
import { nicImagesUpload } from '../../../../modules/classes/users-list/core/_requests';
import { getAuth, setAuth } from '../../../../modules/auth';
import { getUserByToken } from '../../../../modules/auth/core/_requests';

type Props = {
  data: {
    nicFront: string;
    nicBack: string;
    setNicFront: Dispatch<SetStateAction<string>>;
    setNicBack: Dispatch<SetStateAction<string>>;
  };
  show: boolean;
  handleClose: () => void;
};

const UpdateNicImagesModal: React.FC<Props> = ({ show, handleClose, data }) => {
  const [auth, setAuthState] = useState<any | undefined>(getAuth())
  const [nicFront, setNicFront] = useState(null);
  const [nicBack, setNicBack] = useState(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [stateSuccess, setStateSuccess] = useState<any>(null);
  const [stateErr, setStateErr] = useState<any>(null);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [buttonShow, setButtonShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
   const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

  const dismissChanges = () => {
    const currentAuth = getAuth()

    if (!currentAuth?.nic_front || !currentAuth?.nic_back) {
      setStateErr("Please upload NIC Front and Back images before closing.");
      return;
    }

    handleClose();
  };

  const handleFrontChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setNicFront(file);
      setFrontPreview(URL.createObjectURL(file));
      setStateErr(null);
    }
  }

  const handleBackChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setNicBack(file);
      setBackPreview(URL.createObjectURL(file));
      setStateErr(null);
    }
  }

  const applyChanges = async () => {
    if (!nicFront || !nicBack) {
      setStateErr('Please upload NIC Front and Back images')
      return
    }

    try {
      setLoading(true);
      setStateErr(null);

      const formData = new FormData()
      formData.append('nic_front', nicFront)
      formData.append('nic_back', nicBack)

      const res: any = await nicImagesUpload(formData)

      if (res && res.statusCode === 200) {
        setStateSuccess('NIC images uploaded successfully')

        const { data: user }: any = await getUserByToken(auth.token)
        
          const lsValue: any = await localStorage.getItem('kt-auth-react-v');
          let d = JSON.parse(lsValue);
          if(nicFront){
            d.nic_front = user.data.user.nic_front;
          }
        
          if(nicBack){
            d.nic_back = user.data.user.nic_back;
          }
                  
          const lsValue2 = JSON.stringify(d)
          localStorage.setItem('kt-auth-react-v', lsValue2)
          setAuthState(d); 

          if (frontInputRef.current) {
            frontInputRef.current.value = "";
          }
        
          if (backInputRef.current) {
            backInputRef.current.value = "";
          }

        setTimeout(() => {
          dismissChanges()
        }, 1000)
      } else {
        setStateErr(res?.message || 'Something went wrong')
      }
    } catch (error) {
      setStateErr('Upload failed')
    }

    setLoading(false)
  }

  return (       
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={dismissChanges}
      dialogClassName='modal-md'
      contentClassName='border border-danger'
    >
      <div className='modal-content'>
        {/* Header */}
        <div className='modal-header bg-danger justify-content-center'>
            
          <h3 className='modal-title fw-bold text-center w-100 text-white'><img
              src='/media/icons/duotune/general/warning-icon.svg'
              style={{ width: '32px', marginRight: '10px' }}
            /> Upload Your NIC Images</h3>

          <div
            className='btn btn-icon btn-sm btn-light text-white position-absolute end-0 me-3'
            onClick={dismissChanges}
          >
            <h1>X</h1>
          </div>
        </div>

        {/* Body */}
        <div className='modal-body'>
          {stateSuccess && (
            <div className='alert alert-success'>
              <div className='alert-text fw-bold'>{stateSuccess}</div>
            </div>
          )}

          {stateErr && (
            <div className='alert alert-danger'>
              <div className='alert-text fw-bold'>{stateErr}</div>
            </div>
          )}
          <div className='row'>
            <div className='col-sm-12 col-md-6'>
              <div className='form-group mb-4'>
                <label className='form-label'>1. NIC Front Image</label>
                <p className='text-danger'>(Maximum 1MB)</p>
                {frontPreview && (
                  <div className="mt-3 text-center">
                    <img
                      src={frontPreview}
                      alt="NIC Front Preview"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                )}
                <input
                  ref={frontInputRef}
                  type='file'
                  className='form-control'
                  accept='image/png, image/jpeg, image/jpg'
                  onChange={handleFrontChange}
                />
              </div>
            </div>
            <div className='col-sm-12 col-md-6'>
              <div className='form-group mb-3'>
                <label className='form-label'>2. NIC Back Image</label>
                <p className='text-danger'>(Maximum 1MB)</p>
                {backPreview && (
                  <div className="mt-3 text-center">
                    <img
                      src={backPreview}
                      alt="NIC Back Preview"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                )}
                <input
                  ref={backInputRef}
                  type='file'
                  className='form-control'
                  accept='image/png, image/jpeg, image/jpg'
                  onChange={handleBackChange}
                />
              </div>
            </div>
          </div>   
        </div>

        {/* Footer */}
        <div className='modal-footer'>
          {!loading ? (
            <button className='btn btn-primary' onClick={applyChanges}>
              Upload Images
            </button>
          ) : (
            <button className='btn btn-primary' disabled>
              Uploading...
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export { UpdateNicImagesModal };
