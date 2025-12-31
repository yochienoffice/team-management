import * as z from "zod";

export const memberSchema = z.object({
  number: z.coerce.number().optional(),
  displayName: z.string().optional(),
  identity: z.string().optional(),
  birthDate: z.string().optional(),
  role: z.string().optional(),
})

export type MemberSchema = z.infer<typeof memberSchema>