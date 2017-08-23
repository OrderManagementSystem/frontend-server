import axios from "axios";
import {getAuthorizationHeader, refreshAccessToken} from "../utils/auth";

const BASE_URL = 'http://localhost:8080';

export {
  BASE_URL,
  getAllOrders,
  takeOrder
}

function getAllOrders() {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/orders`,
    headers: getAuthorizationHeader()
  }).then(response => response.data.content.map(order => {
    order.createdDate = new Date(order.createdDate + 'Z').toString();
    return order
  })).catch(error => {
    return refreshAccessToken().then(r => getAllOrders())
  })
}

function takeOrder(id) {
  return axios({
    method: 'PATCH',
    url: `${BASE_URL}/orders/${id}/take`,
    headers: getAuthorizationHeader()
  }).catch(error => {
    if (error.status === 401) {
      return refreshAccessToken().then(r => takeOrder(id))
    }
  })
}
