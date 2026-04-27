import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { KTSVG } from '../../../../../_metronic/helpers';
import { profileUp } from '../../../../modules/classes/users-list/core/_requests';
import { getAuth, setAuth } from '../../../../modules/auth';

type Props = {
  data: {
    nic: string;
    classType: string;
    location: string;
    setNic: Dispatch<SetStateAction<string>>;
    setClassType: Dispatch<SetStateAction<string>>;
    setLocation: Dispatch<SetStateAction<string>>;
  };
  show: boolean;
  handleClose: () => void;
};

const UpdateProfileModal: React.FC<Props> = ({ show, handleClose, data }) => {
  const [nic, setNic] = useState(data.nic);
  const [classType, setClassType] = useState(data.classType);
  const [location, setLocation] = useState(data.location);
  const [stateSuccess, setStateSuccess] = useState<any>(null);
  const [stateErr, setStateErr] = useState<any>(null);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [buttonShow, setButtonShow] = useState<boolean>(false);

  const dismissChanges = () => {
    setNic(data.nic);
    setClassType(data.classType);
    setLocation(data.location);
    handleClose();
  };

  useEffect(() => {
    // Enable the button only when both NIC and classType are not empty
    setButtonEnabled(nic.trim() !== '' && classType.trim() !== '' && (classType !== 'physical' || location.trim() !== ''));
  }, [nic, classType, location]);

  const applyChanges = async () => {

    if (!buttonEnabled) return;

    // NIC validation
    const nicRegex = /^(\d{9}[vV]|\d{12})$/;
    if (!nicRegex.test(nic)) {
      setStateErr("Invalid NIC format. NIC should be 12 digits or 9 digits followed by 'V' or 'v'.");
      return
    }else{
      setStateErr(null);
    }

    if(classType == "physical" && location == ''){
      setStateErr("Select the location");
    }

    data.setNic(nic);
    data.setClassType(classType);
    
    try {
      setButtonShow(true)
      const res: any = await profileUp({'nic': nic, 'class_type': classType, 'location': location});

      if (res && res.statusCode && res.statusCode === 200) {
        setStateSuccess("Profile successfully uploaded");
        const currentAuth = getAuth() || {}; // Get current auth object or an empty object
        currentAuth.class_type = classType; // Update the class_type
        currentAuth.nic = nic;// Update the nic
        currentAuth.location = location;// Update the nic
        setAuth(currentAuth);
        setNic('')
        setClassType('')
        setLocation('')
        setTimeout(() => {
          handleClose();
        }, 1000);
        
      } else if (res && res.statusCode && res.statusCode === 400) {
        setStateErr(res.message);
      } else {
        setStateErr("Something went wrong.");
      }

    } catch (error) {
      setStateErr("Failed to update profile.");
    }
  };

  return (
    <Modal
      className='modal fade'
      id='kt_modal_update_profile'
      backdrop='static'
      tabIndex={-1}
      role='dialog'
      show={show}
      dialogClassName='modal-md'
      aria-hidden='true'
      onHide={dismissChanges}
    >
      <div className='modal-content'>
        <div className='modal-header justify-content-center'>
          <h3 className='modal-title fw-bold'>Update Profile</h3>
          <div
            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
            onClick={dismissChanges}
          >
            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-2x' />
          </div>
        </div>
        <div className='modal-body'>
          <div className='row'>
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
          </div>
          <div className='form-group mb-3'>
            <label className='form-label'>NIC</label>
            <input
              type='text'
              className='form-control'
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
          </div>
          <div className='form-group mb-3'>
            <label className='form-label'>Class Type</label>
            <select
              className='form-select form-select-solid form-select-lg'
              onChange={(e: any) => {setClassType(e.target.value); console.log(e.target.value)}}
                value={classType}
              >
                <option value=''>Select Class Type</option>
                <option value='online'>Online</option>
                <option value='physical'>Physical</option>
            </select>
          </div>
          {classType === 'physical' && (
            <div className='form-group mb-3'>
              <label className='form-label'>Location</label>
              <select
                className='form-select form-select-solid form-select-lg'
                value={location}
                onChange={(e: any) => setLocation(e.target.value)}
              >
                <option value=''>Select Location</option>
                <option value='aone_montana'>Aone Negambo</option>
                <option value='montana_gampaha'>Montana Gampaha</option>
                <option value='sisip_chilaw'>Sisip Chilaw</option>
                <option value='siyathra_kiribathgoda'>Siyathra Kiribathgoda</option>
                {/* Add more locations as needed */}
              </select>
            </div>
          )}
        </div>
        <div className='modal-footer'>
          {/* <button type='button' className='btn btn-light-primary' onClick={dismissChanges}>
            Cancel
          </button> */}
          {!buttonShow ? ( 
            <button id='submit' type='button' className='btn btn-primary' onClick={applyChanges} disabled={!buttonEnabled}>
              Update Profile
            </button>
          ) : (
            <button type='button' className='btn btn-primary' disabled>
                Updating...
            </button>
          )
          }
        </div>
      </div>
    </Modal>
  );
};

export { UpdateProfileModal };
