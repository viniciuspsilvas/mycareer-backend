import { Field, ID, InputType, Int, ObjectType } from 'type-graphql'

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

  @Field()
  email!: string

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  tokenVersion?: number

  @Field({ nullable: true })
  accessToken?: string

  @Field({ nullable: true })
  refreshToken?: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null
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

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken!: string
  @Field(() => User)
  user!: User
}
