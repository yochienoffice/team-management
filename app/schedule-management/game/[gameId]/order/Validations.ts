import * as z from "zod";

export const gameSchema = z.object({
  id: z.coerce.number(),
  leagueId: z.coerce.number(),
  date: z.string(),
  location: z.string().optional(),
  opponent: z.string(),
  isHome: z.boolean().optional(),
  score: z.coerce.number().optional(),
  opponentScore: z.coerce.number().optional(),
  status: z.string().optional(),
})

export type GameSchema = z.infer<typeof gameSchema>