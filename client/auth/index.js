// import router from '../router'

// const API_URL = 'http://localhost:3001/'
// const LOGIN_URL = API_URL + 'auth/'
// const SIGNUP_URL = API_URL + 'users/'

export default {
  user: {
    authenticated: true,
    name: 'Gustavo Viegas'
  },

  login (context, creds, redirect) {
  },

  signup (context, creds, redirect) {
  },

  logout () {
    window.localStorage.removeItem('id_token')
    this.user.authenticated = false
  },

  checkAuth () {
    var jwt = window.localStorage.getItem('id_token')
    if (jwt) {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + window.localStorage.getItem('id_token')
    }
  }
}
