import { UserRole } from '@prisma/client'
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role'
})

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

  @Field(() => UserRole)
  role!: UserRole

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

  @Field()
  role!: UserRole

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
