import { ValidationError } from 'sequelize'

export const getErrorMessageFromSequelize = (
  error: any,
  message = 'Unknown Error',
  prefix = ''
) => {
  if (Array.isArray(error?.errors)) {
    message = error.errors.map((error: any) => error.message).join(', ')
  }

  return { message: `${prefix} ${message}` }
}
