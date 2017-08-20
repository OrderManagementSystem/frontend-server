import axios from "axios";

const BASE_URL = 'http://192.168.1.3:8080';

export {
  getAllOrders,
  takeOrder
}

function getAllOrders() {
  const url = `${BASE_URL}/orders`;
  return axios.get(url)
    .then(response => response.data.map(order => {
      order.createdDate = new Date(order.createdDate + 'Z').toString();
      return order
    }))
}

function takeOrder(id) {
  const url = `${BASE_URL}/${id}/take`;
  axios.patch(url);
  // todo: удалить этот заказ из списка
}
