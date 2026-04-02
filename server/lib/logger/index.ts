import pino, { type Logger } from 'pino'
import dataDogStream from './datadog_stream'

/**
 * Creates and returns a base logger instance
 */
export function loggerFactory(): Logger {
  const baseLoggerConfig = {
    name: process.env.DD_SERVICE,
    level: process.env.LOG_LEVEL || 'info'
  }

  if (process.env.DD_ENV === 'localhost') {
    // Local development: pretty-print logs
    return pino({
      ...baseLoggerConfig,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true }
      }
    })
  }

  return pino(baseLoggerConfig, dataDogStream())
}

export const baseLogger = loggerFactory()

export default baseLogger
