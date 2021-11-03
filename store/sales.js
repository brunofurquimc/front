export const state = () => ({
  sales: undefined,
})

export const mutations = {
  setSales: (state, sales) => state.sales = sales,
}

export const actions = {
  async updateStatus(store, payload) {
    try {
      const response = await this.$api.post('/orders/editStatus', payload)
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async filter(store, payload) {
    try {
      const response = await this.$api.$post('/orders/filter', payload)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async addSale(store, payload) {
    try {
      const response = await this.$api.$post('/orders/add', payload);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getSales(store, payload) {
    const { establishment_id, customer_id } = payload
    try {
      let url = `/orders/establishment?establishment=${establishment_id}`
      if (customer_id !== undefined) url = `${url}&customer=${customer_id}`
      const response = await this.$api.$get(url)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getSelects() {
    try {
      const { customers } = await this.$api.$get('/list/users');
      const { vendors } = await this.$api.$get('/list/vendors');
      const { products } = await this.$api.$get('/list/products');
      const { status } = await this.$api.$get('/list/status');
      const { paymentMethods } = await this.$api.$get('/list/paymentMethods');
      return Promise.resolve({
        customers,
        vendors,
        products,
        status,
        paymentMethods,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const getters = {

}
