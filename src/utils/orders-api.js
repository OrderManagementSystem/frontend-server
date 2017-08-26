import HTTP from "./http-common";

export function getOrdersPage(page, size = 15) {
  return HTTP.get(`/orders?page=${page}&size=${size}`).then(({data}) => data.map(order => {
    order.createdDate = new Date(order.createdDate + 'Z').toString();
    return order
  }))
}

export function getUserOrdersPage(userId, page, size = 15) {
  return HTTP.get(`users/${userId}/orders?page=${page}&size=${size}`).then(({data}) => data.map(order => {
    order.createdDate = new Date(order.createdDate + 'Z').toString();
    return order
  }))
}

export function takeOrder(id) {
  return HTTP.patch(`/orders/${id}/take`)
}

export function passOrder(id) {
  return HTTP.patch(`/orders/${id}/pass`)
}

export function acceptOrder(id) {
  return HTTP.patch(`/orders/${id}/accept`)
}

export function publishOrder(description, price) {
  return HTTP.post('/orders', {description, price}).then(({data}) => {
    data.createdDate = new Date(data.createdDate + 'Z').toString();
    return data;
  })
}
