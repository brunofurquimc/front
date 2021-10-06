<template>
  <v-app light id="v-app">
    <v-navigation-drawer
      id="navigation-drawer"
      height="100%"
      v-model="drawer"
      :clipped="clipped"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-img src="logo/complete.svg" style="transform: scale(0.125)"></v-img>
      <v-spacer />
      <v-btn icon @click.stop="logout">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <!-- <v-footer :absolute="true" app>
      <span>del.io &copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import auth from "~/middleware/auth";
export default {
  middleware: auth,
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: "mdi-chart-bar",
          title: "Dashboard",
          to: "/dashboard"
        },
        {
          icon: 'mdi-card-account-details-outline',
          title: 'Vendedores',
          to: '/vendors',
        },
        {
          icon: "mdi-account-group",
          title: "Clientes",
          to: "/customers"
        },
        {
          icon: "mdi-point-of-sale",
          title: "Vendas",
          to: "/sales"
        },
        {
          icon: "mdi-food-fork-drink",
          title: "Produtos",
          to: "/products"
        },
        {
          icon: "mdi-file-excel-outline",
          title: "Relatórios",
          to: "/reports"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: ""
    };
  },
  methods: {
    logout() {
      this.$store.commit("users/logout", this.$router);
    }
  },
  computed: {
    establishmentName() {
      return this.$store.getters["establishments/establishment"]?.name;
    }
  }
};
</script>

<style lang="scss">
#v-app {
  background-color: $primaryBG;
  #navigation-drawer {
    .mdi.theme--light {
      color: $primary;
    }
  }
}
</style>