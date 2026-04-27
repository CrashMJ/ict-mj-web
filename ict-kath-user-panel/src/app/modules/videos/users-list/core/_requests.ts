import axios, {AxiosResponse} from 'axios'
import {API_BASE_URL} from '../../../../../config'
import {ID, Response} from '../../../../../_metronic/helpers'
import {User, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const USER_URL = `${API_URL}/user`
const GET_USERS_URL = `${API_URL}/users/query`

const authTokenValidate = (token: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/user/check/authToken`, {
      authToken: token,
    })
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const getVideos = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/video-sell/search`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const getBankPendingVideos = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/video-buy/student/filter`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const payherePayment = (data: any): Promise<any> => {
  console.log('data', data)
  const {
    sandbox,
    merchant_id,
    return_url,
    cancel_url,
    notify_url,
    order_id,
    items,
    amount,
    currency,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    country,
  } = data
  return axios
    .post('https://sandbox.payhere.lk/pay/checkout', data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const getSellVideoDetails = (query: any): Promise<any> => {
  return axios
    .get(`${API_BASE_URL}api/video-sell/${query}`)
    .then((d: AxiosResponse<any>) => d.data)
    .catch((err: any) => err.response.data)
}

const buyVideo = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/video-buy/create`, data)
    .then((response: any) => {
      return response.data
    })
    .catch((err: any) => {
      return err.response.data
    })
}

const getBuyLessonData = (id: any): Promise<any> => {
  console.log('enter buylesoonData', id)
  return axios
    .get(`${API_BASE_URL}api/video-buy/video/${id}`)
    .then((response: any) => {
      return response.data
    })
    .catch((response: any) => {
      console.log('response error', response)

      return response
    })
}

const createBuyLessonViewData = (data: any): Promise<any> => {
  console.log('Enter', data)
  return axios
    .post(`${API_BASE_URL}api/video-buy/viewCount/create`, data)
    .then((response: any) => {
      return response.data
    })
    .catch((err: any) => {
      return err.response.data
    })
}

const getPurchasedLessons = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/video-buy/student/filter`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

export {
  getVideos,
  getBankPendingVideos,
  payherePayment,
  getSellVideoDetails,
  buyVideo,
  getBuyLessonData,
  createBuyLessonViewData,
  getPurchasedLessons,
  authTokenValidate,
}
