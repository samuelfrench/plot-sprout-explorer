# Checkout Provider Decision Plan

Date: 2026-06-02

## Batch 6 Outcome

Choose a hosted checkout-link path first, but do not enable checkout in the repo yet.

The first product is the static `$9` Rainy Day Story Quest Pack. It stays `checkout_pending` until both conditions are true:

- Sam explicitly chooses a provider.
- The real downloadable product artifact exists and Sam supplies the real provider-hosted checkout URL.

Do not build a custom checkout API, webhook endpoint, cart, account system, upload flow, or child profile system for the first product.

## Provider Order

Recommended order:

1. Creem hosted checkout link
2. Dodo Payments hosted no-code checkout link
3. Stripe Payment Links
4. Polar Checkout Links

## Why Creem First

Creem is the best current fit for a simple digital-product launch because its official docs/pages describe:

- Merchant-of-record positioning for SaaS, digital products, and AI tools.
- One-time payments for digital products, templates, courses, or software licenses.
- Product dashboard setup followed by copying a payment link from the product.
- A public rate claim of `3.9% + 40c` per successful transaction as of this decision date.

Sources:

- `https://docs.creem.io/getting-started/introduction`
- `https://docs.creem.io/features/checkout/checkout-link`
- `https://www.creem.io/pricing`

## Backup Paths

Dodo Payments is the second path because its docs and product pages describe no-code checkout links, digital-product sales, global payments, one-time payments, and merchant-of-record coverage. Use it if Creem account setup or payout setup is blocked.

Sources:

- `https://docs.dodopayments.com/introduction`
- `https://dodopayments.com/archive/solutions/no-code-checkout`

Stripe Payment Links is the mature fallback. Stripe docs explicitly support no-code Payment Links and a Stripe-hosted payment page, with Stripe Tax support. Use Stripe if the merchant-of-record providers create onboarding friction or payout uncertainty.

Sources:

- `https://docs.stripe.com/payment-links`
- `https://stripe.com/us/payments/payment-links`

Polar Checkout Links are a developer-friendly fallback for digital products. Current docs support hosted checkout links, success URLs, return URLs, metadata, and product links, but true multi-product checkout is not supported; customers choose one product from a multi-product link.

Sources:

- `https://polar.sh/docs/features/checkout/links`
- `https://polar.sh/docs/features/products`

## Safe Wiring Steps

Do this only after Batch 7 creates the actual downloadable pack artifact and Sam explicitly chooses the provider.

1. Create one provider product in the chosen provider dashboard:
   - Name: `Rainy Day Story Quest Pack`
   - Price: `$9`
   - Type: one-time digital product
   - Product status: live only after the downloadable pack exists and provider fulfillment is configured

2. Configure provider-hosted fulfillment or keep checkout disabled:
   - If the provider can securely deliver the downloadable file after payment, use that.
   - If not, do not launch checkout yet.
   - Do not add a public download URL to this repo before purchase gating exists.

3. Add the checkout URL in one content file only:
   - Update `content/products/batch5-products.json`
   - Change `status` from `checkout_pending` to a deliberately named ready state only after the validator supports it.
   - Change `ctaHref` from `mailto:` to the provider-hosted checkout URL.
   - Change `ctaLabel` to `Buy the pack` only after the URL is live.
   - Update `checkoutNote` so it names hosted checkout and provider fulfillment without implying accounts, uploads, or public publishing.

4. Tighten validation before committing:
   - Add a checkout-ready validator path only for the chosen provider.
   - Allow only the exact chosen provider host and documented hosted-checkout URL shape.
   - Keep all other payment-provider words blocked.
   - Keep `student accounts`, `uploads`, `public publishing`, and custom checkout APIs blocked.
   - Add a focused test for the chosen provider URL.
   - Add a local artifact-exists guard so checkout cannot be marked ready while the pack ZIP/PDF folder is missing.

5. Verify and deploy:
   - Run `npm run verify`.
   - Browser-test homepage to product page.
   - Browser-test the product CTA target without submitting payment.
   - Commit and push.
   - Wait for the self-hosted Pages deploy.
   - Live-smoke the product route and CTA href.

## Hard No

- No custom public checkout endpoint.
- No webhook endpoint until there is a backend with authentication, signature verification, replay protection, and tests.
- No checkout URL committed until the downloadable product artifact exists.
- No child accounts, public student profiles, uploads, or public story publishing.
- No GitHub Actions content generation or image generation.
- No product claim that the pack is purchasable while `status` is `checkout_pending`.
- No fallback to cloud image generation or automated product generation workflows for this pack.

## Next Batch

Batch 7 should create the actual Rainy Day Story Quest Pack artifact before any live checkout URL is added:

- Printable PDF pages.
- Source markdown/HTML for each page.
- A ZIP artifact or provider-upload-ready folder.
- Local validation that the product artifact exists before checkout can be marked ready.
