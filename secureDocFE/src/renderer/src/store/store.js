export function createStore(initialState) {
  let state = initialState
  const listeners = new Set()

  return {
    clear() {
      state = initialState
    },

    getState() {
      return state
    },

    setState(newState) {
      if (typeof newState === 'function') {
        state = {
          ...state,
          ...newState(state)
        }
      } else {
        state = {
          ...state,
          ...newState
        }
      }
      listeners.forEach((listener) => listener(state))
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }
  }
}
