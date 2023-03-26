import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import http from 'http'
import { verify } from 'jsonwebtoken'
import path from 'path'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { AwardResolver } from './awards'
import { HealthCheckResolver } from './graphql/HealthCheckResolver'
import { UserResolver } from './users'
import { createAccessToken, createRefreshToken } from './users/auth'
import { sendRefreshToken } from './users/sendRefreshToken'
import { Context } from './_common'

// >>> Add new RESOLVERS here! <<<
const resolvers = [UserResolver, AwardResolver]

// This function will create a new server Apollo Server instance -
export const createApolloServer = async (options = { port: 3000 }) => {
  const prisma = new PrismaClient()

  const app = express()
  app.use(
    cors({
      origin: [/\.viniciusdeveloper\.com$/, 'https://studio.apollographql.com', 'http://localhost:8080', /localhost/],
      credentials: true
    })
  )

  app.use(cookieParser())
  // Body-parser middleware
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  const httpServer = http.createServer(app)

  app.get('/hc', (req: Request, res: Response) => res.json({ status: 'ok' }))

  const schema = await buildSchema({
    resolvers: [HealthCheckResolver, ...resolvers],
    emitSchemaFile: path.resolve(__dirname, './graphql/generated/schema.graphql'),
    validate: false
  })

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  // Ensure we wait for our server to start
  const serverInfo = await server.start()

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: options.port }, resolve))

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/',
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    bodyParser.json({ limit: '50mb' }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res, token: req.headers.token, prisma })
    })
  )

  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server ready at http://localhost:${options.port}/`)
  }

  // serverInfo is an object containing the server instance and the url the server is listening on
  return serverInfo
}
