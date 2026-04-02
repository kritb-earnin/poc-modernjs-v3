import { setLogger } from '@/server/lib/context/logger'
import type { MiddlewareHandler } from '@modern-js/server-runtime'
import { context, trace } from '@opentelemetry/api'
import type { Logger } from 'pino'

export const loggerMiddleware =
  (baseLogger: Logger): MiddlewareHandler =>
  async (ctx, next) => {
    const span = trace.getSpan(context.active())
    const spanCtx = span?.spanContext()

    // Create a child logger with request-specific context
    const requestLogger = baseLogger.child({
      trace_id: spanCtx?.traceId,
      span_id: spanCtx?.spanId,
      req: {
        method: ctx.req.method,
        path: ctx.req.path,
        query: ctx.req.queries()
      },
    })

    setLogger(ctx, requestLogger)
    await next()
  }

export default loggerMiddleware
