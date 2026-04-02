import type { Context } from '@modern-js/server-runtime'
import type { Logger } from 'pino'

const loggerKey = 'logger'

/**
 * Set a logger instance in the server context
 */
export function setLogger(context: Context, logger: Logger): void {
  context.set(loggerKey, logger)
}

/**
 * Get the logger from the server context
 */
export function getLogger(context: Context): Logger {
  return context.get(loggerKey)
}
