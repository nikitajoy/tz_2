import { reactive, ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/types'

export const useUsersStore = defineStore('users', () => {
  let users = reactive<User[]>([])

  function addUser(user: User) {
    users.push({ id: self.crypto.randomUUID(), ...user })
  }

  function deleteUser(userId: string) {
    users = users.filter((user) => user.id != userId)
  }

  return { users, addUser, deleteUser }
})
