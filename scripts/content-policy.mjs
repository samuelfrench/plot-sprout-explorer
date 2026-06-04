const activeCheckoutPatterns = [
  /buy now/i,
  /purchase now/i,
  /add to cart/i,
  /checkout url/i,
  /\bstripe(?:\s*checkout|\s*payment\s*links?|checkout|paymentlink)?\b/i,
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
  return checkoutStrings(value).some((text) => activeCheckoutPatterns.some((pattern) => pattern.test(text)))
}
