import yid from '@src/library'
import config from '@src/config'

export function login(params) {
  const login = 'api-uaa/oauth/user/token'
  //console.log(config.SYSTEM);
  // xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(config.CLIENTID + ":" + config.clientSecret)
  let formParams = yid.util.jsToFormData(params)
  console.log(config.SYSTEM.CLIENTID + ':' + config.SYSTEM.CLIENTSECRET)
  return yid.http.post(login, formParams, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      authorization:
        'Basic ' +
        window.btoa(config.SYSTEM.CLIENTID + ':' + config.SYSTEM.CLIENTSECRET)
    }
  })
}

export function logout() {
  return yid.http.post(`api-uaa/oauth/remove/token`)
}

export default {
  /** 登录 */
  login,
  logout
}
