export const formatter = {
  data() {
    return {
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      percentage: new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    }
  },
  methods: {
    formatPhone(numbers) {
      if (numbers.length === 9) {
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 9)}`
      }
      if (numbers.length === 8) {
        return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`
      }
      return numbers
    },
    formatZipcode(zipcode) {
      if (zipcode.length === 8) return `${zipcode.slice(0, 5)}-${zipcode.slice(5, 8)}`
      return zipcode
    },
    formatISODate(date) {
      if (date === undefined || date === '') return ''
      let dateInfo = date.split('T')[0]
      let timeInfo = date.split('T')[1]
      
      timeInfo = timeInfo.substring(0, timeInfo.length - 8)

      const dates = dateInfo.split('-')
      return `${dates[2]}/${dates[1]}/${dates[0]} ${timeInfo}`
    },
  }
}