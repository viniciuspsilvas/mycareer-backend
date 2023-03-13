import { Field, ID, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class Award {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Date, { nullable: false })
  grantedAt!: Date

  @Field(() => Date, { nullable: false })
  createdAt!: Date

  @Field(() => Date, { nullable: false })
  updatedAt!: Date
}

@InputType()
export class AwardInput {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  grantedAt!: Date

  toJSON() {
    return this
  }
}
