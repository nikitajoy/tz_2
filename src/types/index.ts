export interface User {
  id: string
  mark: string
  loginType: 'ldap' | 'local'
  login: string
  password: string
}
