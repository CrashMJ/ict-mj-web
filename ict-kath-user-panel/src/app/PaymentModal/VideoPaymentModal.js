import React from 'react'
import {API_BASE_URL} from '../../config'
var md5 = require('md5')
// import './payment_modal.css'

const VideoPaymentModal = ({
  orderId,
  name,
  amount,
  first_name,
  last_name,
  email,
  phone,
  address,
  city,
  hash,
  dismissed,
  paymentStatusUp,
  payType,
}) => {
  // 220966
  var secrete = md5('MTkyNTE1MjcwMzM5NDQ1NzYwMTI0MTE5NTY0MTYxMTU2NTU3MjYzOA==').toUpperCase()
  var code = md5(`220966${orderId}${amount.toFixed(2)}LKR${secrete}`)
  var hashValue = code.toUpperCase()

  let notifyUrl = ''
  if (payType === 'lesson') {
    notifyUrl = `${API_BASE_URL}api/video/payment/notify`
  } else {
    notifyUrl = `${API_BASE_URL}api/order/payment/notify`
  }
  // Put the payment variables here
  var payment = {
    sandbox: false,
    merchant_id: '220966',
    return_url: notifyUrl,
    cancel_url: notifyUrl,
    notify_url: notifyUrl,
    hash: hashValue,
    order_id: orderId,
    items: name,
    amount: amount.toFixed(2),
    currency: 'LKR',
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    address: address,
    city: city,
    country: 'Sri Lanka',
    delivery_address: '', // optional field
    delivery_city: '', // optional field
    delivery_country: '', // optional field
    custom_1: '', // optional field
    custom_2: '', // optional field
  }

  // Called when user completed the payment. It can be a successful payment or failure
  window.payhere.onCompleted = function onCompleted(orderId) {
    paymentStatusUp()
    window.location.reload()
  }

  // Called when user closes the payment without completing
  window.payhere.onDismissed = function onDismissed() {
    //Note: Prompt user to pay again or show an error page
    console.log('Payment dismissed')
    dismissed()
    window.location.reload()
  }

  // Called when error happens when initializing payment such as invalid parameters
  window.payhere.onError = function onError(error) {
    // Note: show an error page
    console.log('Error:' + error)
  }

  if (orderId) {
    // var secrete = (md5("MTkyNTE1MjcwMzM5NDQ1NzYwMTI0MTE5NTY0MTYxMTU2NTU3MjYzOA==")).toUpperCase();
    // var code = md5(`220966${orderId}${amount.toFixed(2)}LKR${secrete}`);
    // console.log(orderId, `220966${orderId}${amount.toFixed(2)}LKR${secrete}`)
    // var hashValue = code.toUpperCase();
    // console.log('Payment completed. OrderID:' + hashValue,hash)
    pay()
  }

  function pay() {
    window.payhere.startPayment(payment)
  }

  // return <button onClick={pay}>Pay with Payhere</button>
  return (
    <a onClick={pay}>
      <img
        src='https://www.payhere.lk/downloads/images/payhere_long_banner.png'
        alt='PayHere'
        width='400'
      />
    </a>
  )
}

export default VideoPaymentModal
