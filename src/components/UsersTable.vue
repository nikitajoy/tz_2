<script setup lang="ts">
import type { User } from '@/types'
import { ref } from 'vue'

const props = defineProps<{
  users: User[]
}>()

import { useUsersStore } from '@/stores/users'
const userStore = useUsersStore()

const showPasswordIds = ref(new Set<string>())

function togglePassword(id: string) {
  const copy = new Set(showPasswordIds.value)
  if (copy.has(id)) copy.delete(id)
  else copy.add(id)
  showPasswordIds.value = copy
}
</script>

<template>
  <v-row class="flex-wrap" no-gutters>
    <v-col class="flex-grow-0 flex-shrink-0" cols="3">
      <v-sheet class="ma-2 pa-2"> Метки</v-sheet>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0" cols="2">
      <v-sheet class="ma-2 pa-2"> Тип записи</v-sheet>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0" cols="2">
      <v-sheet class="ma-2 pa-2"> Логин</v-sheet>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0" cols="2">
      <v-sheet class="ma-2 pa-2"> Пароль</v-sheet>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0" cols="0.5"> </v-col>
  </v-row>
  <v-row class="flex-wrap align-baseline" no-gutters v-for="user in users" :key="user.id">
    <v-col class="flex-grow-0 flex-shrink-0 px-2" cols="3">
      <v-text-field
        v-model="user.mark"
        density="compact"
        variant="outlined"
        hide-details="auto"
      ></v-text-field>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0 px-2" cols="2">
      <v-autocomplete
        v-model="user.loginType"
        density="compact"
        :items="[
          { value: 'ldap', name: 'LDAP' },
          { value: 'local', name: 'Локальная' },
        ]"
        item-value="value"
        item-title="name"
        variant="outlined"
      ></v-autocomplete>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0 px-2" cols="2">
      <v-text-field
        v-model="user.login"
        density="compact"
        variant="outlined"
        hide-details="auto"
      ></v-text-field>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0 px-2" cols="2">
      <v-text-field
        v-model="user.password"
        @click:append-inner="togglePassword(user.id)"
        :append-inner-icon="
          showPasswordIds.has(user.id) ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
        "
        :type="showPasswordIds.has(user.id) ? 'text' : 'password'"
        variant="outlined"
        density="compact"
      />
    </v-col>
    <v-col class="d-flex align-center justify-center flex-grow-0 flex-shrink-0" cols="0.5">
      <v-icon
        @click="userStore.deleteUser(user.id)"
        icon="fa-regular fa-trash-can"
        size="x-large"
        color="blue-grey-darken-1"
      ></v-icon>
    </v-col>
  </v-row>
</template>
