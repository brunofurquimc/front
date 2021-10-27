import { VMoney } from 'v-money'

export const money = {
  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2,
        masked: true
      }
    }
  },
  directives: {
    money: VMoney,
  }
}