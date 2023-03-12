import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import http from 'http'
import path from 'path'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { HealthCheckResolver } from './graphql/HealthCheckResolver'
import { UserResolver } from './users'

// >>> Add new RESOLVERS here! <<<
const resolvers = [UserResolver]

interface ContextValue {
  prisma?: PrismaClient
  token?: string
}

// This function will create a new server Apollo Server instance -
export const createApolloServer = async (options = { port: 3000 }) => {
  const app = express()
  const httpServer = http.createServer(app)
  app.get('/hc', (req: Request, res: Response) => res.json({ status: 'ok' }))

  const prisma = new PrismaClient()
  const schema = await buildSchema({
    resolvers: [HealthCheckResolver, ...resolvers],
    emitSchemaFile: path.resolve(__dirname, './graphql/generated/schema.graphql'),
    validate: false
  })

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer<ContextValue>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })
  // Ensure we wait for our server to start
  const serverInfo = await server.start()

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/',
    cors({
      origin: [/\.viniciusdeveloper\.com$/, 'https://studio.apollographql.com', 'http://localhost:8080'],
      credentials: true
    }),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    bodyParser.json({ limit: '50mb' }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token, prisma })
    })
  )

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: options.port }, resolve))

  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server ready at http://localhost:${options.port}/`)
  }

  // serverInfo is an object containing the server instance and the url the server is listening on
  return serverInfo
}
