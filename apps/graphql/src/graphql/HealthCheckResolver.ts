import { hash } from 'bcryptjs'
import { CreateOneUserArgs, User } from 'prisma/generated/type-graphql'
import { Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'

@Resolver((of) => String)
export class HealthCheckResolver {
  @Query((returns) => String, { nullable: true })
  async healthLocal(): Promise<String | null> {
    return Date.now.toString()
  }
}
