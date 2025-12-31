import { ScheduleSchema } from "./Validations";
import { createLeague } from "@/app/api/model/mongo/league";

export async function updateLeague(input: ScheduleSchema & { id: number }) {
  try {
    const league = {
      id: input.id,
      season: "2026-2027",
      name: input.name,
      startDate: "2026-01-01 00:00:00.000+00:00",
      endDate: "2099-01-01 00:00:00.000+00:00",
      notes: input.notes || "",
    };

    let result;

    if (input.id <= 0) {
      result = await fetch("/api/league/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(league),
      });
    } else {
      result = await fetch("/api/league/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(league),
      });
    }

    console.log("All created league:", result);
    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err,
    };
  }
}
