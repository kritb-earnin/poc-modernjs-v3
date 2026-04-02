import { Writable } from 'node:stream'

export default function dataDogStream(): NodeJS.WritableStream {
  return new Writable({
    objectMode: true,
    async write(chunk, _encoding, callback) {
      try {
        // chunk is a JSON string (from pino), parse it to enrich if needed
        const log = JSON.parse(chunk.toString())
        // some metadata
        const enriched = {
          ...log,
          ddsource: 'nodejs',
          ddtags: `env:${process.env.DD_ENV}`
        }

        const res = await fetch(process.env.DD_OTLP_ENDPOINT as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'DD-API-KEY': process.env.DD_API_KEY as string
          },
          body: JSON.stringify(enriched),
          signal: AbortSignal.timeout(5000) // 5 seconds timeout
        })

        if (!res.ok) {
          const errorMsg = `DataDog log error: ${res.status} ${res.statusText}`
          throw new Error(errorMsg)
        }
        callback()
      } catch (err) {
        // log error and continue silently
        console.error('Error sending log to Datadog:', err)
        callback()
      }
    }
  })
}
