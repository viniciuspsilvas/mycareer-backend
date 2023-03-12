import { hash } from 'bcryptjs'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Context } from '../_common'
import { User, UserInput } from './userTypes'

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User, {
    description: 'Create or update a single user record.'
  })
  async upsertUser(@Arg('data', () => UserInput) data: UserInput, @Ctx() ctx: Context) {
    const { id, firstname, lastname, email, password } = data
    const hashedPassword = await hash(password, 12)

    return await ctx.prisma.user.upsert({
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
        email
      }
    })
  }
}
