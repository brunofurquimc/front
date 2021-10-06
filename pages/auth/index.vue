<template>
  <v-container id="login-container">
    <section id="splash-section">
      <div class="splash-image">
        <v-carousel
          cycle
          hide-delimiter-background
          :show-arrows="false"
          height="500"
        >
          <v-carousel-item v-for="(splash, i) in splashes" :key="i">
            <v-row align="center" justify="center">
                <v-col cols="auto">
                  <span class="splash-image-text">{{ splash.text }}</span>
                </v-col>
              </v-row>
            <v-sheet height="100%" color="transparent">
              <v-row
                class="carousel"
                align="center"
                justify="center"
                no-gutters
              >
                <v-col cols="auto">
                  <v-img :src="splash.src" :width="i != 2 ? 300 : 200"></v-img>
                </v-col>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </div>
    </section>
    <section id="login-section">
      <div class="text mx-auto">
        <v-row justify="center" align="center" no-gutters>
          <v-col cols="auto">
            <span>Seja bem-vindo ao del.io!</span>
          </v-col>
        </v-row>
      </div>
      <v-expand-transition>
        <v-card
          class="mx-auto login-box"
          max-width="600px"
          v-if="!showRegister & !showEstablishmentRegister"
        >
          <v-card-title>Login de colaborador</v-card-title>
          <div class="login-body">
            <v-form ref="signIn">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="fd.email"
                    label="E-mail"
                    :rules="[rules.required, rules.email]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="fd.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      rules.required,
                      rules.uppercase,
                      rules.lowercase,
                      rules.number,
                      rules.special,
                      rules.min,
                    ]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Senha"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </div>
          <v-card-actions>
            <v-btn text color="grey darken-1" @click="showRegister = true">
              Cadastre-se aqui
            </v-btn>
            <v-btn text color="teal" @click="handleSignIn" class="ml-auto">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
      <v-expand-transition>
        <v-card
          v-if="showRegister && !showEstablishmentRegister"
          max-width="600px"
          class="mx-auto register-box"
        >
          <v-card-title>Cadastro de colaborador</v-card-title>
          <div class="register-body-first" v-if="currentRegisterStep == 0">
            <v-form ref="signUp">
              <v-row>
                <v-col>
                  <v-text-field
                    id="register-name"
                    v-model="fd.name"
                    label="Nome completo"
                    type="text"
                    :rules="[rules.required, rules.fullname]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="fd.email"
                    label="E-mail"
                    :rules="[rules.required, rules.email]"
                  >
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="fd.establishment"
                    label="Nome do estabelecimento"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="fd.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      rules.required,
                      rules.uppercase,
                      rules.lowercase,
                      rules.number,
                      rules.special,
                      rules.min,
                    ]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Senha"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="fd.confirmPassword"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      rules.required,
                      rules.uppercase,
                      rules.lowercase,
                      rules.number,
                      rules.special,
                      rules.min,
                      rules.match,
                    ]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Confirmação de senha"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </div>
          <div
            class="register-body-second"
            v-else-if="currentRegisterStep == 1"
          >
            <v-form ref="address">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.address.zipcode"
                    label="CEP"
                    :rules="[rules.required, rules.zipcode]"
                    v-mask="'#####-###'"
                    :loading="loadingZipcode"
                    @input="handleZipcodeInput(fd)"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="fd.address.endereco"
                    label="Endereço"
                    disabled
                    :loading="loadingZipcode"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.address.number"
                    label="Número"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="fd.address.complement"
                    label="Complemento"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.phone"
                    label="Celular"
                    :rules="[rules.required]"
                    v-mask="'(##) #####-####'"
                    :loading="loadingZipcode"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </div>
          <v-card-actions>
            <v-btn text color="grey darken-1" @click="handleGoBack">
              <span v-if="currentRegisterStep >= 1">Voltar</span>
              <span v-else>Fazer login</span>
            </v-btn>
            <v-btn text color="teal" @click="handleSignUp" class="ml-auto">
              <span v-if="currentRegisterStep < 1">Próximo</span>
              <span v-else>Cadastrar</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
      <v-expand-transition>
        <v-card
          v-if="showEstablishmentRegister"
          max-width="600px"
          class="mx-auto register-box"
        >
          <v-card-title>Cadastro de estabelecimento</v-card-title>
          <div class="register-body-first">
            <v-form ref="establishmentSignUp">
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    id="register-name"
                    v-model="fd.name"
                    label="Nome do estabelecimento"
                    type="text"
                    :rules="[rules.required, rules.establishmentName]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.phone"
                    label="Celular"
                    :rules="[rules.required]"
                    v-mask="'(##) #####-####'"
                    :loading="loadingZipcode"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="fd.address.zipcode"
                    label="CEP"
                    :rules="[rules.required, rules.zipcode]"
                    v-mask="'#####-###'"
                    :loading="loadingZipcode"
                    @input="handleZipcodeInput(fd)"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="9">
                  <v-text-field
                    v-model="fd.address.endereco"
                    label="Endereço"
                    disabled
                    :loading="loadingZipcode"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    id="numero"
                    v-model="fd.address.number"
                    label="Número"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="9">
                  <v-text-field
                    id="complemento"
                    v-model="fd.address.complement"
                    label="Complemento"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </div>
          <v-card-actions>
            <v-btn
              text
              color="teal"
              @click="handleEstablishmentSignUp"
              class="ml-auto"
            >
              <span v-if="currentRegisterStep < 1">Próximo</span>
              <span v-else>Cadastrar</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
      <div id="establishment-signup" :class="{ 'marginTop': showRegister || showEstablishmentRegister }">
        <v-btn
          v-if="!showEstablishmentRegister"
          text
          color="teal"
          @click="showEstablishmentRegister = true"
        >
          Clique aqui para cadastrar seu estabelecimento!
        </v-btn>
        <v-btn
          v-else
          text
          color="teal"
          @click="showEstablishmentRegister = false"
        >
          Já cadastrou seu estabelecimento? Acesse o sistema aqui!
        </v-btn>
      </div>
      <div id="logo" :class="{ fixHeight: showRegister || showEstablishmentRegister }">
        <v-img src="logo/logo_light.svg"></v-img>
      </div>
    </section>
  </v-container>
