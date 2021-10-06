export const state = () => ({
  generalInfo: undefined,
})

export const mutations = {
  setGeneralInfo: (state, info) => state.info = info,
}

export const actions = {
  async getGeneralInfo(store) {
    console.log(store)
    try {
      const response = await this.$api.$post(
        `/reports/orders/info`,
        {}
      )
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

export const getters = {
  
}
