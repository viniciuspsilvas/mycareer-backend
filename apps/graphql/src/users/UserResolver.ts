import { compare, hash } from 'bcryptjs'
import { verify } from 'jsonwebtoken'
import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Context } from '../_common'
import { createRefreshToken, createAccessToken } from './auth'
import { sendRefreshToken } from './sendRefreshToken'
import { LoginResponse, User, UserInput } from './userTypes'

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User, {
    description: 'Create or update a single user record.'
  })
  async upsertUser(@Arg('data', () => UserInput) data: UserInput, @Ctx() { prisma }: Context) {
    const { id, firstname, lastname, email, password } = data
    const hashedPassword = await hash(password, 12)

    return await prisma.user.upsert({
      where: { id: id || '' },
      update: {
        firstname,
        lastname,
        password: hashedPassword,
        email
      },
      create: {
        firstname,
        lastname,
        password: hashedPassword,
        email,
        tokenVersion: 0
      }
    })
  }

  @Query(() => [User])
  users(@Ctx() { prisma }: Context) {
    return prisma.user.findMany()
  }

  @Mutation(() => User)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res, prisma }: Context
  ): Promise<User> {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new Error('could not find user')
    }

    const valid = await compare(password, user.password)

    if (!valid) {
      throw new Error('bad password')
    }

    sendRefreshToken(res, createRefreshToken(user))

    return {
      accessToken: createAccessToken(user),
      ...user
    }
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { prisma, req }: Context) {
    const authorization = req.headers['authorization']

    if (!authorization) {
      return null
    }

    try {
      const token = authorization.split(' ')[1]
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!)

      return prisma.user.findUnique({ where: { id: payload.userId } })
    } catch (err) {
      console.log(err)
      return null
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '')

    return true
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Ctx() { prisma }: Context, @Arg('id', () => ID) id: string) {
    await prisma.user.update({
      where: {
        id
      },
      data: {
        tokenVersion: {
          increment: 1
        }
      }
    })

    return true
  }
}
