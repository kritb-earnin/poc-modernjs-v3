import { defineServerConfig } from '@modern-js/server-runtime'
import { baseLogger } from '@/server/lib/logger'
import loggerMiddleware from '@/server/middlewares/logger'

export default defineServerConfig({
    middlewares: [
        { name: 'loggerMiddleware', handler: loggerMiddleware(baseLogger), order: 'pre' }
    ]
})
