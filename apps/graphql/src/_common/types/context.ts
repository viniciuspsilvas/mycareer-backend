import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response

  payload?: { userId: string }
  // // Custom
  // userToken?: string
  // refreshToken?: string
  // rootToken: string
  // user?: User
}
