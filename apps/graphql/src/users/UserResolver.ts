import { compare, hash } from 'bcryptjs'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res, prisma }: Context
  ): Promise<LoginResponse> {
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
      user
    }
  }
}
