import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { User } from '../../users'

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
  // Custom
  userToken?: string
  refreshToken?: string
  rootToken: string
  user?: User
}
