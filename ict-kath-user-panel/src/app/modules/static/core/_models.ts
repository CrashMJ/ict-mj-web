import {ID, Response} from '../../../../_metronic/helpers'
export type Payment = {
  id?: number
  course_name_en?: string
  amount?: string
  payment_type?: string
  payment_status?: string
  paid_date?: string
  created_at?: string
  course_code?: string
}

export type UsersQueryResponse = Response<Array<Payment>>

export const initialPayment: Payment = {}
