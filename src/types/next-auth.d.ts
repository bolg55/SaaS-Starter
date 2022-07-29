import { DefaultUser, Session } from 'next-auth'
import { NextApiRequest } from 'next'

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string
      stripeCustomerId?: string
      isActive?: boolean
      subTier?: string
      subStatus?: string
    }
  }
}

export interface AppNextApiRequest extends NextApiRequest {
  session: Session
}
