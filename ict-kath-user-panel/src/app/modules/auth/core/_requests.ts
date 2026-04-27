import axios from 'axios'
import {API_BASE_URL} from '../../../../config'
import {AuthModel, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_BASE_URL}api/user/token`
export const LOGIN_URL = `${API_BASE_URL}api/user/login`
export const VALIDATE_OTP_URL = `${API_BASE_URL}api/user/phone-validate/otp`
export const REQUEST_OTP_URL = `${API_BASE_URL}api/user/phone-validate`
export const REGISTER_URL = `${API_BASE_URL}api/user/create`
export const REQUEST_PASSWORD_URL = `${API_BASE_URL}api/user/password-reset-sms`
export const REQUEST_PASSWORD_RESET_VALIDATE_URL = `${API_BASE_URL}api/user/password-reset-sms-validate-code`
export const UPDATE_IMAGE_URL = `${API_BASE_URL}api/user/image/upload`
export const UPLOAD_NIC_IMAGE_URL = `${API_BASE_URL}api/user/nic/image/upload`

// Server should return AuthModel
export function login(phone: string, password: string, deviceInfo: any ) {
  return axios.post<AuthModel>(LOGIN_URL, {
    phone,
    password,
    ...deviceInfo
  })
}

export function validateOtp(otp: string, phone: string) {
  return axios
    .post<any>(VALIDATE_OTP_URL, {
      otp,
      phone,
    })
    .then((response: any) => response.data)
    .catch((err: any) => {
      return err.response.data
    })
}

export function requestOtp(userId: string, phone: string) {
  return axios.post<any>(REQUEST_OTP_URL, {
    userId,
    phone,
  })
}

// Server should return AuthModel
export function register(formData: FormData) {
  return axios
    .post(REGISTER_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response: any) => response.data)
    .catch((err: any) => {
      return err.response.data
    })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(phone: string) {
  return axios.post<any>(REQUEST_PASSWORD_URL, {
    phoneNumber: '0'+ phone,
  })
}

export function validateOtpRPChange(phone: string,otp: string,newPassword: string) {
  return axios.post<any>(REQUEST_PASSWORD_RESET_VALIDATE_URL, {
    phone,
    otp,
    newPassword
  })
  .then((response: any) => response.data)
  .catch((err: any) => {
    return err.response.data
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    token: token,
  })
}

export function updateImage(formData: FormData) {
  return axios.put<any>(UPDATE_IMAGE_URL, formData)
}

export function uploadNicImages(formData: FormData) {
  return axios.put<any>(UPLOAD_NIC_IMAGE_URL, formData)
}
