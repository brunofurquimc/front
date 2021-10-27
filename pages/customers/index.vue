<template>
  <div class="screen-container">
    <div class="screen-food-1">
      <img src="food/lamen.svg" alt="" />
    </div>
    <div class="screen-food-2">
      <img src="food/sushi.svg" alt="" />
    </div>
    <div class="screen-table">
      <v-data-table
        :headers="headers"
        :items="customers"
        :items-per-page="10"
        :loading="loading"
        loading-text="Carregando..."
        :search="search"
        no-data-text="Nenhum cliente encontrado"
        no-results-text="Nenhum cliente encontrado"
        class="elevation-5"
        height="400"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Clientes do estabelecimento</v-toolbar-title>
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pesquisar"
              single-line
              hide-details
            ></v-text-field> </v-toolbar
        ></template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="ml-auto edit" @click="openEditDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon class="ml-auto history" @click="openHistoryDialog(item)">
            mdi-history
          </v-icon>
        </template>
        <template v-slot:no-results>
          Nenhum dado correspondente à pesquisa.
        </template>
        <template v-slot:[`footer.page-text`]>
          <v-btn
            text
            color="teal darken-1"
            style="color: white"
            @click="uploadDialog = true"
          >
            Cadastrar clientes
          </v-btn>
        </template>
      </v-data-table>
    </div>
    <div class="screen-dialog">
      <v-dialog v-model="editDialog" persistent width="600">
        <v-card>
          <v-card-title>Editar dados do cliente</v-card-title>
          <v-form ref="edit" class="px-5 py-5">
            <v-row>
              <v-col>
                <v-text-field
                  id="register-name"
                  v-model="dialog.name"
                  label="Nome completo"
                  type="text"
                  :rules="[rules.required, rules.fullname]"
                  disabled
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="dialog.address.zipcode"
                  label="CEP"
                  :rules="[rules.required, rules.zipcode]"
                  v-mask="'#####-###'"
                  :loading="loadingZipcode"
                  @input="handleZipcodeInput(dialog)"
                >
                </v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="dialog.address.endereco"
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
                  v-model="dialog.address.number"
                  label="Número"
                  :rules="[rules.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="dialog.address.complement"
                  label="Complemento"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="dialog.phone"
                  label="Celular"
                  :rules="[rules.required]"
                  v-mask="'(##) #####-####'"
                  :loading="loadingZipcode"
                >
                </v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="dialog.email"
                  label="E-mail"
                  :rules="[rules.required, rules.email]"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="editDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="teal darken-1" text @click="edit"> Editar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="upload-dialog">
      <v-dialog v-model="uploadDialog" persistent width="600">
        <v-card>
          <v-card-title>Subir planilha de clientes</v-card-title>
          <v-row no-gutters justify="start" class="px-5">
            <v-col cols="12">
              <v-file-input
                :multiple="false"
                :accept="'.csv'"
                label="Arquivos .csv"
                prepend-icon="mdi-file-excel"
                v-model="file.object"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center" class="px-5">
            <v-col cols="6">
              <span>{{ file.content }}</span>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="uploadDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="teal darken-1" text @click="handleFileSubmission">
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="history-dialog">
      <v-dialog v-model="historyDialog" persistent width="440">
        <v-card>
          <v-card-title>Prosseguir para o histórico de compras?</v-card-title>
          <v-card-text>Você será redirecionado para a tela de vendas.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="historyDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="teal darken-1" text @click="purchaseHistory">
              Continuar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { formatter } from "~/mixins/formatter";
import { rules } from "~/mixins/rules";
import { zipcode } from "~/mixins/zipcode";

