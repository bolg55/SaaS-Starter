import { fetcher, getStripe } from '@/lib/client'
import api from '@/lib/common/api'
import { PlanInfo } from '@/types/types'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

interface Props {
  plans: PlanInfo[]
}

type BillingInterval = 'year' | 'month'

const Pricing = ({ plans }: Props) => {
  const { data } = useSession()
  const router = useRouter()
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month')

  const user = data?.user
  const subscribed = data?.user?.isActive
  const subTier = data?.user?.subTier

  // Redirect to customer billing portal
  const redirectToCustomerPortal = async () => {
    const redirect = await fetcher(`/api/stripe/customer-portal`)
    router.push(redirect.url)
  }

  const goToCheckout = async (planId: string) => {
    if (!user) {
      signIn()
    }

    if (subscribed) redirectToCustomerPortal()

    const response = await api(`/api/stripe/checkout-session`, {
      method: 'POST',
      body: {
        price: planId,
      },
    })
    // Redirect to checkout.
    const stripe = await getStripe()
    stripe?.redirectToCheckout({ sessionId: response.sessionId })
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='flex mt-6  rounded-lg p-0.5  sm:mt-8 border border-indigo-800'>
        <button
          onClick={() => setBillingInterval('month')}
          type='button'
          className={`${
            billingInterval === 'month'
              ? 'relative w-1/2 bg-indigo-500 border-indigo-700 shadow-sm text-white'
              : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
          } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}>
          Monthly billing
        </button>
        <button
          onClick={() => setBillingInterval('year')}
          type='button'
          className={`${
            billingInterval === 'year'
              ? 'relative w-1/2 bg-indigo-500 border-indigo-700 shadow-sm text-white'
              : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
          } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:z-10 sm:w-auto sm:px-8`}>
          Yearly billing
        </button>
      </div>
      <div className='flex'>
        {plans
          .filter((plan) => plan.interval === billingInterval)
          .map((plan) => {
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: plan.currency,
              minimumFractionDigits: 0,
            }).format((plan.price || 0) / 100)

            return (
              <div
                className='flex flex-col justify-between p-4 m-4 text-gray-800 border-2 rounded h-72 w-60'
                key={plan.id}>
                <h4 className='text-4xl '>{plan.name}</h4>
                <p className='text-5xl font-bold'>
                  {priceString}/{` `}
                  <span className='text-xl text-gray-400'>
                    {billingInterval}
                  </span>
                </p>
                <button
                  className='py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700 cursor:pointer'
                  onClick={() => goToCheckout(plan.id)}>
                  {plan.name === subTier ? 'Manage' : 'Subscribe'}
                </button>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Pricing
