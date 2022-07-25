import { DefaultUser, Session } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string
      stripeCustomerId?: string
      isActive?: boolean
      subPlan?: string
    }
  }
}
