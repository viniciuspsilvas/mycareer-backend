import { isAuth } from '../middleware/isAuth'
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Context } from '../_common'
import { Award, AwardInput } from './awardTypes'

@Resolver(() => Award)
export class AwardResolver {
  @Mutation(() => Award, {
    description: 'Create or update a single award record.'
  })
  async upsertAward(@Arg('data', () => AwardInput) data: AwardInput, @Ctx() { prisma }: Context) {
    const { id, title, description, grantedAt } = data

    return await prisma.award.upsert({
      where: { id: id || '' },
      update: {
        title,
        description,
        grantedAt
      },
      create: {
        title,
        description,
        grantedAt
      }
    })
  }

  @Query(() => [Award])
  @UseMiddleware(isAuth)
  awards(@Ctx() { prisma }: Context) {
    return prisma.award.findMany()
  }

  @Query(() => Award)
  @UseMiddleware(isAuth)
  awardById(@Ctx() { prisma }: Context, @Arg('id') id: string) {
    return prisma.award.findUnique({ where: { id } })
  }

  @Mutation(() => Award)
  @UseMiddleware(isAuth)
  deleteAwardById(@Ctx() { prisma }: Context, @Arg('id') id: string) {
    return prisma.award.delete({ where: { id } })
  }
}
