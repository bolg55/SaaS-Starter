import { getSession } from 'next-auth/react'
import { Stripe } from 'stripe'
import { stripe, createAuthApiHandler } from '@/lib/server'

const handler = createAuthApiHandler()

handler.post(async (req, res) => {
  const session = await getSession({ req })
  const { price } = req.body

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    customer: session?.user?.stripeCustomerId,
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'http://localhost:3000/?cancelledPayment=true',
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        payingUserId: session?.user?.id as string,
      },
    },
  }

  // Error handling
  if (!session?.user) {
    return res.status(401).json({
      error: {
        code: 'no-access',
        message: 'You are not logged in',
      },
    })
  }

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params)

  return res.status(200).json({ sessionId: checkoutSession.id })
})

export default handler
