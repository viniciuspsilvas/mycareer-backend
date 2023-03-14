import { MiddlewareFn } from 'type-graphql'
import { verify } from 'jsonwebtoken'
import { Context } from '../_common'

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const authorization = context.req.headers['authorization']

  if (!authorization) {
    throw new Error('not authenticated')
  }

  try {
    const accessToken = authorization.split(' ')[1]
    const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
    context.payload = payload as any
  } catch (err) {
    console.log(err)
    throw new Error('not authenticated')
  }

  return next()
}
