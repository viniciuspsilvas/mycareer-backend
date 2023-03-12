import { hash } from 'bcryptjs'
import { CreateOneUserArgs, User } from 'prisma/generated/type-graphql'
import { Args, Ctx, Mutation, Resolver } from 'type-graphql'

@Resolver((_of) => User)
export class UserResolver {
  @Mutation((_returns) => User, {
    nullable: false
  })
  async createOneUser(@Ctx() ctx: any, @Args() { data }: CreateOneUserArgs): Promise<User> {
    const hashedPassword = await hash(data.password, 12)

    return await ctx.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    })
  }
}
