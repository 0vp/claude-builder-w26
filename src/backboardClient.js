export async function generatePersonalizedPage(payload) {
  const response = await fetch('/api/generate-page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate page.')
  }

  return data
}