</template>

<script>
import { rules } from '~/mixins/rules.js';
import { zipcode } from '~/mixins/zipcode.js';

export default {
  mixins: [rules, zipcode],
  layout: "auth",
  async mounted() {
  },
  data() {
    return {
      loadingZipcode: false,
      currentRegisterStep: 0,
      showPassword: false,
      showRegister: false,
      showEstablishmentRegister: false,
      fd: {
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        establishment: undefined,
        address: {
          zipcode: undefined,
          street: undefined,
          district: undefined,
          number: undefined,
          city: undefined,
          state: undefined,
          local: undefined // junção de city + state no formato: São Paulo (SP)
        },
        phone: undefined
      },
      splashes: [
        {
          text: "Gerencie suas vendas",
          src: "auth/manage_sales.svg"
        },
        {
          text: "Analise dados da operação",
          src: "auth/operation_info.svg"
        },
        {
          text: "Exporte relatórios",
          src: "auth/export_reports.svg"
        }
      ]
    };
  },
  methods: {
    resetForms() {
      this.fd = {
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        establishment: undefined,
        address: {
          zipcode: undefined,
          street: undefined,
          district: undefined,
          number: undefined,
          city: undefined,
          state: undefined,
          local: undefined // junção de city + state no formato: São Paulo (SP)
        },
        phone: undefined
      }
    },
    async handleEstablishmentSignUp() {
      let valid = this.$refs.establishmentSignUp.validate();

      if (valid) {
        const payload = this.formatEstablishmentPayload(this.fd);
        const response = await this.$store.dispatch(
          "establishments/signup",
          payload
        );
        if (response.error == undefined) {
          this.$toast.success(
            "Estabelecimento cadastrado com sucesso",
            "Atenção"
          );
          this.showEstablishmentRegister = false
          this.showRegister = true
          this.resetForms()
        } else {
          this.$toast.error(response.error, "Atenção");
        }
      } else {
        this.$toast.warning(
          "Preencha os campos obrigatórios para prosseguir",
          "Atenção"
        );
      }
    },
    async handleSignUp() {
      let valid = false;
      if (this.currentRegisterStep == 0) valid = this.$refs.signUp.validate();
      else valid = this.$refs.address.validate();

      if (valid) {
        if (this.currentRegisterStep == 0) this.currentRegisterStep++;
        else {
          const payload = this.formatPayload(this.fd);
          const response = await this.$store.dispatch("users/signup", payload);
          if (response.error == undefined) {
            this.$router.push({
              path: "/dashboard"
            });
          } else {
            this.$toast.error(response.error, "Atenção");
          }
        }
      } else {
        this.$toast.warning(
          "Preencha os campos obrigatórios para prosseguir",
          "Atenção"
        );
      }
    },
    async handleSignIn() {
      let valid = this.$refs.signIn.validate();

      if (valid) {
        const payload = {
          email: this.fd.email,
          password: this.fd.password
        };
        const response = await this.$store.dispatch("users/signin", payload);
        if (response.error == undefined) {
          this.$router.push({
            path: "/dashboard"
          });
        } else {
          this.$toast.error(response.error, "Atenção");
        }
      } else {
        this.$toast.warning(
          "Preencha os campos obrigatórios para prosseguir",
          "Atenção"
        );
      }
    },
    formatPayload(formData) {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        establishment: formData.establishment,
      };

      const address = formData.address;

      payload.address = {
        zip_code: address.zipcode.replace("-", ""),
        street: address.street,
        district: address.district,
        number: address.number,
        city: address.city,
        state: address.state,
        complement: address.complement
      };

      payload.phone = {
        area_code: formData.phone.substring(1, 3),
        number: formData.phone
          .substring(5, formData.phone.length)
          .replace("-", "")
      };

      return payload;
    },
    formatEstablishmentPayload(formData) {
      const payload = {
        name: formData.name
      };

      const address = formData.address;

      payload.address = {
        zip_code: address.zipcode.replace("-", ""),
        street: address.street,
        district: address.district,
        number: address.number,
        city: address.city,
        state: address.state,
        complement: address.complement
      };

      payload.phone = {
        area_code: formData.phone.substring(1, 3),
        number: formData.phone
          .substring(5, formData.phone.length)
          .replace("-", "")
      };

      return payload;
    },
    handleGoBack() {
      if (this.currentRegisterStep == 0) {
        this.showRegister = false;
        return;
      }
      this.currentRegisterStep--;
    },
  },
  watch: {
    showRegister() {
      this.resetForms()
    },
    showEstablishmentRegister() {
      this.resetForms()
    }
  }
};
</script>

