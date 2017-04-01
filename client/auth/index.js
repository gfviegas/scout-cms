const LOGIN_URL = `${process.env.API_URL}auth/`

export default {
  user: {
    authenticated: false
  },

  login (context, credentials) {
    return context.$http.post(LOGIN_URL, credentials)
  },

  signup (context, creds) {
  },

  logout () {
    return new Promise((resolve, reject) => {
      window.localStorage.removeItem('id_token')
      this.user.authenticated = false
      resolve(true)
    })
  },

  checkAuth () {
    const jwt = window.localStorage.getItem('id_token')
    if (jwt) {
      this.user.authenticated = true
      return true
    } else {
      this.user.authenticated = false
      return false
    }
  },

  setToken (token) {
    return new Promise((resolve, reject) => {
      this.user.authenticated = true
      window.localStorage.setItem('id_token', token)
      resolve(true)
    })
  },

  getToken () {
    return window.localStorage.getItem('id_token')
  },

  parseToken (token) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
  },

  checkPermission (permissions) {
    let token = this.getToken()
    if (!token) { return false }
    let payload = this.parseToken(token).data
    let perms = ['admin', ...permissions]
    return perms.some(v => payload.roles.includes(v))
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + window.localStorage.getItem('id_token')
    }
  }
}
