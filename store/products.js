
export const actions = {
  async getProducts() {
    try {
      const response = await this.$api.$get('/products/getProducts');
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addProduct(store, payload) {
    try {
      const response = await this.$api.$post('/products/addProduct', payload)
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