export default {
  mixins: [formatter, rules, zipcode],
  async beforeMount() {
    await this.getTableData()
    this.loading = false
  },
  data() {
    return {
      uploadDialog: false,
      editDialog: false,
      historyDialog: false,
      history: {
        name: '',
        id: ''
      },
      loading: true,
      search: "",
      headers: [
        {
          text: "Nome",
          value: "name"
        },
        {
          text: "E-mail",
          value: "email"
        },
        {
          text: "Celular",
          value: "phone"
        },
        {
          text: "Ações",
          value: "actions"
        }
      ],
      customers: [],
      dialog: {
        id: undefined,
        name: undefined,
        email: undefined,
        address: {
          zipcode: undefined,
          street: undefined,
          district: undefined,
          number: undefined,
          city: undefined,
          state: undefined,
          endereco: undefined // junção de city + state no formato: São Paulo (SP)
        },
        phone: undefined
      },
      file: {
        object: undefined,
        content: undefined,
        field_count: 11
      }
    };
  },
  methods: {
    async initializeFileObject() {
      const file = this.file.object;
      if (file) {
        return new Promise((resolve, reject) => {
          console.log(file, file.type);
          if (file.type !== "text/csv") {
            return resolve({
              error: true,
              message: "Tipo de arquivo não suportado, envie um .csv!"
            });
          }
          const reader = new FileReader();
          reader.readAsText(file, "latin-1");
          reader.onload = function(evt) {
            return resolve({
              content: evt.target.result
            });
          };
          reader.onerror = function(error) {
            return resolve({
              error,
              message: "Erro de leitura do arquivo."
            });
          };
        });
      }
      return new Promise((resolve, reject) => {
        return resolve({
          error: true,
          message: "Não foi possível abrir o arquivo."
        });
      });
    },
    async handleFileSubmission() {
      const response = await this.initializeFileObject();
      console.log(response);
      if (response.content !== undefined) {
        this.$toast.success("Arquivo recebido com sucesso!", "Atenção");
        this.showData(response.content);
        this.uploadDialog = false;
      } else {
        if (response.error) {
          this.$toast.error(response.message, "Erro");
        }
      }
    },
    showData(content) {
      const split = content.split("\n");
      let headers = [];
      let columns = []
      let data = {}
      split.forEach((row, index) => {
        if (index === 0) {
          headers = row.split(",/").map(element => element.replaceAll('"', '').replaceAll('/', ''))[0].split(',');
        }
        else {
          columns = row.split(",/").map(element => element.replaceAll('"', '').replaceAll('/', ''))[0].split(',');
          let endereco = ''
          columns.forEach((column, cIndex) => {
            if (cIndex > 1 && cIndex < 9) endereco = `${endereco}, ${column}`
          })
          let headerIndex = 0;
          columns.forEach((column, cIndex) => {
            console.log(column, headers[cIndex])
            if (data[index] === undefined) data[index] = {}
            if (data[index][headers[headerIndex]] === undefined) {
              if (headerIndex == 2) {
                data[index][headers[headerIndex]] = endereco
              }
              else if (cIndex < 2 || cIndex > 8) data[index][headers[headerIndex]] = column.replaceAll('"', "").replaceAll("/", "")
            }
            headerIndex++;
          });
        }
      });
      console.log(data)
    },
    async getTableData() {
      const establishment_id = this.$store.getters[
        "establishments/establishment"
      ]?.id;
      if (establishment_id !== undefined && establishment_id !== null) {
        const response = await this.$store.dispatch(
          "users/getCustomers",
          establishment_id
        );
        const { customers } = response;
        if (customers !== undefined) this.formatCustomers(customers);
        else {
          // Falar que não foi possivel buscar os vendedores e pedir para tentar novamente mais tarde
        }
      }
    },
    formatCustomers(customers) {
      this.customers = customers.map(customer => {
        customer.phone = `(${customer.phone.area_code}) ${this.formatPhone(
          customer.phone.number
        )}`;
        console.log(customer);
        return customer;
      });
    },
    fillDialogFormData(customer) {
      this.dialog.email = customer.email;
      this.dialog.address = customer.address;
      this.dialog.address.zipcode = this.formatZipcode(
        this.dialog.address.zip_code
      );

      delete this.dialog.address.zip_code;
      this.dialog.phone = `(${customer.phone.area_code}) ${this.formatPhone(
        customer.phone.number
      )}`;
      this.dialog.address.endereco = `${customer.address.street}, ${customer.address.district} - ${customer.address.city} (${customer.address.state})`;
    },
    async openEditDialog({ id, name }) {
      (this.dialog = {
        id,
        name,
        email: undefined,
        address: {
          zipcode: undefined,
          street: undefined,
          district: undefined,
          number: undefined,
          city: undefined,
          state: undefined,
          endereco: undefined // junção de city + state no formato: São Paulo (SP)
        },
        phone: undefined
      }),
        (this.editDialog = true);
      await this.getCustomer(id);
    },
    async openHistoryDialog({ id, name }) {
      this.historyDialog = true
      this.history.name = name
      this.history.id = id
    },
    purchaseHistory() {
      this.$router.push({
        name: 'sales',
        params: {
          id: this.history.id
        }
      })
    },
    async edit() {
      const valid = this.$refs.edit.validate();
      if (!valid) {
        this.$toast.warning("Preencha os campos para prosseguir", "Atenção");
        return;
      } else {
        const payload = this.formatPayload(this.dialog);
        console.log(payload);
        const response = await this.$store.dispatch(
          "users/editCustomer",
          payload
        );
        console.log(response);
        if (response.error !== null) {
          this.$toast.error(response.message, "Atenção");
        } else {
          this.$toast.success(response.message, "Sucesso");
          await this.reloadTable();
        }
        this.editDialog = false;
      }
    },
    formatPayload(formData) {
      const payload = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        password: formData.password
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
    async getCustomer(id) {
      const response = await this.$store.dispatch("users/getCustomer", id);
      const { customer } = response;
      if (customer !== undefined) this.fillDialogFormData(customer);
      else {
        // cliente nao encontrado, tentar novamente mais tarde
      }
    },
    async reloadTable() {
      await this.getTableData();
    }
  }
};
</script>

<style lang="scss">
.screen-container {
  height: 100%;
  width: 100%;

  .v-data-table--fixed-height .v-data-table__wrapper {
    tbody {
      tr:hover {
        background-color: $primary !important;
        color: white !important;
        cursor: pointer;

        .v-icon.v-icon.v-icon--link {
          color: white;
        }
      }
    }
  }

  .v-toolbar__title {
    color: $primary;
  }

  .screen-food-1 {
    position: absolute;
    top: 30%;
    transform: translateY(-50%);
    left: 0px;

    img {
      width: 50%;
    }
  }

  .screen-food-2 {
    position: absolute;
    top: 70%;
    transform: translateY(-50%);
    left: 82.5%;

    img {
      width: 90%;
    }
  }

  .screen-table {
    position: relative;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    border-radius: 24px;
  }
}
</style>