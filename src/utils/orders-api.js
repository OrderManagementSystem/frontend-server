import HTTP from "./http-common";

export function getAllOrders() {
  return HTTP.get('/orders').then(({data}) => data.content.map(order => {
    order.createdDate = new Date(order.createdDate + 'Z').toString();
    return order
  }))
}

export function getOrdersPage(page, size = 15) {
  return HTTP.get(`/orders?page=${page}&size=${size}`).then(({data}) => data.content.map(order => {
    order.createdDate = new Date(order.createdDate + 'Z').toString();
    return order
  }))
}

export function takeOrder(id) {
  return HTTP.patch(`/orders/${id}/take`)
}
