require 'stripe'
require 'sinatra'
require 'json'

# Use environment variables. Never hardcode Stripe keys in source.
stripe_secret_key = ENV['STRIPE_SECRET_KEY']
if stripe_secret_key.nil? || stripe_secret_key.empty?
  raise 'Missing STRIPE_SECRET_KEY environment variable'
end

client = Stripe::StripeClient.new(stripe_secret_key)

# Map UI pricing items to Stripe Price lookup_keys.
# Update these lookup keys to match your Stripe dashboard setup.
PRICING_ITEMS = {
  'crm' => ENV.fetch('STRIPE_LOOKUP_CRM', 'velynxia_crm_monthly'),
  'growth' => ENV.fetch('STRIPE_LOOKUP_GROWTH', 'velynxia_growth_monthly'),
  'creator' => ENV.fetch('STRIPE_LOOKUP_CREATOR', 'velynxia_ai_creator_monthly'),
  'professional' => ENV.fetch('STRIPE_LOOKUP_PROFESSIONAL', 'velynxia_ai_professional_monthly'),
  'business' => ENV.fetch('STRIPE_LOOKUP_BUSINESS', 'velynxia_ai_business_monthly'),
  'enterprise' => ENV.fetch('STRIPE_LOOKUP_ENTERPRISE', 'velynxia_ai_enterprise_monthly')
}.freeze

set :static, true
set :port, (ENV['PORT'] || 4242).to_i

YOUR_DOMAIN = ENV.fetch('APP_DOMAIN', 'http://localhost:4242')
WEBHOOK_SECRET = ENV.fetch('STRIPE_WEBHOOK_SECRET', '')

before do
  content_type 'application/json' if request.path_info == '/create-checkout-session'
end

post '/create-checkout-session' do
  selected_plan = (params['plan'] || 'creator').downcase
  lookup_key = PRICING_ITEMS[selected_plan]

  if lookup_key.nil?
    halt 400, { error: { message: "Unknown pricing item: #{selected_plan}" } }.to_json
  end

  prices = client.v1.prices.list(
    lookup_keys: [lookup_key],
    active: true,
    limit: 1,
    expand: ['data.product']
  )

  if prices.data.nil? || prices.data.empty?
    halt 400, { error: { message: "No active Stripe Price found for lookup key: #{lookup_key}" } }.to_json
  end

  begin
    session = client.v1.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        quantity: 1,
        price: prices.data[0].id
      }],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: YOUR_DOMAIN + '/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: YOUR_DOMAIN + '/cancel.html',
    })
  rescue StandardError => e
    error_message = e.respond_to?(:error) && e.error ? e.error.message : e.message
    halt 400,
        { error: { message: error_message } }.to_json
  end

  redirect session.url, 303
end

post '/create-portal-session' do
  content_type 'application/json'
  # For demonstration purposes, we're using the Checkout session to retrieve the customer_account ID.
  # Typically this is stored alongside the authenticated user in your database.
  checkout_session_id = params['session_id']
  checkout_session = client.v1.checkout.sessions.retrieve(checkout_session_id)

  # This is the URL to which users will be redirected after they're done
  # managing their billing.
  return_url = YOUR_DOMAIN

  session = client.v1.billing_portal.sessions.create({

                                                    customer: checkout_session.customer,
                                                    return_url: return_url
                                                  })
  redirect session.url, 303
end

post '/webhook' do
  payload = request.body.read
  if !WEBHOOK_SECRET.empty?
    # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil

    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, WEBHOOK_SECRET
      )
    rescue JSON::ParserError => e
      # Invalid payload
      status 400
      return
    rescue Stripe::SignatureVerificationError => e
      # Invalid signature
      puts '⚠️  Webhook signature verification failed.'
      status 400
      return
    end
  else
    data = JSON.parse(payload, symbolize_names: true)
    event = Stripe::Event.construct_from(data)
  end
  # Get the type of webhook event sent - used to check the status of PaymentIntents.
  event_type = event['type']
  data = event['data']
  data_object = data['object']

  if event.type == 'customer.subscription.deleted'
    # handle subscription canceled automatically based
    # upon your subscription settings. Or if the user cancels it.
    # puts data_object
    puts "Subscription canceled: #{event.id}"
  end

  if event.type == 'customer.subscription.updated'
    # handle subscription updated
    # puts data_object
    puts "Subscription updated: #{event.id}"
  end

  if event.type == 'customer.subscription.created'
    # handle subscription created
    # puts data_object
    puts "Subscription created: #{event.id}"
  end

  if event.type == 'customer.subscription.trial_will_end'
    # handle subscription trial ending
    # puts data_object
    puts "Subscription trial will end: #{event.id}"
  end

  if event.type == 'entitlements.active_entitlement_summary.updated'
    # handle active entitlement summary updated
    # puts data_object
    puts "Active entitlement summary updated: #{event.id}"
  end

  content_type 'application/json'
  {
    status: 'success'
  }.to_json
end