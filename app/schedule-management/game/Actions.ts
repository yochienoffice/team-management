import { GameSchema } from "./Validations";

export async function createGame(input: GameSchema & { id: number }) {
  try {
    const game = {
      id: input.id,
      leagueId: Number(input.leagueId),
      date: input.date as any as Date,
      location: input.location || "",
      opponent: input.opponent,
      isHome: input.isHome || false,
      score: input.score,
      opponentScore: input.opponentScore,
      status: input.status || "SCHEDULED",
    };

    const result = await fetch("/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game),
    });

    console.log("All created game:", result);
    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err as string,
    };
  }
}

export async function updateGame(input: GameSchema & { id: number }) {
  try {
    const game = {
      id: input.id,
      leagueId: Number(input.leagueId),
      date: input.date as any as Date,
      location: input.location || "",
      opponent: input.opponent,
      isHome: input.isHome || false,
      score: input.score,
      opponentScore: input.opponentScore,
      status: input.status || "SCHEDULED",
    };

    const result = await fetch("/api/game/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game),
    });

    console.log("All created game:", result);
    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err as string,
    };
  }
}
