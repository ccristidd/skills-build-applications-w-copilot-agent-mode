import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

export function useApiCollection(endpoint, fetcher = fetch) {
  const [state, setState] = useState({
    records: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchCollection(endpoint, controller.signal, fetcher)
      .then((records) => {
        setState({ records, loading: false, error: null })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ records: [], loading: false, error: error.message })
        }
      })

    return () => controller.abort()
  }, [endpoint, fetcher])

  return state
}
