import axios, {AxiosResponse} from 'axios'
import {API_BASE_URL} from '../../../../config'
import {ID, Response} from '../../../../_metronic/helpers'
import {Payment, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const USER_URL = `${API_URL}/user`
const GET_USERS_URL = `${API_URL}/users/query`

const getPastPapers = (data: any): Promise<any> => {
  return axios
    .post(`${API_BASE_URL}api/open-resources/filter`, data)
    .then((response: AxiosResponse<Response<any>>) => response.data)
    .then((response: Response<any>) => response.data)
}

export {getPastPapers}
