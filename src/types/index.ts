export interface MarkItem {
  text: string
}

export interface User {
  id: string
  mark: MarkItem[]
  loginType: 'ldap' | 'local'
  login: string
  password: string | null
}
