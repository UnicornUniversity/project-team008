import { appStore } from '../store/appStore.js'

export function addAlert({ key, message, severity }) {
  const current = appStore.getState().alerts
  appStore.setState({
    alerts: {
      ...current,
      [key]: { message, severity }
    }
  })
}
