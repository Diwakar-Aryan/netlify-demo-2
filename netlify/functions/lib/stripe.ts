const SECRET = process.env.STRIPE_SECRET as string
export const WEBHOOK_SECRET = process.env.STRIPE_SIGNATURE as string

export const stripe = require('stripe')(SECRET)
