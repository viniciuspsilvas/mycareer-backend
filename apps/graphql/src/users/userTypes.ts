import { Field, ID, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string

  @Field()
  firstname!: string

  @Field()
  lastname!: string

  @Field({ nullable: true })
  mobile?: string

  @Field({ nullable: true })
  email?: string
}

@InputType()
export class UserInput {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field()
  email!: string

  @Field()
  password!: string

  @Field()
  firstname!: string

  @Field()
  lastname!: string

  toJSON() {
    return this
  }
}
