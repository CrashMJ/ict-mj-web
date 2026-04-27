import axios, {AxiosResponse} from 'axios'
import {API_BASE_URL} from '../../../../../config'
import {ID, Response} from '../../../../../_metronic/helpers'
import {Payment, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const USER_URL = `${API_URL}/user`
const GET_USERS_URL = `${API_URL}/users/query`

const getPayments = (data: any): Promise<any> => {
  console.log('data',data)
  if(data.type === 'class'){
    return axios
    .post(`${API_BASE_URL}api/class-payment/student/search`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
  }else{
    data['video_id'] = null;
    data['status'] = "";
    data['payment_status']= "";
    data['payment_type']= "";
    data['sort_field']= "id";
    return axios
    .post(`${API_BASE_URL}api/video-buy/student/filter`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
  }
  
}

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_USERS_URL}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getUserById = (id: ID): Promise<Payment | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<Payment>>) => response.data)
    .then((response: Response<Payment>) => response.data)
}

const createUser = (user: Payment): Promise<Payment | undefined> => {
  return axios
    .put(USER_URL, user)
    .then((response: AxiosResponse<Response<Payment>>) => response.data)
    .then((response: Response<Payment>) => response.data)
}

const updateUser = (user: Payment): Promise<Payment | undefined> => {
  return axios
    .post(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<Payment>>) => response.data)
    .then((response: Response<Payment>) => response.data)
}

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {})
}

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

export {getPayments, getUsers, deleteUser, deleteSelectedUsers, getUserById, createUser, updateUser}
