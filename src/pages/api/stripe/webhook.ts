/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'
import { prisma, stripe } from '@/lib/server'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const requestBuffer = await buffer(req)
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        requestBuffer.toString(),
        sig,
        endpointSecret
      )
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
      return res.status(400).send(`Webhook signature verification failed.`)
    }
    // Handle the event
    switch (event.type) {
      // Handle successful subscription creation
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          // Find the customer in our database with the Stripe customer ID linked to this purchase
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          // Update that customer so their status is now active
          data: {
            isActive: true,
            subPlan: subscription.items.data[0]?.price.product as string,
            interval: subscription.items.data[0]?.plan.interval,
            subStatus: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        })
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          // Find the customer in our database with the Stripe customer ID linked to this purchase
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          // Update that customer so their status is now active
          data: {
            isActive: true,
            subPlan: subscription.items.data[0]?.price.product as string,
            interval: subscription.items.data[0]?.plan.interval,
            subStatus: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        })
        break
      }
      // ... handle other event types
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            isActive: false,
            subPlan: null,
            interval: null,
            subStatus: null,
            cancelAtPeriodEnd: null,
          },
        })
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true })
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
}
