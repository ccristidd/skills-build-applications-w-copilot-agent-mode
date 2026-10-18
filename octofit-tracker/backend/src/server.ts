import express from 'express'
import mongoose from 'mongoose'
import { connectDatabase } from './config/database'
import { apiRouter } from './routes/api'

const app = express()
const port = Number(process.env.PORT ?? 8000)

app.use(express.json())
app.use((_request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (_request.method === 'OPTIONS') {
    response.sendStatus(204)
    return
  }
  next()
})

app.get('/api/health/', (_request, response) => {
  const connected = mongoose.connection.readyState === 1
  response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  })
})

app.use('/api', apiRouter)

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof mongoose.Error.ValidationError) {
      response.status(400).json({ error: error.message })
      return
    }
    if (error instanceof mongoose.Error.CastError) {
      response.status(400).json({ error: 'Invalid value for resource field' })
      return
    }
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      response
        .status(409)
        .json({ error: 'A resource with that unique value already exists' })
      return
    }

    console.error('Unhandled API error:', error)
    response.status(500).json({ error: 'Internal server error' })
  },
)

async function startServer(): Promise<void> {
  await connectDatabase()
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening on port ${port}`)
  })
  server.on('error', (error) => {
    console.error('Unable to start OctoFit API:', error)
    void mongoose
      .disconnect()
      .catch((disconnectError: unknown) => {
        console.error('Unable to close MongoDB connection:', disconnectError)
      })
      .finally(() => {
        process.exitCode = 1
      })
  })
}

startServer().catch((error: unknown) => {
  console.error('Unable to connect to MongoDB:', error)
  process.exitCode = 1
})