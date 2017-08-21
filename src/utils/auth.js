export function getHeader() {
  const tokenData = JSON.parse(window.localStorage.getItem('authUser'));

  return {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + tokenData.access_token
  }
}
