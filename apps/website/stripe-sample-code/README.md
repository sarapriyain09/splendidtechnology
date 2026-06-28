# Stripe setup for pricing items (Velynxia sample)

This sample shows a Stripe Checkout + Billing Portal flow using explicit pricing items from your pricing page.

Configured pricing items in this sample:

- `creator`
- `professional`
- `business`
- `enterprise`

Each pricing item maps to a Stripe Price `lookup_key` via environment variables.

## 1) Configure Stripe prices

In Stripe Dashboard:

1. Create a Product + recurring Price for each plan.
2. Set each Price `lookup_key` to match your config (or update env vars):
	- `velynxia_ai_creator_monthly`
	- `velynxia_ai_professional_monthly`
	- `velynxia_ai_business_monthly`
	- `velynxia_ai_enterprise_monthly`

## 2) Configure environment variables

Set these in your shell before running `server.rb`:

- `STRIPE_SECRET_KEY` (required)
- `APP_DOMAIN` (optional, defaults to `http://localhost:4242`)
- `STRIPE_WEBHOOK_SECRET` (optional for local unless validating webhooks)
- `STRIPE_LOOKUP_CREATOR` (optional override)
- `STRIPE_LOOKUP_PROFESSIONAL` (optional override)
- `STRIPE_LOOKUP_BUSINESS` (optional override)
- `STRIPE_LOOKUP_ENTERPRISE` (optional override)

Use `.env.example` in this folder as a reference.

## 3) Run the sample

1. Install gems:

~~~
bundle install
~~~

2. Run server:

~~~
ruby server.rb -o 0.0.0.0
~~~

3. Open checkout page:

[http://localhost:4242/checkout.html](http://localhost:4242/checkout.html)

## Notes

- This sample uses Stripe-hosted Checkout for subscription mode.
- Customer Portal is available from `success.html`.
- Do not commit real Stripe keys.