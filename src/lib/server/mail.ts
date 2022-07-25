import nodemailer from 'nodemailer'
import Handlebars from 'handlebars'
import { readFileSync } from 'fs'
import path from 'path'

// EMAIL

export const emailConfig = {
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  service: process.env.EMAIL_SERVICE,
}

const transporter = nodemailer.createTransport(emailConfig)

const emailsDir = path.resolve(process.cwd(), 'emails')

export const sendVerificationRequest = ({
  identifier,
  url,
}: {
  identifier: string
  url: string
}): void => {
  const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
    encoding: 'utf8',
  })
  const emailTemplate = Handlebars.compile(emailFile)
  transporter.sendMail({
    from: `"Action Backers" ${process.env.EMAIL_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for Action Backers',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  })
}

export default transporter