<style lang="scss">
#login-container {
  max-width: 100%;
  height: 100%;
  padding: 0;
  display: flex;

  #splash-section {
    background-color: $primary;
    width: 35%;
    height: 100%;

    .splash-image {
      position: relative;
      top: 11%;

      .carousel {
        margin-top: 64px;
      }

      .splash-image-text {
        font-size: 24px;
        text-align: center;
        color: $primaryBG;
        font-weight: bold;
      }
    }
  }

  #login-section {
    background-color: $primaryBG;
    width: 65%;
    height: 100%;

    .v-card__title {
      color: $primary !important;
    }

    .text {
      position: relative;
      top: 10%;
      color: $primary;
      font-size: 36px;
      font-weight: bold;
    }

    .login-box {
      position: relative;
      top: 45%;
      transform: translateY(-45%);

      .login-body {
        padding: 16px;
      }
    }

    .register-box {
      position: relative;
      top: 45%;
      transform: translateY(-45%);

      .register-body-first,
      .register-body-second,
      .register-body-third {
        padding: 16px;
      }
    }

    #logo {
      height: 150px;
      width: 150px;
      position: relative;
      left: 72.5%;
      bottom: 35%;
      z-index: 10;
    }

    #establishment-signup {
      position: relative;
      display: inline-block;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
    }

    .marginTop {
      top: 22.5% !important;
    }

    .fixHeight {
      bottom: 55% !important;
    }
  }
}
</style>