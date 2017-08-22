import axios from "axios";
import {getHeader} from '../utils/auth'

const BASE_URL = 'http://localhost:8080';

export {
  BASE_URL,
  getAllOrders,
  takeOrder
}

function getAllOrders() {
  const url = `${BASE_URL}/orders`;
  return axios({
    method: 'GET',
    url,
    headers: getHeader()
  }).then(response => response.data.map(order => {
      order.createdDate = new Date(order.createdDate + 'Z').toString();
      return order
    }))
}

function takeOrder(id) {
  const url = `${BASE_URL}/${id}/take`;
  axios.patch(url);
  // todo: удалить этот заказ из списка
}
