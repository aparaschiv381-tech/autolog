import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export const PLANS = {
  free: { projectLimit: 1, entryLimit: 10, name: 'Free' },
  pro: { projectLimit: 999, entryLimit: 999, name: 'Pro', price: '$19/mo' },
}
