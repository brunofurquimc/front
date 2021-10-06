<template>
  <div id="dashboard-container">
    <div class="statistics">
      <v-row justify="center" class="dashboard-cards">
        <v-col
          cols="auto"
          v-for="(card, index) in dashboard_cards"
          :key="index"
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
import { formatter } from '~/mixins/formatter'

export default {
  mixins: [formatter],
  components: {
    "graph-card": graphCard
  },
  async beforeMount() {
    const response = await this.getGeneralInfo();
    this.parseGeneralInfo(response);

    this.get('establishments/establishment')
  },
  data() {
    return {
      loading_dashboard_cards: false,
      dashboard_cards: [
        {
          icon: "mdi-point-of-sale",
          title: "Vendas",
          value: 0,
          scale: false,
          key: "ordersCount"
        },
        {
          icon: "mdi-cash-multiple",
          title: "Receita",
          value: 0,
          scale: false,
          key: "totalSales",
          money: true,
        },
        {
          icon: "mdi-cash-check",
          title: "Lucro",
          value: 0,
          scale: false,
          key: "totalProfit",
          money: true,
        },
        {
          icon: "mdi-food-fork-drink",
          title: "Produtos",
          value: 0,
          scale: false,
          key: "productsCount"
        },
        {
          icon: "mdi-hamburger",
          title: "Favorito",
          value: undefined,
          scale: false,
          key: 'highestSellingProduct'
        }
      ],
      graphs: [
        {
          icon: "mdi-point-of-sale",
          title: "Vendas",
          caption: "Vendas realizadas através do Whatsapp Business",
          color: "white"
        },
        {
          icon: "mdi-cash-multiple",
          title: "Receita",
          caption: "Faturamento do estabelecimento",
          color: "teal"
        },
        {
          icon: "mdi-cash-check",
          title: "Lucro",
          caption: "Receita menos o custo de produção",
          color: "teal"
        }
      ]
    };
  },
  methods: {
    async getGeneralInfo() {
      this.loading_dashboard_cards = true;
      const response = await this.$store.dispatch("orders/getGeneralInfo");
      console.log(response)
      this.loading_dashboard_cards = false;
      return response;
    },
    parseGeneralInfo(response) {
      if (!!response) {
        this.dashboard_cards.map(card => {
          if (card.money) card.value = this.value.format(response[card.key])
          else card.value = response[card.key];
        });
      }
    },
    get(info) {
      console.log(this.$store.getters[info])
    } 
  }
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