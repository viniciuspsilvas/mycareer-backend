import express, { Request, Response } from 'express'
import http from 'http'
import 'reflect-metadata'

// This function will create a new server Apollo Server instance -
export const createApolloServer = async (options = { port: 3000 }) => {
  const app = express()
  const httpServer = http.createServer(app)

  app.get('/hc', (req: Request, res: Response) => res.json({ status: 'ok' }))

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: options.port }, resolve))

  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server ready at http://localhost:${options.port}/`)
  }
}
