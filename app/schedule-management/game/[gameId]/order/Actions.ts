import { createGames } from "@/app/api/GameAPI/route";
import { createStats } from "@/app/api/StatsAPI/route";

export async function updateOrder(input: Lineup[], gameId: string | null) {
  try {
    const orderList = input.map((item, index) => ({
      gameId: gameId ? Number(gameId) : 0,
      playerId: item.number,
    }));
    

    console.log(orderList);

    const result = await fetch("/api/stats?operation=updateOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderList),
  });

    console.log(
      "All created game:",
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
