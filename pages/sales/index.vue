<template>
  <div class="screen-container">
    <div class="screen-food-1">
      <img src="food/burger.svg" alt="" />
    </div>
    <div class="screen-food-2">
      <img src="food/taco.svg" alt="" />
    </div>
    <div class="screen-table">
      <v-data-table
        :headers="headers"
        :items="sales"
        :items-per-page="10"
        :loading="loading"
        loading-text="Carregando..."
        no-data-text="Nenhuma venda encontrada"
        no-results-text="Nenhuma venda encontrada"
        :search="search"
        class="elevation-5"
        height="400"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Vendas do estabelecimento</v-toolbar-title>
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
            outlined
            color="teal darken-1"
            style="color: white"
            class="mr-2"
            @click="filterEntriesDialog = true"
          >
            Filtrar
            <v-icon class="ml-2" v-show="false">mdi-card-search-outline</v-icon>
          </v-btn>
          <v-btn
            color="teal darken-1"
            style="color: white"
            text
            @click="createSaleDialog = true"
          >
            Cadastrar venda
          </v-btn>
        </template>
      </v-data-table>
    </div>
    <div class="create-sale-dialog">
      <v-dialog v-model="createSaleDialog" persistent width="1000">
        <v-card class="sale-dialog">
          <v-card-title>Nova venda</v-card-title>
          <v-form ref="registerSale">
            <div class="form-container px-5">
              <v-row>
                <v-col cols="6">
                  <v-autocomplete
                    v-model="sale.customer"
                    :items="select.customers"
                    menu-props="auto"
                    label="Selecionar cliente"
                    no-data-text="Não há clientes cadastrados"
                    prepend-icon="mdi-account-box"
                    clearable
                    return-object
                    :rules="[rules.required]"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    v-model="sale.vendor"
                    :items="select.vendors"
                    menu-props="auto"
                    label="Selecionar vendedor"
                    hint="Caso não selecione nenhum, será atrelado ao vendedor logado"
                    no-data-text="Não há vendedores cadastrados"
                    :persistent-hint="true"
                    prepend-icon="mdi-card-account-details-outline"
                    clearable
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5">
                  <v-autocomplete
                    v-model="product.value"
                    :items="select.products"
                    menu-props="auto"
                    label="Selecionar produtos"
                    hint="Pelo menos um produto deve ser adicionado"
                    no-data-text="Não há produtos"
                    :persistent-hint="true"
                    prepend-icon="mdi-food"
                    :return-object="true"
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col cols="2" class="my-auto">
                  <v-btn
                    color="teal darken-1"
                    text
                    block
                    style="color: white"
                    @click="addProduct"
                  >
                    Adicionar
                    <v-icon class="ml-2"> mdi-plus </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="5" class="my-auto">
                  <v-select
                    prepend-icon="mdi-cash-multiple"
                    v-model="sale.payment_method"
                    disabled
                    :items="select.paymentMethods"
                    label="Selecionar método de pagamento"
                    hint="Por enquanto, aceitaremos apenas PIX"
                    no-data-text="Não há métodos de pagamento cadastrados"
                    persistent-hint
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    :items="product.items"
                    :headers="product.headers"
                    loading-text="Carregando..."
                    no-data-text="Nenhum produto adicionado"
                    no-results-text="Nenhum produto adicionado"
                    :hide-default-footer="true"
                    disable-sort
                  >
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-icon class="ml-auto" @click="increaseQuantity(item)">
                        mdi-plus
                      </v-icon>
                      <v-icon class="ml-4" @click="decreaseQuantity(item)">
                        mdi-minus
                      </v-icon>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            class="ml-4"
                            @dblclick="removeItem(item)"
                            v-on="on"
                            v-bind="attrs"
                            style="cursor: pointer"
                          >
                            mdi-delete-outline
                          </v-icon>
                        </template>
                        <span
                          >Clicar duas vezes para remover completamente este
                          produto</span
                        >
                      </v-tooltip>
                    </template>
                  </v-data-table>
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
            <v-btn color="teal darken-1" text @click="handleSaleConfirmation">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="confirm-action-dialog">
      <v-dialog v-model="confirmActionDialog" persistent width="400">
        <v-card>
          <v-card-title
            >Deseja
            {{
              action === "Confirmar" ? "confirmar a criação da" : "cancelar a"
            }}
            venda?</v-card-title
          >
          <v-card-text v-if="action === 'Confirmar'">
            Cliente: {{ sale.customer.text }} | Valor total:
            {{ value.format(totalSaleValue) }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="
                action === 'Confirmar'
                  ? (confirmActionDialog = false)
                  : cancelSale()
              "
            >
              {{ action === "Confirmar" ? "Cancelar" : "Sim " }}
            </v-btn>
            <v-btn
              color="teal darken-1"
              text
              @click="
                action === 'Confirmar'
                  ? addSale()
                  : (confirmActionDialog = false)
              "
            >
              {{ action === "Confirmar" ? "Confirmar" : "Não" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="confirm-action-dialog">
      <v-dialog v-model="filterEntriesDialog" width="800">
        <v-card>
          <v-card-title>Filtrar vendas</v-card-title>
          <div class="px-5">
            <v-row justify="start" align="center">
              <v-col cols="5" style="border-right: 1px solid teal">
                <v-date-picker
                  v-model="filter.date"
                  range
                  color="teal darken-1"
                  landscape
                  locale="pt-br"
                  no-title
                ></v-date-picker>
              </v-col>
              <v-col cols="6" class="ml-auto mr-5">
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="filter.customer"
                      :items="select.customers"
                      menu-props="auto"
                      label="Selecionar cliente"
                      no-data-text="Não há clientes cadastrados"
                      prepend-icon="mdi-account-box"
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="filter.vendor"
                      :items="select.vendors"
                      menu-props="auto"
                      label="Selecionar vendedor"
                      no-data-text="Não há vendedores cadastrados"
                      prepend-icon="mdi-card-account-details-outline"
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="filter.status"
                      :items="select.status"
                      menu-props="auto"
                      label="Selecionar status"
                      no-data-text="Não há status cadastrados"
                      prepend-icon="mdi-cart-check"
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="filterEntriesDialog = false"
            >
              Cancelar
            </v-btn>
            <v-btn text @click="clearFilters"> Limpar filtros </v-btn>
            <v-btn color="teal darken-1" text @click="filterSales">
              Filtrar
              <v-icon class="ml-2">mdi-card-search-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="edit-sale-dialog">
      <v-dialog v-model="editSaleDialog" persistent width="1000">
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
                <v-col cols="3" class="my-auto">
                  <v-select
                    v-model="edit.status"
                    :items="select.status"
                    label="Status da venda"
                    no-data-text="Não há nenhum status cadastrado"
                  >
                  </v-select>
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
            <v-btn
              color="red darken-1"
              text
              @click="editSaleDialog = false"
            >
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

export default {
  mixins: [formatter, rules, zipcode],
  async beforeMount() {
    const { id } = this.$route.params;
    await this.getSelects();
    await this.getTableData(id);
    this.loading = false;

    console.log(this.select.paymentMethods);
  },
  data() {
    return {
      edit: {
        customer: '',
        vendor: '',
        status: '',
        date: '',
        value: 0,
        cost: 0,
        products: '',
        headers: [
          {
            text: "Nome",
            value: "name"
          },
          {
            text: "Valor",
            value: "formattedValue"
          },
          {
            text: "Total",
            value: "formattedTotal"
          },
          {
            text: "Quantidade",
            value: "quantity"
          },
        ]
      },
      confirmActionDialog: false,
      createSaleDialog: false,
      editSaleDialog: false,
      filterEntriesDialog: false,
      loading: true,
      search: "",
      action: "",
      valid: undefined,
      filter: {
        customer: "",
        vendor: "",
        status: "",
        date: [],
      },
      sale: {
        customer: "",
        vendor: "",
        payment_method: "614cc396f4447eb6cc387565"
      },
      select: {
        customers: [],
        products: []
      },
      product: {
        value: "",
        items: [],
        headers: [
          {
            text: "Nome",
            value: "name"
          },
          {
            text: "Valor",
            value: "formattedValue"
          },
          {
            text: "Total",
            value: "formattedTotal"
          },
          {
            text: "Quantidade",
            value: "quantity"
          },
          {
            text: "Ações",
            value: "actions"
          }
        ]
      },
      headers: [
        {
          text: "Cliente",
          value: "client"
        },
        {
          text: "Data",
          value: "date"
        },
        {
          text: "Método de pagamento",
          value: "payment_method"
        },
        {
          text: "Valor",
          value: "value"
        },
        {
          text: "Ações",
          value: "actions"
        }
      ],
      sales: [],
      file: {
        object: undefined,
        content: undefined,
        field_count: 11
      },
      status: {
        text: "",
        value: ""
      }
    };
  },
  computed: {
    totalSaleValue() {
      let totalSaleValue = 0;
      if (this.product.items === undefined) return totalSaleValue;
      this.product.items.forEach(product => {
        totalSaleValue += product.total;
      });
      return totalSaleValue;
    }
  },
  methods: {
    async handleSaleEdit() {
      let status = this.edit.status
      const response = await this.$store.dispatch('sales/updateStatus', {
        status,
        id: this.edit.id,
      })
      if (response) {
        this.$toast.success('Status da venda alterado com sucesso', 'Sucesso')
        this.editSaleDialog = false;
        await this.reloadTable()
      } else {
        this.$toast.error('Não foi possível alterar o status da venda', 'Atenção')
      }
    },
    async openEditDialog(item) {
      console.log(item);
      const status = this.select.status.find(status => status.value === item.status)
      console.log(item.status, this.select.status, status)

      let cost = 0;
      item.products.forEach(product => {
        let productCost = product.cost.replace('R$', '').replace(',', '.')
        productCost = productCost.trim();
        cost += +productCost;
      })
      this.edit = {
        id: item.id,
        customer: item.client,
        date: item.date,
        payment_method: item.payment_method,
        value: item.value,
        status,
        cost: this.value.format(cost),
        products: item.products.map(product => {
          let productCost = product.value.replace('R$', '').replace(',', '.')
          productCost = productCost.trim();
          return {
            name: product.name,
            formattedValue: product.value,
            formattedTotal: this.value.format(+productCost * product.quantity),
            quantity: product.quantity,
          }
        }),
        headers: this.edit.headers,
        vendor: item.vendor.name,
      }

      this.editSaleDialog = true
    },
    async clearFilters() {
      this.filter = {
        customer: "",
        vendor: "",
        status: "",
        date: []
      };
      await this.reloadTable();
    },
    async filterSales() {
      console.log(this.filter);
      for (const [chave, valor] of Object.entries(this.filter)) {
        if (valor === null) this.filter[chave] = "";
      }
      if (this.filter.date.length !== 0) {
        this.filter.date = this.filter.date.sort();
      }
      if (
        this.filter.customer === "" &&
        this.filter.vendor === "" &&
        this.filter.status === "" &&
        this.filter.date.length === 0
      ) {
        this.$toast.warning(
          "Pelo menos um campo deve ser preenchido para filtrar as vendas",
          "Atenção"
        );
        return;
      }
      try {
        const response = await this.$store.dispatch(
          "sales/filter",
          this.filter
        );
        this.sales = this.formatSales(response.orders);
        this.filterEntriesDialog = false;
      } catch (error) {
        console.log(error);
        this.$toast.error("Não foi possível filtrar as vendas", "Atenção");
      }
    },
    handleSaleConfirmation() {
      let validForm = this.$refs.registerSale.validate();
      validForm =
        validForm &&
        this.product.items !== undefined &&
        this.product.items.length !== 0;

      if (validForm) {
        this.confirmActionDialog = true;
        this.action = "Confirmar";
      } else {
        if (this.$refs.registerSale.validate()) {
          this.$toast.warning(
            "Ao menos um produto deve ser adicionado para cadastrar a venda",
            "Atenção"
          );
        } else {
          this.$toast.warning(
            "Preencha todos os campos obrigatórios antes de prosseguir",
            "Atenção"
          );
        }
      }
    },
    async addSale() {
      const payload = this.formatSalePayload();
      const response = await this.$store.dispatch("sales/addSale", payload);
      if (response) {
        this.$toast.success("Venda cadastrada com sucesso", "Atenção");
        this.confirmActionDialog = false;
        this.createSaleDialog = false;
        this.sale = {
          customer: "",
          vendor: "",
          payment_method: ""
        };
        this.product.items = [];
        await this.reloadTable();
      } else {
        this.$toast.error("Não foi possível cadastrar a venda", "Erro");
        return;
      }
    },
    formatSalePayload() {
      const establishment_id = this.$store.getters[
        "establishments/establishment"
      ]?.id;
      const vendor = this.$store.getters["users/user"];
      let vendor_id;
      if (vendor != undefined) vendor_id = vendor.token;

      console.log(vendor, vendor_id);

      const status = this.select?.status?.find(
        status => status.text === "Pendente"
      );

      const value = this.getSaleValue();
      const payload = {
        user_id: this.sale.customer.value,
        payment_method_id: this.sale.payment_method,
        order_date: new Date(),
        establishment_id,
        vendor_id: this.sale.vendor != "" ? this.sale.vendor : vendor_id,
        status: status.value,
        products: this.product.items.map(product => {
          return {
            id: product.id,
            quantity: product.quantity
          };
        }),
        value
      };
      return payload;
    },
    getSaleValue() {
      let value = 0;
      this.product.items.forEach(product => {
        value += product.total;
      });
      return value;
    },
    async getSelects() {
      const {
        customers,
        products,
        vendors,
        paymentMethods,
        status
      } = await this.$store.dispatch("sales/getSelects");
      this.select.customers = customers;
      this.select.products = products.map(product => {
        return {
          text: product.name,
          value: product.value,
          id: product._id
        };
      });
      this.select.status = status.map(s => {
        return {
          text: s.value,
          value: s._id
        };
      });
      this.select.vendors = vendors;
      this.select.paymentMethods = paymentMethods.map(paymentMethod => {
        return {
          text: paymentMethod.name,
          value: paymentMethod._id
        };
      });
    },
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
    async getTableData(customer_id) {
      const establishment_id = this.$store.getters[
        "establishments/establishment"
      ]?.id;
      if (establishment_id !== undefined && establishment_id !== null) {
        const response = await this.$store.dispatch("sales/getSales", {
          establishment_id,
          customer_id
        });
        const { orders } = response;
        if (orders !== undefined) this.sales = this.formatSales(orders);
        else {
          // Falar que não foi possivel buscar as vendas e pedir para tentar novamente mais tarde
        }
      }
    },
    addProduct() {
      console.log(this.product.value);
      if (this.product.value.value !== undefined) {
        this.product.items.push({
          id: this.product.value.id,
          name: this.product.value.text,
          value: this.product.value.value,
          formattedValue: this.value.format(this.product.value.value),
          quantity: 1,
          formattedTotal: this.value.format(this.product.value.value),
          total: this.product.value.value
        });

        // remove the product from the select component
        this.select.products = this.select.products.filter(
          product => product.text !== this.product.value.text
        );
        this.product.value = {};
      } else {
        this.$toast.warning(
          "Selecione um produto antes de adicionar",
          "Atenção"
        );
      }
    },
    increaseQuantity(item) {
      const index = this.product.items.findIndex(
        product => product.name === item.name
      );
      if (index !== -1) {
        const product = this.product.items[index];
        product.quantity++;
        product.total = product.quantity * product.value;
        product.formattedTotal = this.value.format(product.total);
        this.product.items[index] = product;
      }
    },
    decreaseQuantity(item) {
      const index = this.product.items.findIndex(
        product => product.name === item.name
      );
      if (index !== -1) {
        const product = this.product.items[index];
        product.quantity--;
        product.total = product.quantity * product.value;
        product.formattedTotal = this.value.format(product.total);
        this.product.items[index] = product;
        if (product.quantity === 0) {
          this.product.items.splice(index, 1);
          this.select.products.push({
            text: product.name,
            value: product.value
          });
        }
      }
    },
    removeItem(item) {
      const index = this.product.items.findIndex(
        product => product.name === item.name
      );
      if (index !== -1) {
        const product = this.product.items[index];
        this.product.items.splice(index, 1);
        this.select.products.push({
          text: product.name,
          value: product.value
        });
      }
    },
    cancelSale() {
      this.sale = {
        customer: "",
        vendor: ""
      };
      this.product.items = [];
      this.product.value = "";
      this.confirmActionDialog = false;
      this.createSaleDialog = false;
    },
    formatSales(sales) {
      console.log(sales);
      return sales.map(sale => {
        console.log(sale);
        return {
          id: sale._id,
          date: this.formatISODate(sale.order_date),
          payment_method: sale.payment_method,
          products: this.formatProducts(sale.products),
          value: this.value.format(sale.value),
          client: sale.client.name,
          clientData: sale.client,
          status: sale.status,
          vendor: sale.vendor,
        };
      });
    },
    formatProducts(products) {
      return products.map(product => {
        product.value = this.value.format(product.value);
        product.cost = this.value.format(product.cost);
        return product;
      });
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