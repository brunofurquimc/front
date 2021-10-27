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
  async getCustomers({ commit }, establishment_id) {
    try {
      const response = await this.$api.$get(`/users/customers?establishment=${establishment_id}`);
      console.log(response);
      return Promise.resolve(response);
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
  async getCustomer({ commit }, customer_id) {
    try {
      const response = await this.$api.$get(`/users/customer?customer=${customer_id}`);
      console.log(response);
      return Promise.resolve(response);
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
  async editCustomer({ commit }, payload) {
    try {
      const response = await this.$api.$post('/users/editCustomer', payload);
      return Promise.resolve(response);
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
  async getVendors({ commit }, establishment_id) {
    try {
      const response = await this.$api.$get(`/users/vendors?establishment=${establishment_id}`)
      console.log(response)
      return Promise.resolve(response)
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
  async getVendor({ commit }, vendor_id) {
    try {
      const response = await this.$api.$get(`/users/vendor?vendor=${vendor_id}`);
      console.log(response)
      return Promise.resolve(response)
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
  async editVendor({ commit }, payload) {
    try {
      const response = await this.$api.$post('/users/editVendor', payload);
      return Promise.resolve(response)
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  },
  async deleteVendor({ commit }, id) {
    try {
      const response = await this.$api.$post('/users/deleteVendor', { id });
      return Promise.resolve(response);
    } catch (error) {
      console.log(error, error.response)
      return defaultErrorReturn(error)
    }
  }
}

export const getters = {
  user: state => state.user || localStorage.getItem('user'),
}
