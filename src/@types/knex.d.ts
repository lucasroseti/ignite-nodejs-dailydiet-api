// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
      session_id?: string
    }

    meals: {
      id: string
      session_id?: string
      name: string
      description: string
      is_diet: boolean
      datetime_meal: string
      created_at: string
    }
  }
}
