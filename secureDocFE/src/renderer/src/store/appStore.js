import { createStore } from './store.js'

const initialState = {
  token: undefined,
  user: undefined,
  alerts: {}
}

const appStore = createStore(initialState)

export { appStore }
