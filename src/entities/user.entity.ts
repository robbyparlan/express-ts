export interface UserEntity {
  id?: number
  username: string
  fullname?: string
  email: string
  password: string
  role_id: number
  is_active: boolean
}