import SchemaBuilder from '@pothos/core'
import { DateResolver } from 'graphql-scalars'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
// import { Prisma } from '@prisma/client'
import { prisma } from './db'

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date; }
  }
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma
  }
})


builder.addScalarType('Date', DateResolver,{})
