import { appStore } from '../store/appStore.js'

export function addAlert({ key, message }) {
  const current = appStore.getState().alerts
  appStore.setState({
    alerts: {
      ...current,
      [key]: message
    }
  })
}
