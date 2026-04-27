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
      "authToken": token
  })
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const profileUp = async (data: any): Promise<any> => {

  try {
    const response = await axios
      .put(`${API_BASE_URL}api/user/update`, data)
    return response.data
  } catch (error) {
    return error
  }
}

const nicImagesUpload = async (formData: any): Promise<any> => {

  try {
    const response = await axios
      .put(`${API_BASE_URL}api/user/nic/image/upload`, formData)
    return response.data
  } catch (error) {
    return error
  }
}

const getClasses = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/course/search`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const getModules = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/module/search`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const getEnClasses = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/enrollment/student/filter`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
    .catch((err: any) => err.response.data)
}

const getClassDetails = (query: any): Promise<any> => {
  return axios.get(`${API_BASE_URL}api/course/${query}`).then((d: AxiosResponse<any>) => d.data).catch((err: any) => err.response.data)
}


const homeworkUp = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/assignment/create`, data)
    .then((response: any) => {
      return response.data
    })
    .catch((err: any) => {
      return err.response.data
    })
}


const bankPay = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/class-payment/create`, data)
    .then((response: any) => {
      return response.data
    })
    .catch((err: any) => {
      return err.response.data
    })
}

const getCourseClasses = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/class/search`, data)
    .then((response: any) => {
      return response.data
    })
    .catch((response: any) => {
      return response
    })
}

const getCourseMaterials = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/material/search`, data)
    .then((response: any) => {
      return response.data
    })
    .catch((response: any) => {
      return response
    })
}

const getSiteContents = (): Promise<any> => {
  return axios
    .get(`${API_BASE_URL}api/contents`)
    .then((response: any) => {
      return response.data
    })
    .catch((response: any) => {
      return response
    })
}

export {
  getClasses,
  getEnClasses,
  getClassDetails,
  bankPay,
  getCourseClasses,
  getSiteContents,
  getCourseMaterials,
  authTokenValidate,
  profileUp,
  nicImagesUpload,
  homeworkUp,
  getModules
}
