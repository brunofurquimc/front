
export const actions = {
  async getReport(store, payload) {
    try {
      const response = await this.$api.$post(`/reports/${payload.key}`, payload.date);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
}
