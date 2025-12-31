import * as z from "zod";

export const scheduleSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  notes: z.string().optional(),
  season: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type ScheduleSchema = z.infer<typeof scheduleSchema>