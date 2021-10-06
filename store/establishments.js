export const state = () => ({
  establishment: undefined,
})

export const mutations = {
  setEstablishment: (state, establishment) => {
    state.establishment = establishment
    localStorage.setItem('establishment', JSON.stringify(establishment))
  },
}

export const actions = {
  async signup({ commit }, payload) {
    try {
      const response = await this.$api.$post(
        `/establishments/signup`,
        payload
      )
      console.log(response)
      commit('setEstablishment', response.token)
      return Promise.resolve(response)
    } catch (error) {
      console.log(error, error.response)
      return {
        error: error.response.data.message,
        status: error.response.status
      }
    }
  },
}

export const getters = {
  establishment: state => state.establishment || JSON.parse(localStorage.getItem('establishment')),
}
