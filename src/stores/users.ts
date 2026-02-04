import { ref } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/types'

export const useUsersStore = defineStore('users', () => {
  let users = ref<User[]>([])

  function addUser(user: User) {
    users.value.push({ id: self.crypto.randomUUID(), ...user })
  }

  function deleteUser(userId: string) {
    users.value = users.value.filter((user) => user.id != userId)
  }

  return { users, addUser, deleteUser }
})
