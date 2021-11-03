<template>
  <div id="dashboard-container">
    <div class="filter-dialog">
      <v-dialog v-model="filter.dialog" persistent width="400">
        <v-card class="sale-dialog">
          <v-card-title>Filtrar dados da operação</v-card-title>
          <v-form ref="filter">
            <div class="form-container px-5">
              <v-row justify="center">
                <v-col cols="auto">
                  <v-date-picker
                    v-model="filter.date"
                    range
                    color="teal darken-1"
                    landscape
                    locale="pt-br"
                    no-title
                  ></v-date-picker>
                </v-col>
              </v-row>
            </div>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="filter.dialog = false; filter.date = []"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="teal darken-1"
              text
              @click="filterOrders"
            >
              Filtrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="statistics">
      <v-row justify="center" class="dashboard-cards">
        <v-col cols="auto">
          <v-card
            height="120"
            width="220"
            hover
            loader-height="5"
            @mouseenter="filterCard.scale = true"
            @mouseleave="filterCard.scale = false"
            @click="filter.dialog = true"
            :style="filterCard.scale ? { transform: 'scale(1.05)' } : {}"
          >
            <v-app-bar flat color="rgba(0, 0, 0, 0)" class="fill-height">
              <v-icon class="mr-4">{{ filterCard.icon }}</v-icon>
              <v-toolbar-title class="text-h6 pl-0 v-toolbar-title">
                {{ filterCard.title }}
              </v-toolbar-title>
            </v-app-bar>
            <v-card-text class="dashboard-card-text">
              <v-row justify="end" no-gutters>
                <v-col cols="auto">
                  <span>
                    {{ filterCard.value }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions v-if="loading_dashboard_cards">
              <v-progress-linear
                indeterminate
                height="5"
                class="mt-auto"
              ></v-progress-linear>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col
          cols="auto"
          v-for="(card, index) in dashboard_cards"
          :key="index"
          :class="{ hide: card.value == undefined || card.value == '' }"
        >
          <v-card
            v-if="card.value != undefined && card.value != ''"
            height="120"
            width="220"
            hover
            loader-height="5"
            @mouseenter="card.scale = true"
            @mouseleave="card.scale = false"
            :style="card.scale ? { transform: 'scale(1.05)' } : {}"
          >
            <v-app-bar flat color="rgba(0, 0, 0, 0)" class="fill-height">
              <v-icon class="mr-4">{{ card.icon }}</v-icon>
              <v-toolbar-title class="text-h6 pl-0 v-toolbar-title">
                {{ card.title }}
              </v-toolbar-title>
            </v-app-bar>
            <v-card-text class="dashboard-card-text">
              <v-row justify="end" no-gutters>
                <v-col cols="auto">
                  <span>
                    {{ card.value }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions v-if="loading_dashboard_cards">
              <v-progress-linear
                indeterminate
                height="5"
                class="mt-auto"
              ></v-progress-linear>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="graphs">
      <v-row justify="center">
        <v-col cols="auto" v-for="(graph, index) in graphs" :key="index">
          <graph-card :graph="graph" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import graphCard from "~/components/graph";
import { formatter } from "~/mixins/formatter";

export default {
  mixins: [formatter],
  components: {
    "graph-card": graphCard,
  },
  async beforeMount() {
    await this.filterOrders();
    // this.get("establishments/establishment");
  },
  data() {
    return {
      filter: {
        dialog: false,
        date: [],
      },
      loading_dashboard_cards: false,
      filterCard: {
        icon: "mdi-magnify",
        title: "Filtrar",
        value: "",
        scale: false,
        key: "filter",
      },
      dashboard_cards: [
        {
          icon: "mdi-point-of-sale",
          title: "Vendas",
          value: 0,
          scale: false,
          key: "ordersCount",
        },
        {
          icon: "mdi-cash-multiple",
          title: "Receita",
          value: 0,
          scale: false,
          key: "totalValueSold",
          money: true,
        },
        {
          icon: "mdi-cash-check",
          title: "Pagamento",
          value: 0,
          scale: false,
          key: "paymentMethod",
        },
        {
          icon: "mdi-food-fork-drink",
          title: "Produtos",
          value: 0,
          scale: false,
          key: "productsCount",
        },
        {
          icon: "mdi-hamburger",
          title: "Favorito",
          value: undefined,
          scale: false,
          key: "favoriteProduct",
        },
      ],
      graphs: [
        {
          icon: "mdi-point-of-sale",
          title: "Vendas",
          caption: "Vendas realizadas através do Whatsapp Business",
          color: "white",
        },
        {
          icon: "mdi-cash-multiple",
          title: "Receita",
          caption: "Faturamento do estabelecimento",
          color: "teal",
        },
        {
          icon: "mdi-cash-check",
          title: "Lucro",
          caption: "Receita menos o custo de produção",
          color: "teal",
        },
      ],
    };
  },
  methods: {
    async filterOrders() {
      this.loading_dashboard_cards = true;
      let payload = {}
      if (this.filter.date != []) payload.date = this.filter.date.sort();
      const response = await this.$store.dispatch("orders/filter", payload)
      this.parseGeneralInfo(response)
      this.loading_dashboard_cards = false;
    },
    async getGeneralInfo() {
      this.loading_dashboard_cards = true;
      const response = await this.$store.dispatch("orders/getGeneralInfo");
      console.log(response);
      this.loading_dashboard_cards = false;
      return response;
    },
    parseGeneralInfo(response) {
      if (!!response) {
        this.dashboard_cards.map((card) => {
          if (card.money) card.value = this.value.format(response[card.key]);
          else card.value = response[card.key];
        });
      }
    },
    get(info) {
      console.log(this.$store.getters[info]);
    },
  },
};
</script>

<style lang="scss">
#dashboard-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: $primaryBG;

  .statistics {
    position: relative;
    height: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    background-color: $terciary;

    .v-toolbar-title {
      color: $terciary;
    }

    .dashboard-cards {
      padding-top: 30px;

      .hide {
        display: none;
      }

      .mdi.theme--light {
        color: $primary;
      }

      .dashboard-card-text {
        position: relative;
        font-size: 24px;
      }
    }
  }

  .graphs {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    height: auto;
    width: 100%;
    margin-top: 100px;
    margin-bottom: 100px;
  }
}
</style>