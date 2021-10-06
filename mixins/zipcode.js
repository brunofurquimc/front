export const zipcode = {
  data() {
    return {
      loadingZipcode: false,
    }
  },
  methods: {
    async handleZipcodeInput(fd) {
      if (fd === undefined) return;
      let value = fd.address.zipcode;
      if (!!value && value.length === 9) {
        const response = await this.$store.dispatch("utils/getZipcode", value);
        if (typeof response.erro == "undefined")
          this.handleViaCepResponse(response, fd);
        else {
          // notificar usuario e pedir para trocar o cep
          this.$toast.warning("CEP inválido informado", "Atenção");
          fd.address.zipcode = undefined;
        }
        this.loadingZipcode = false;
      }
    },
    handleViaCepResponse(response, fd) {
      if (fd === undefined) return;
      fd.address = {
        zipcode: response.cep,
        endereco: `${response.logradouro}, ${response.bairro} - ${response.localidade} (${response.uf})`,
        street: response.logradouro,
        district: response.bairro,
        city: response.localidade,
        state: response.uf
      };
      fd.phone = `(${response.ddd})`;
    }
  }
}