import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@opentelemetry/api', () => {
  const mockSpan = {
    spanContext: () => ({ traceId: 'trace-123', spanId: 'span-456' })
  }
  return {
    context: { active: vi.fn() },
    trace: { getSpan: vi.fn().mockReturnValue(mockSpan) }
  }
})

import type { MiddlewareHandler } from '@modern-js/server-runtime'
import { loggerMiddleware } from './index'
import type { Logger } from 'pino'

describe('loggerMiddleware', () => {
  let mockContext: Parameters<MiddlewareHandler>[0]
  let mockNext: Parameters<MiddlewareHandler>[1]
  let mockBaseLogger: { child: ReturnType<typeof vi.fn> }
  let mockChildLogger: Record<string, unknown>
  let contextStore: Map<string, unknown>
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    process.env.DD_SERVICE = 'web2-test'
    process.env.MODERN_APP_VERSION = '1.0.0'

    mockChildLogger = { info: vi.fn(), error: vi.fn() }
    mockBaseLogger = { child: vi.fn().mockReturnValue(mockChildLogger) }

    contextStore = new Map()
    contextStore.set('anonymousUserId', 'anon-123')
    contextStore.set('deviceId', 'device-456')

    mockContext = {
      req: {
        method: 'GET',
        path: '/test',
        queries: vi.fn().mockReturnValue({ foo: 'bar' })
      },
      get: vi.fn((key: string) => contextStore.get(key)),
      set: vi.fn((key: string, val: unknown) => contextStore.set(key, val))
    } as unknown as Parameters<MiddlewareHandler>[0]

    mockNext = vi.fn()
  })

  afterEach(() => {
    process.env = originalEnv
    vi.clearAllMocks()
  })

  it('should create a child logger with request context', async () => {
    const middleware = loggerMiddleware(mockBaseLogger as unknown as Logger)
    await middleware(mockContext, mockNext)

    expect(mockBaseLogger.child).toHaveBeenCalledWith(
      expect.objectContaining({
        trace_id: 'trace-123',
        span_id: 'span-456',
        req: {
          method: 'GET',
          path: '/test',
          query: { foo: 'bar' }
        },
        usr: expect.objectContaining({
          anonymous_id: 'anon-123',
          device_id: 'device-456'
        }),
        service: 'web2-test',
        version: '1.0.0'
      })
    )
  })

  it('should set the child logger in context', async () => {
    const middleware = loggerMiddleware(mockBaseLogger as unknown as Logger)
    await middleware(mockContext, mockNext)

    expect(mockContext.set).toHaveBeenCalledWith('logger', mockChildLogger)
  })

  it('should call next', async () => {
    const middleware = loggerMiddleware(mockBaseLogger as unknown as Logger)
    await middleware(mockContext, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })
})
