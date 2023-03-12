/**
 *
 * NOTE: This file is JavaScript because ts-node
 * is not available by the time it runs in the container.
 */
const { PrismaClient } = require('@prisma/client')

const users = require('./seeds/users')

const db = new PrismaClient()

async function run() {
  await db.user.createMany({ data: users, skipDuplicates: true })

}

run()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
