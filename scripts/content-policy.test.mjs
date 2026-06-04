import { describe, expect, it } from 'vitest'

import { containsActiveCheckoutLanguage } from './content-policy.mjs'

describe('content policy checkout guards', () => {
  it('allows explicit checkout-pending copy without masking forbidden phrases', () => {
    expect(
      containsActiveCheckoutLanguage({
        status: 'checkout_pending',
        checkoutNote: 'Checkout is pending until the payment provider is selected.',
        ctaHref: 'mailto:samfrench@gmail.com',
      }),
    ).toBe(false)

    expect(
      containsActiveCheckoutLanguage({
        status: 'checkout_pending',
        checkoutNote: 'Checkout URL pending provider selection.',
        ctaHref: 'mailto:samfrench@gmail.com',
      }),
    ).toBe(true)
  })

  it('blocks active payment-provider and purchase language even when launch is pending', () => {
    expect(
      containsActiveCheckoutLanguage({
        checkoutNote: 'Checkout is pending until the payment provider is selected. Buy now.',
      }),
    ).toBe(true)
    expect(containsActiveCheckoutLanguage({ checkoutNote: 'Payment link will be added later.' })).toBe(true)
    expect(containsActiveCheckoutLanguage({ checkoutNote: 'Stripe checkout is disabled for now.' })).toBe(true)
    expect(containsActiveCheckoutLanguage({ checkoutNote: 'StripeCheckout stays disabled for now.' })).toBe(true)
    expect(containsActiveCheckoutLanguage({ checkoutNote: 'StripePaymentLink stays disabled for now.' })).toBe(true)
    expect(containsActiveCheckoutLanguage({ ctaLabel: 'Buy now after provider approval.' })).toBe(true)
  })

  it('does not treat ordinary words containing stripe as payment-provider copy', () => {
    expect(containsActiveCheckoutLanguage({ prompt: 'Use a striped cart wheel as a pretend detail.' })).toBe(false)
  })
})
