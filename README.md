# **Modern SaaS Boilerplate**

## Focus on building your core business features.

---

![SaaS Starter](https://res.cloudinary.com/dxghtqpao/image/upload/v1659066394/A_Modern_SaaS_Boilerplate_wtiao3.png)

# **Tech Stack:**

- [TypeScript](https://typescriptlang.org/)
- [Next.js]("https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://prisma.io/)
- [Stripe](https://stripe.com/)

# **Features**

- Authentication with NextAuth.js
  - Email with magic link
  - Github
  - Easily add more oauth providers by [following their docs](https://next-auth.js.org/configuration/providers/oauth)
- Customized signin email template
  - Easily edit existing email or add more templates using handlebars
- Payments with Stripe
  - Stripe checkout
  - Customer portal
  - Webhooks sync with your db

# **Getting Started**

## **1. Clone Project Repo**

```bash
git clone https://github.com/<GITHUB_USERNAME>/<PROJECT_REPOSITORY>
```

## **2. Install Dependencies**

```bash
npm install
# or
yarn
```

## **3. Setup Environment Variables**

Make a copy of the `.env.example` file as your local `.env` file.

```bash
cp .env.example .env
```

---

# **The Following Environment Variables Will Be Needed:**

\*The repo includes signin via magic link (Email) as well as Github as defaults. You can add or remove providers by going to **`src/pages/api/auth/[...nextauth].ts`\***

```bash
PRISMA DATABASE CONFIGURATION
# DATABASE_URL= Get from database provider

EMAIL
-- For passwordless signin/signup --
# EMAIL_SERVICE= Nodemailer well-known services (ex:"SendGrid") https://nodemailer.com/smtp/well-known/
# EMAIL_SERVER_USER= Username
# EMAIL_SERVER_PASSWORD= Password
# EMAIL_FROM= Email address

NEXT-AUTH
# NEXTAUTH_SECRET= Generate using `openssl rand -base64 32`
# NEXTAUTH_URL= App URL http://localhost:3000

NEXT-AUTH PROVIDERS
-- Add your providers here --
# GITHUB_ID= Get from Github OAuth
# GITHUB_SECRET= Get from Github OAuth

STRIPE
-- Accept subscription payments --
# STRIPE_SECRET_KEY= Get from Stripe -> server side
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY= Get from Stripe -> client side
# STRIPE_WEBHOOK_SECRET= Get from Stripe -> webhooks
```

## **4a. Generate Database Migrations**

Before running the application, we need to generate the database migrations via Prisma

> The included Prisma schema uses postgres for a database. If you are using MySQL or any other [supported database](https://www.prisma.io/docs/reference/database-reference/supported-databases) you will need to modify the `schema.prisma` file before running your migration.

```javascript
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```bash
npx prisma migrate dev
# or
yarn prisma migrate dev
```

## **4b. Set up Stripe**

The Stripe section of [this article](https://dev.to/ajones_codes/how-to-add-user-accounts-and-paid-subscriptions-to-your-nextjs-website-585e) should have everything you need to configure your Stripe account.

## **5.Run the development server:**

```bash
npm run dev
# or
yarn dev
```

**Congratulations on scaffolding your project!**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

# **Dependencies**

- Axios - 0.27.2
- Handlebars - 4.7.7
- Micro - 9.4.0
- Next-connect - 0.13.0
- Nodemailer - 6.7.7
- React Hot Toast - 2.3.0

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# **🙏 Acknowledgement & Inspiration:**

This project would not have been possible without the inspiration from [Nextacular](https://nextacular.co/) or [@gmpetrov](https://github.com/gmpetrov). [Andrew Jones article](https://dev.to/ajones_codes/how-to-add-user-accounts-and-paid-subscriptions-to-your-nextjs-website-585e) was also incredibly helpful and a lot of the final repo has code directly influenced by this post. Thank you [@aej11a](https://github.com/aej11a).
