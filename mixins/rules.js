export const rules = {
  data() {
    return {
      rules: {
        required: value => !!value || "Campo obrigatório",
        min: value => (!!value && value.length >= 8) || "Mínimo 8 caracteres",
        uppercase: value =>
          (!!value && /(?=.*?[A-Z])/.test(value)) ||
          "Mínimo uma letra maiuscula",
        lowercase: value =>
          (!!value && /(?=.*?[a-z])/.test(value)) ||
          "Mínimo uma letra minuscula",
        number: value =>
          (!!value && /(?=.*?[0-9])/.test(value)) || "Mínimo um digito",
        special: value =>
          (!!value && /(?=.*?[#?!@$%^&*-])/.test(value)) ||
          "Mínimo um símbolo (#?!@$%^&*-)",
        zipcode: value =>
          (!!value && value.length >= 8) || "Deve conter 8 caracteres",
        email: value =>
          (!!value && /(.+)@(.+){2,}\.(.+){2,}/.test(value)) ||
          "E-mail inválido",
        fullname: value =>
          (!!value &&
            /^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,}$/.test(value) &&
            value.includes(" ")) ||
          "Nome completo inválido",
        establishmentName: value =>
          (!!value && /^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,}$/.test(value)) ||
          "Campo obrigatório",
        match: value =>
          (!!value && value === this.fd.password) ||
          "Senha e confirmação devem ser iguais"
      },
    }
  }
}