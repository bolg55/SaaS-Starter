import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import { prisma, stripe } from '@/lib/server'
import { emailConfig, sendVerificationRequest } from '@/lib/server/mail'

// Prisma Adapter for NextAuth
import { PrismaAdapter } from '@next-auth/prisma-adapter'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: emailConfig,
      maxAge: 10 * 60, // Magic Link valid for 10 minutes
      sendVerificationRequest,
    }),
    // ... add more providers here
  ],
  callbacks: {
    session: async ({ session, user }) => {
      session!.user!.id = user.id
      session!.user!.stripeCustomerId = user.stripeCustomerId as string
      session!.user!.isActive = user.isActive as boolean
      session!.user!.subPlan = user.subPlan as string
      return session
    },
  },
  events: {
    createUser: async ({ user }) => {
      await stripe.customers
        .create({
          email: user.email!,
        })
        .then(async (customer) => {
          return prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: customer.id,
            },
          })
        })
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
})
