import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUsersStore = defineStore(
  'users',
  () => {
    let users = ref<User[]>([])

    function addUser() {
      users.value.push({
        id: self.crypto.randomUUID(),
        mark: '',
        loginType: 'local',
        login: '',
        password: '',
      })
    }

    function deleteUser(userId: string) {
      users.value = users.value.filter((user) => user.id != userId)
    }

    return { users, addUser, deleteUser }
  },
  {
    persist: true,
  },
)
