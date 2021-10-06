export default function ({ $axios, store }, inject) {

  const utilsAPI = $axios.create({
    'Content-Type': 'application/json'
  })

  const api = $axios.create({
    baseURL: 'http://localhost:4000',
    'Content-Type': 'application/json'
  })

  const nonAuth = ['/users/signin', '/users/signup', '/establishments/signup']

  api.interceptors.request.use(
    config => {
      if (!nonAuth.includes(config.url)) {
        const token = store.getters['users/user'].token
        config.headers.Authorization = token
      }
      return config
    },
    err => Promise.reject(err)
  )

  api.interceptors.response.use(
    response => response,
    err => Promise.reject(err)
  )

  inject('api', api)
  inject('utilsAPI', utilsAPI)
}