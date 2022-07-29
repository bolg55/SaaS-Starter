import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

export const getStripeSubTier = async (isActive: boolean, subPlan: string) => {
  if (isActive) {
    const subType = await stripe.products.retrieve(subPlan)
    return { subType: subType.name }
  }
}

export default stripe
