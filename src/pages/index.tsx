import { signIn, signOut, useSession } from 'next-auth/react'
import { stripe } from '@/lib/server'
import { fetcher } from '@/lib/client'
import type { GetStaticProps, NextPage } from 'next'
import { PlanInfo } from '@/types/types'
import { useRouter } from 'next/router'
import Pricing from '@/sections/Pricing'

interface Props {
  plans: PlanInfo[]
}

const Home: NextPage<Props> = ({ plans }) => {
  const { data, status } = useSession()
  const router = useRouter()

  // Redirect to customer billing portal
  const redirectToCustomerPortal = async () => {
    const redirect = await fetcher(`/api/stripe/customer-portal`)
    router.push(redirect.url)
  }

  return (
    <main>
      <div>
        <div className='flex justify-end'>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'unauthenticated' && (
            <button
              className='px-3 py-2 m-4 font-semibold text-white bg-indigo-500 rounded'
              onClick={() => signIn()}>
              Sign In
            </button>
          )}
          {status === 'authenticated' && (
            <button
              className='px-3 py-2 m-4 font-semibold text-white bg-indigo-500 rounded'
              onClick={() => signOut()}>
              Sign Out
            </button>
          )}
        </div>

        {data && (
          <div className='m-4'>
            <pre>{JSON.stringify(data, null, 2)}</pre>

            {data.user?.isActive && (
              <button
                className='p-3 mx-1 border-2 rounded'
                onClick={redirectToCustomerPortal}>
                Customer Portal
              </button>
            )}
          </div>
        )}
      </div>

      <Pricing plans={plans} />
    </main>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const { data: prices } = await stripe.prices.list()
  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product as string)
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price?.recurring?.interval,
        currency: price.currency,
      }
    })
  )

  const sortedPlans = plans.sort(
    (a, b) => (a.price as number) - (b.price as number)
  )

  return {
    props: {
      plans: sortedPlans,
    },
  }
}
