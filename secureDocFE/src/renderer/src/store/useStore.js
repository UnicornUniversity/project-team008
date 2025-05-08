import { useEffect, useMemo, useState } from 'react'

export function useStore(store, key) {
  const selector = useMemo(() => (state) => (key != null ? state[key] : state), [key])

  const [selected, setSelected] = useState(selector(store.getState()))

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setSelected(selector(newState))
    })
    return unsubscribe
  }, [store, selector])

  return selected
}
