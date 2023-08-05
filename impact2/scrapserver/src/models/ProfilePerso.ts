import { builder } from "../builder";

builder.prismaObject("ProfilePerso", {
  fields: t => ({
      id: t.exposeID("id"),
      nom: t.exposeString("name"),
      createdAt: t.expose("createdAt", {
        type: "Date"
      }),
      profileperso: t.relation("user")
  })
})
