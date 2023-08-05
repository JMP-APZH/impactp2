import { builder } from "../builder";

import { prisma } from "../db";

builder.prismaObject("User", {
  fields: t => ({
      id: t.exposeID("id"),
      nom: t.exposeString("nom"),
      profileperso: t.relation("profileperso"),
      createdAt: t.expose("createdAt", {
        type: "Date"
      }),
  })
})


builder.queryField("users", t => t.prismaField({
  type: ["User"],
  resolve: async (query, root, args, ctx, info) => {
    return prisma.user.findMany({ ...query })
  }
}))
