<script setup lang="ts">
import UsersTable from './components/UsersTable.vue'
import { useUsersStore } from './stores/users'
const userStore = useUsersStore()
</script>

<template>
  <!-- <pre>
      {{ userStore.users }}
    </pre> -->

  <v-container>
    <div class="d-flex ga-3">
      <h5 class="text-h5 font-weight-bold">Учетные записи</h5>
      <v-icon
        @click="userStore.addUser()"
        icon="fa-regular fa-square-plus"
        size="x-large"
        color="blue-grey-darken-2"
      ></v-icon>
    </div>
    <v-sheet class="bg-blue-lighten-5 my-3 pa-2">
      <v-icon icon="fa-regular fa-circle-question" color="blue-grey-darken-2"></v-icon>
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</v-sheet
    >
    <users-table :users="userStore.users"></users-table>
  </v-container>
</template>

<style scoped></style>
