<script setup lang="ts">
import type { User } from '@/types'
import { ref, watch } from 'vue'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{
  users: User[]
}>()

type EditableUser = User & {
  markText: string
}

const localUsers = ref<EditableUser[]>([])

const userStore = useUsersStore()

const showPasswordIds = ref(new Set<string>())

watch(
  () => props.users,
  (newUsers: User[]) => {
    localUsers.value = newUsers.map((user) => {
      const rawMark = (user as any).mark
      const normalizedMark = Array.isArray(rawMark)
        ? rawMark
        : rawMark
          ? String(rawMark)
              .split(';')
              .map((part: string) => part.trim())
              .filter((part: string) => part.length > 0)
              .map((text: string) => ({ text }))
          : []

      return {
        ...user,
        mark: normalizedMark,
        markText: normalizedMark.map((m) => m.text).join(';'),
      }
    })
  },
  { immediate: true, deep: true },
)

function togglePassword(id: string) {
  const copy = new Set(showPasswordIds.value)
  if (copy.has(id)) copy.delete(id)
  else copy.add(id)
  showPasswordIds.value = copy
}

type UserErrors = {
  login?: string[]
  password?: string[]
  mark?: string[]
}

const errors = ref<Record<string, UserErrors>>({})

function parseMarks(markText: string) {
  return markText
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((text) => ({ text }))
}

function saveUserIfValid(user: EditableUser, userErrors: UserErrors) {
  const hasErrors = Object.keys(userErrors).length > 0
  if (hasErrors) return

  const payload: User = {
    id: user.id,
    loginType: user.loginType,
    login: user.login,
    password: user.loginType === 'ldap' ? null : (user.password ?? ''),
    mark: parseMarks(user.markText),
  }

  userStore.updateUser(payload)
}

function validateUser(user: EditableUser) {
  const userErrors: UserErrors = {}

  const loginErrors: string[] = []

  if (!user.login?.trim()) loginErrors.push('Обязательное поле')
  if (user.login && user.login.length > 100) loginErrors.push('Максимум 100 символов')

  if (loginErrors.length) userErrors.login = loginErrors

  if (user.loginType === 'local') {
    const passErrors: string[] = []

    if (!user.password || !user.password.trim()) passErrors.push('Обязательное поле')
    if (user.password && user.password.length > 100) passErrors.push('Максимум 100 символов')

    if (passErrors.length) userErrors.password = passErrors
  }

  if (user.markText && user.markText.length > 50) {
    userErrors.mark = ['Максимум 50 символов']
  }

  errors.value[user.id] = userErrors

  saveUserIfValid(user, userErrors)
}

function onLoginTypeChange(user: EditableUser, value: User['loginType']) {
  user.loginType = value

  if (user.loginType === 'ldap') {
    user.password = ''
  }

  validateUser(user)
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
  <v-row class="flex-wrap align-baseline" no-gutters v-for="user in localUsers" :key="user.id">
    <v-col class="flex-grow-0 flex-shrink-0 px-2" cols="3">
      <v-text-field
        v-model="user.markText"
        density="compact"
        variant="outlined"
        hide-details="auto"
        @blur="validateUser(user)"
        :error="!!errors[user.id]?.mark"
        :error-messages="errors[user.id]?.mark"
      ></v-text-field>
    </v-col>

    <v-col class="flex-grow-0 flex-shrink-0 px-2" cols="2">
      <v-autocomplete
        v-model="user.loginType"
        @update:modelValue="(value) => onLoginTypeChange(user, value)"
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

    <v-col class="flex-grow-0 flex-shrink-0 px-2" :cols="user.loginType === 'ldap' ? '4' : '2'">
      <v-text-field
        v-model="user.login"
        density="compact"
        variant="outlined"
        hide-details="auto"
        @blur="validateUser(user)"
        :error="!!errors[user.id]?.login"
        :error-messages="errors[user.id]?.login"
      ></v-text-field>
    </v-col>

    <v-col v-if="user.loginType === 'local'" class="flex-grow-0 flex-shrink-0 px-2" cols="2">
      <v-text-field
        v-model="user.password"
        @click:append-inner="togglePassword(user.id)"
        :append-inner-icon="
          showPasswordIds.has(user.id) ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
        "
        :type="showPasswordIds.has(user.id) ? 'text' : 'password'"
        variant="outlined"
        density="compact"
        @blur="validateUser(user)"
        :error="!!errors[user.id]?.password"
        :error-messages="errors[user.id]?.password"
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
