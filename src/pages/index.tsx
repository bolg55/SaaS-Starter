import type { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'

const Home: NextPage = () => {
  const { data, status } = useSession()

  const goToCheckout = async () => {
    const res = await fetch(`/api/stripe/checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: 'price_1LPGnjKvV53i4yZGFllpETg4',
      }),
    })
    const { redirectUrl } = await res.json()
    if (redirectUrl) {
      window.location.href = redirectUrl
    } else {
      console.log('Error creating checkout session')
    }
  }

  return (
    <main>
      <div>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'unauthenticated' && (
          <button onClick={() => signIn()}>Sign In</button>
        )}
        {status === 'authenticated' && (
          <button onClick={() => signOut()}>Sign Out</button>
        )}
        {data && (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <p>Add a payment method to start using this service!</p>
            <button onClick={goToCheckout}>Add Payment</button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Home
