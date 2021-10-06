const defaultErrorReturn = (error) => {
  return {
    error: error.response.data.message,
    status: error.response.status
  }
}

export const state = () => ({
  user: undefined,
})

export const mutations = {
  setUser: (state, user) => {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  logout: (state, router) => {
    state.user = undefined
    localStorage.removeItem('user')
    router.push({
      path: '/auth'
    })
  }
}

export const actions = {
  async signin({ commit }, payload) {
    console.log(payload)
    try {
      const response = await this.$api.post('/users/signin', payload)
      console.log(response)
      let user = {
        token: response.data.token,
        name: response.data.name,
      }
      commit('setUser', user)
      commit('establishments/setEstablishment', response.data.establishment, { root: true })
      return Promise.resolve(response)
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
  async signup({ commit }, payload) {
    try {
      const response = await this.$api.$post(
        `/users/signup`,
        payload
      )
      console.log(response)
      let user = {
        token: response.token,
        name: response.name,
      }
      commit('setUser', user)
      commit('establishments/setEstablishment', response.establishment, { root: true })
      return Promise.resolve(response)
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
}

export const getters = {
  user: state => state.user || localStorage.getItem('user'),
}
