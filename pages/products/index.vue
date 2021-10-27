<template>
  <div class="screen-container">
    <div class="screen-food-1">
      <img src="food/taco.svg" alt="" />
    </div>
    <div class="screen-food-2">
      <img src="food/lamen.svg" alt="" />
    </div>
    <div class="screen-table">
      <v-data-table
        :headers="headers"
        :items="products"
        :items-per-page="10"
        :loading="loading"
        loading-text="Carregando..."
        no-data-text="Nenhum produto encontrado"
        no-results-text="Nenhum produto encontrado"
        :search="search"
        class="elevation-5"
        :footer-props="footerProps"
        height="400"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Produtos do estabelecimento</v-toolbar-title>
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
        </template>
        <template v-slot:no-results>
          Nenhum dado correspondente à pesquisa.
        </template>
        <template v-slot:[`footer.page-text`]>
          <v-btn
            color="teal darken-1"
            style="color: white"
            text
            @click="createProductDialog = true"
          >
            Cadastrar produto
          </v-btn>
        </template>
      </v-data-table>
    </div>
    <div class="create-product-dialog">
      <v-dialog v-model="createProductDialog" persistent width="1000">
        <v-card class="sale-dialog">
          <v-card-title>Novo produto</v-card-title>
          <v-form ref="registerProduct">
            <div class="form-container px-5">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.name"
                    label="Nome"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.code"
                    label="Código"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.category"
                    label="Categoria"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.value"
                    label="Valor"
                    :rules="[rules.required]"
                    v-money="money"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="fd.cost"
                    label="Custo"
                    :rules="[rules.required]"
                    v-money="money"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="
                confirmActionDialog = true;
                action = 'Cancelar';
              "
            >
              Cancelar
            </v-btn>
            <v-btn
              color="teal darken-1"
              text
              @click="handleProductConfirmation"
            >
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="confirm-action-dialog">
      <v-dialog v-model="confirmActionDialog" persistent width="450">
        <v-card>
          <v-card-title
            >Deseja
            {{
              action === "Confirmar" ? "confirmar a criação do" : "cancelar o"
            }}
            produto?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="
                action === 'Confirmar'
                  ? (confirmActionDialog = false)
                  : cancelProduct()
              "
            >
              {{ action === "Confirmar" ? "Cancelar" : "Sim " }}
            </v-btn>
            <v-btn
              color="teal darken-1"
              text
              @click="
                action === 'Confirmar'
                  ? addProduct()
                  : (confirmActionDialog = false)
              "
            >
              {{ action === "Confirmar" ? "Confirmar" : "Não" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="edit-sale-dialog">
      <v-dialog v-model="editProductDialog" persistent width="1000">
        <v-card class="sale-dialog">
          <v-card-title>Editar status da venda</v-card-title>
          <v-form ref="registerSale">
            <div class="form-container px-5">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.customer"
                    prepend-icon="mdi-account-box"
                    label="Nome do cliente"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.vendor"
                    prepend-icon="mdi-card-account-details-outline"
                    label="Nome do vendeddor"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3" class="my-auto">
                  <v-text-field
                    v-model="edit.payment_method"
                    prepend-icon="mdi-cash-multiple"
                    label="Método de pagamento"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="my-auto">
                  <v-text-field
                    v-model="edit.value"
                    prepend-icon="mdi-cash"
                    label="Valor total"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="my-auto">
                  <v-text-field
                    v-model="edit.cost"
                    prepend-icon="mdi-cash-register"
                    label="Custo"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    :items="edit.products"
                    :headers="edit.headers"
                    loading-text="Carregando..."
                    no-data-text="Nenhum produto adicionado"
                    no-results-text="Nenhum produto adicionado"
                    :hide-default-footer="true"
                    disable-sort
                  />
                </v-col>
              </v-row>
            </div>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="editProductDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="teal darken-1" text @click="handleSaleEdit">
              Confirmar
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
import { money } from "~/mixins/money";

export default {
  mixins: [formatter, rules, zipcode, money],
  async beforeMount() {
    await this.getTableData();
    this.loading = false;
  },
  data() {
    return {
      fd: {
        name: "",
        category: "",
        code: "",
        value: "",
        cost: "",
      },
      edit: {
        name: "",
        category: "",
        code: "",
        value: 0,
        cost: 0,
      },
      footerProps: {
        "items-per-page-text": "",
      },
      confirmActionDialog: false,
      createProductDialog: false,
      editProductDialog: false,
      loading: true,
      search: "",
      action: "",
      valid: undefined,
      product: {
        name: "",
        code: "",
        category: "",
        value: "",
        cost: "",
      },
      headers: [
        {
          text: "Nome",
          value: "name",
        },
        {
          text: "Código",
          value: "code",
        },
        {
          text: "Categoria",
          value: "category",
        },
        {
          text: "Valor",
          value: "value",
        },
        {
          text: "Custo",
          value: "cost",
        },
        {
          text: "Ações",
          value: "actions",
        },
      ],
      products: [],
      status: {
        text: "",
        value: "",
      },
    };
  },
  computed: {},
  methods: {
    cancelProduct() {
      this.fd = {
        name: '',
        cost: 0,
        value: 0,
        category: '',
        code: ''
      }
      this.confirmActionDialog = false
      this.createProductDialog = false
    },
    async addProduct() {
      let validForm = this.$refs.registerProduct.validate();
      if (validForm) {
        console.log(this.fd.value.replace('R$ ', ''), this.fd.cost)
        let value = this.currencyToValue(this.fd.value)
        let cost = this.currencyToValue(this.fd.cost)

        let payload = {
          product: {
            name: this.fd.name,
            code: this.fd.code,
            category: this.fd.category,
            value,
            cost,
          },
        };

        const response = await this.$store.dispatch(
          "products/addProduct",
          payload
        );
        if (response) {
          this.$toast.success("Produto adicionado com sucesso", "Atenção");
          await this.resetPage()
        }
      } else {
        this.$toast.error(
          "Por favor, preencha todos os campos para prosseguir",
          "Atenção"
        );
      }
    },
    async resetPage() {
      await this.reloadTable();
      this.confirmActionDialog = false;
      this.createProductDialog = false;
      this.fd = {
        name: "",
        category: "",
        code: "",
        value: "",
        cost: "",
      }
    },
    async handleSaleEdit() {
      let status = this.edit.status;
      const response = await this.$store.dispatch("sales/updateStatus", {
        status,
        id: this.edit.id,
      });
      if (response) {
        this.$toast.success("Status da venda alterado com sucesso", "Sucesso");
        this.editProductDialog = false;
        await this.reloadTable();
      } else {
        this.$toast.error(
          "Não foi possível alterar o status da venda",
          "Atenção"
        );
      }
    },
    async openEditDialog(item) {
      console.log(item);
      const status = this.select.status.find(
        (status) => status.value === item.status
      );
      console.log(item.status, this.select.status, status);

      let cost = 0;
      item.products.forEach((product) => {
        let productCost = product.cost.replace("R$", "").replace(",", ".");
        productCost = productCost.trim();
        cost += +productCost;
      });
      this.edit = {
        id: item.id,
        customer: item.client,
        date: item.date,
        payment_method: item.payment_method,
        value: item.value,
        status,
        cost: this.value.format(cost),
        products: item.products.map((product) => {
          let productCost = product.value.replace("R$", "").replace(",", ".");
          productCost = productCost.trim();
          return {
            name: product.name,
            formattedValue: product.value,
            formattedTotal: this.value.format(+productCost * product.quantity),
            quantity: product.quantity,
          };
        }),
        headers: this.edit.headers,
        vendor: item.vendor.name,
      };

      this.editProductDialog = true;
    },
    formatProducts(products) {
      return products.map((product) => {
        return {
          name: product.name,
          category: product.category,
          code: product.code,
          value: this.value.format(product.value),
          cost: this.value.format(product.cost),
          id: product._id,
        };
      });
    },
    handleProductConfirmation() {
      let validForm = this.$refs.registerProduct.validate();

      if (validForm) {
        this.confirmActionDialog = true;
        this.action = "Confirmar";
      } else {
        this.$toast.warning(
          "Preencha todos os campos obrigatórios antes de prosseguir",
          "Atenção"
        );
      }
    },
    async getTableData() {
      const establishment_id =
        this.$store.getters["establishments/establishment"]?.id;
      if (establishment_id !== undefined && establishment_id !== null) {
        const response = await this.$store.dispatch("products/getProducts", {
          establishment_id,
        });
        const { products } = response;
        if (products !== undefined)
          this.products = this.formatProducts(products);
        else {
          // Falar que não foi possivel buscar as vendas e pedir para tentar novamente mais tarde
        }
      }
    },
    async reloadTable() {
      await this.getTableData();
    },
  },
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

  .v-data-footer__select {
    visibility: hidden;
  }

  .v-toolbar__title {
    color: $primary;
  }

  .screen-food-1 {
    position: absolute;
    top: 30%;
    transform: translateY(-50%);
    left: 2.5%;

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