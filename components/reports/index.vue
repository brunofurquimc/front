<template>
  <div id="cards">
    <v-row justify="center" align="center" class="options-cards">
      <v-col
        cols="auto"
        v-for="(card, index) in report_cards"
        :key="index"
        :class="{ hide: card.value == undefined || card.value == '' }"
      >
        <v-card
          height="auto"
          width="auto"
          hover
          loader-height="5"
          @mouseenter="card.scale = true"
          @mouseleave="card.scale = false"
          :style="card.scale ? { transform: 'scale(1.05)' } : {}"
          @click="$emit('extract', card.key)"
        >
          <v-app-bar flat color="rgba(0, 0, 0, 0)" class="fill-height">
            <v-icon class="mr-4 card-icon">{{ card.icon }}</v-icon>
            <v-toolbar-title class="text-h6 pl-0 v-toolbar-title">
              {{ card.title }}
            </v-toolbar-title>
          </v-app-bar>
          <!-- <v-row justify="center" align="center">
            <v-col cols="auto">
              <span class="text-h6 v-toolbar-title">
                {{ card.title }}
              </span>
            </v-col>
          </v-row> -->
          <v-card-actions v-if="loading">
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
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      report_cards: [
        {
          icon: "mdi-account-group",
          title: "Clientes",
          scale: false,
          key: "clients",
        },
        {
          icon: 'mdi-cash-plus',
          title: 'Vendas',
          scale: false,
          key: 'sales',
        },
        {
          icon: 'mdi-food',
          title: 'Produtos',
          scale: false,
          key: 'products',
        },
        {
          icon: 'mdi-storefront',
          title: 'Operação',
          scale: false,
          key: 'establishments',
        },
        {
          icon: 'mdi-moped-outline',
          title: 'Entregas',
          scale: false,
          key: 'deliveries'
        }
      ],
    };
  },
};
</script>

<style lang="scss">
#cards {
  height: 100%;
  width: 100%;

  .options-cards {
    .card-icon.mdi.theme--light {
    color: $primary;
  }
  }
}
</style>