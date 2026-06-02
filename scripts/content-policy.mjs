const allowedCheckoutPendingPhrases = [
  /checkout is pending/i,
  /checkout remains pending/i,
  /checkout.*pending until the payment provider is selected/i,
  /checkout.*pending until a payment provider is selected/i,
  /checkout.*provider is selected/i,
  /does not accept payment yet/i,
]

const activeCheckoutPatterns = [
  /buy now/i,
  /purchase now/i,
  /add to cart/i,
  /checkout url/i,
  /stripe/i,
  /lemon squeeze/i,
  /gumroad/i,
  /payment link/i,
  /pay now/i,
]

function checkoutStrings(value) {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap((item) => checkoutStrings(item))
  if (value && typeof value === 'object') return Object.values(value).flatMap((item) => checkoutStrings(item))
  return []
}

export function containsActiveCheckoutLanguage(value) {
  return checkoutStrings(value).some((text) => {
    const allowedPendingOnly = allowedCheckoutPendingPhrases.some((pattern) => pattern.test(text))
    return activeCheckoutPatterns.some((pattern) => pattern.test(text)) && !allowedPendingOnly
  })
}
