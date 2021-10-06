export const actions = {
  async getZipcode(store, zipcode) {
    try {
      const response = await this.$utilsAPI.$get(
        `https://viacep.com.br/ws/${zipcode}/json/`
      )
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
}