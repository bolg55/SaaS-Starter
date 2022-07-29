import { stripe, prisma, createAuthApiHandler } from '@/lib/server'

const handler = createAuthApiHandler()

handler.get(async (req, res) => {
  const email = req.session?.user?.email!

  const user = await prisma.user.findUnique({
    where: { email },
  })
  await prisma.$disconnect()

  const { url } = await stripe.billingPortal.sessions.create({
    customer: user!.stripeCustomerId as string,
    return_url: `${process.env.NEXTAUTH_URL}`,
  })
  res.status(200).json({ url })
})

export default handler
