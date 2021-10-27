<template>
  <div class="screen-container">
    <div class="screen-food-1">
      <img src="food/taco.svg" alt="" />
    </div>
    <div class="screen-food-2">
      <img src="food/eggs.svg" alt="" />
    </div>
    <div class="screen-table">
      <v-data-table
        :headers="headers"
        :items="vendors"
        :items-per-page="10"
        :loading="loading"
        loading-text="Carregando..."
        :search="search"
        class="elevation-5"
        height="400"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Vendedores do estabelecimento</v-toolbar-title>
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
          <v-icon class="ml-auto delete" @click="openDeleteDialog(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-results>
          Nenhum dado correspondente à pesquisa.
        </template>
      </v-data-table>
    </div>
    <div class="screen-dialog">
      <v-dialog v-model="editDialog" persistent width="600">
        <v-card>
          <v-card-title>Editar dados do vendedor</v-card-title>
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
      <v-dialog v-model="deleteDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            Confirmar remoção deste vendedor?
          </v-card-title>
          <v-card-text
            >{{ dialog.name }} não terá mais acesso ao Del.io.</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="deleteDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="red darken-1" text @click="this.delete">
              Deletar
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
    await this.getTableData();
    this.loading = false;
  },
  data() {
    return {
      editDialog: false,
      deleteDialog: false,
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
      vendors: [],
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
      }
    };
  },
  methods: {
    async getTableData() {
      const establishment_id = this.$store.getters[
        "establishments/establishment"
      ]?.id;
      if (establishment_id !== undefined && establishment_id !== null) {
        const response = await this.$store.dispatch(
          "users/getVendors",
          establishment_id
        );
        const { vendors } = response;
        if (vendors !== undefined) this.formatVendors(vendors);
        else {
          // Falar que não foi possivel buscar os vendedores e pedir para tentar novamente mais tarde
        }
      }
    },
    formatVendors(vendors) {
      this.vendors = vendors.map(vendor => {
        vendor.phone = `(${vendor.phone.area_code}) ${this.formatPhone(
          vendor.phone.number
        )}`;
        console.log(vendor);
        return vendor;
      });
    },
    fillDialogFormData(vendor) {
      console.log(vendor);
      this.dialog.email = vendor.email;
      this.dialog.address = vendor.address;
      this.dialog.address.zipcode = this.formatZipcode(
        this.dialog.address.zip_code
      );

      delete this.dialog.address.zip_code;
      this.dialog.phone = `(${vendor.phone.area_code}) ${this.formatPhone(
        vendor.phone.number
      )}`;
      this.dialog.address.endereco = `${vendor.address.street}, ${vendor.address.district} - ${vendor.address.city} (${vendor.address.state})`;
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
      await this.getVendor(id);
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
          "users/editVendor",
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
    async openDeleteDialog({ id, name }) {
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
        (this.deleteDialog = true);
      await this.getVendor(id);
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
    async delete() {
      const response = await this.$store.dispatch(
        "users/deleteVendor",
        this.dialog.id
      );
      if (response.error !== null) {
        this.$toast.error(response.message, "Atenção");
      } else {
        this.$toast.success(response.message, "Sucesso");
        await this.reloadTable();
      }
      this.deleteDialog = false;
    },
    async getVendor(id) {
      const response = await this.$store.dispatch("users/getVendor", id);
      const { vendor } = response;
      if (vendor !== undefined) this.fillDialogFormData(vendor);
      else {
        // vendedor nao encontrado, tentar novamente mais tarde
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

        .v-icon.v-icon.v-icon--link.edit {
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
    top: 70%;
    transform: translateY(-50%);
    left: 0px;

    img {
      width: 50%;
    }
  }

  .screen-food-2 {
    position: absolute;
    top: 30%;
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

    .v-icon.v-icon.v-icon--link.delete {
      cursor: pointer;
      outline: none;
      color: darken(red, 10%);
    }
  }
}
</style>