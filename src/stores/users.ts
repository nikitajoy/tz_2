import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUsersStore = defineStore(
  'users',
  () => {
    const users = ref<User[]>([])

    function addUser() {
      users.value.push({
        id: self.crypto.randomUUID(),
        mark: [],
        loginType: 'local',
        login: '',
        password: '',
      })
    }

    function deleteUser(userId: string) {
      users.value = users.value.filter((user) => user.id !== userId)
    }

    function updateUser(updatedUser: User) {
      const index = users.value.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
    }

    return { users, addUser, deleteUser, updateUser }
  },
  {
    persist: true,
  },
)
