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

export const bages = new Map([
  ['WAITING', {
    icon: 'new_releases',
    tooltip: 'Новый заказ'
  }],
  ['IN_PROGRESS', {
    icon: 'fast_forward',
    tooltip: 'Заказ выполняется'
  }],
  ['READY', {
    icon: 'done',
    tooltip: 'Заказ выполнен и ожидает оплаты'
  }],
  ['COMPLETED', {
    icon: 'done_all',
    tooltip: 'Заказ выполнен и оплачен'
  }]
]);
