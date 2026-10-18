export const apiBaseUrl = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000'

function collectionFromPayload(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('The API returned an unexpected collection response.')
  }

  for (const key of ['results', 'items']) {
    if (Array.isArray(payload[key])) {
      return payload[key]
    }
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }
  if (payload.data && typeof payload.data === 'object') {
    return collectionFromPayload(payload.data)
  }

  throw new Error('The API response did not contain a list of records.')
}

export async function fetchCollection(endpoint, signal, fetcher = fetch) {
  const response = await fetcher(`${apiBaseUrl}${endpoint}`, { signal })
  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText}).`)
  }

  return collectionFromPayload(await response.json())
}
