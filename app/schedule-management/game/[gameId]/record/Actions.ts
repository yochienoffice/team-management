import { IStats } from "@/app/api/model/mongo/stats";

export async function updateGameStats(input: IStats[], gameId: string | null) {
  try {
    const result = await fetch("/api/stats?operation=updateGameStats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

    console.log(
      "All updated stats:",
      result
    );
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
