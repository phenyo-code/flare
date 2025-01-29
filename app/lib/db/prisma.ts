import { PrismaClient } from '@prisma/client'

// Ensure that Prisma is not reinitialized in development mode (Next.js hot reload issue)
declare global {
  var prisma: PrismaClient | undefined
}

// Create a new PrismaClient if one doesn't exist globally
export const prisma = global.prisma || new PrismaClient()

// Assign to global object in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
