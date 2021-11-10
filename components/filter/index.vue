<template>
  <div class="filter-dialog">
    <v-dialog v-model="open" persistent width="400">
      <v-card class="sale-dialog">
        <v-card-title>{{ title }}</v-card-title>
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
            @click="
              filter.date = [];
              $emit('close')
            "
          >
            Cancelar
          </v-btn>
          <v-btn
            color="teal darken-1"
            text
            @click="$emit('filter', filter.date)"
          >
            Filtrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: {
        date: [],
      },
    };
  },
  props: {
    title: {
      required: true,
      type: String,
      default: "Filtro",
    },
    open: {
      required: true,
      type: Boolean,
      default: false,
    }
  },
};
</script>

<style>
</style>