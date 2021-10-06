<template>
  <v-card class="mt-4 mx-auto graph-card" width="440" height="90%">
    <v-card-text class="pt-2">
      <div class="text-h6 font-weight-bold mb-2 title">{{ graph.title }}</div>
      <div
        class="subheading font-weight-light grey--text"
        v-if="graph.subtitle !== undefined"
      >
        {{ graph.subtitle }}
      </div>
      <v-divider class="my-2"></v-divider>
      <v-icon class="mr-2" small>{{ graph.icon }}</v-icon>
      <span
        class="text-caption"
        v-if="graph.caption !== undefined"
        >{{ graph.caption }}</span
      >
    </v-card-text>
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="white"
      elevation="8"
      max-width="calc(100% - 32px)"
      @mouseenter="scale = true"
      @mouseleave="scale = false"
      :class="{'scale': scale}"
    >
      <line-chart
        v-if="showChart"
        :data="graphData"
        :options="options"
      ></line-chart>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  mounted() {
    this.showChart = true;
  },
  data: () => ({
    scale: false,
    showChart: false,
    graphData: {
      labels: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho"
      ],
      datasets: [
        {
          data: [2, 10, 5, 9, 0, 6, 20],
          backgroundColor: "transparent",
          borderColor: "#26A69A",
          pointBackgroundColor: "black"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label(tooltipItem) {
            return `R$ ${tooltipItem.value},00`;
          }
        }
      },
      scales: {
        xAxes: [
          {
            ticks: {
              callback: label => label.substring(0, 3)
            }
          }
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              min: 0,
              max: 20,
              stepSize: 5,
              suggestedMin: 0.5,
              suggestedMax: 5.5,
              callback: label => `R$ ${label},00`
            },
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
  }),
  props: {
    graph: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss">
.graph-card {

  .text-caption {
    font-weight: bold;
  }

  .v-sheet--offset {
    top: 0px;
    position: relative;
    #line-chart {
      padding: 16px;
    }
  }
  .scale {
    cursor: pointer;
    transform: scale(1.01);
  }
  .title {
    color: $primary;
  }
}
.graph-card.theme--light.v-card {
  background-color: lighten($primaryBG, $amount: 10%);
}
</style>