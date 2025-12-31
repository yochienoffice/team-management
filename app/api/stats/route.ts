// app/api/stats/route.ts
import { NextResponse } from "next/server";
import {
  createManyStats,
  getAggregatedStats,
  getStats,
  getStatsByGameId,
  getStatsByPlayerId,
  IStats,
  updateManyStats,
} from "@/app/api/model/mongo/stats"; // 注意路徑

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const playerId = searchParams.get("playerId");

    if (gameId) {
      const data = await getStatsByGameId(Number(gameId));
      return NextResponse.json(data);
    }

    if (playerId) {
      const data = await getStatsByPlayerId(Number(playerId));
      return NextResponse.json(data);
    }

    const statsData = await getAggregatedStats();
    return NextResponse.json(statsData);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { message: "Error fetching stats" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const operation = searchParams.get("operation");

    if (operation === "updateGameStats") {
      const body = (await req.json()) as IStats[];
      const createdStats = await updateManyStats(body);
      return NextResponse.json(createdStats, { status: 201 });
    } else if (operation === "updateOrder") {
      const body = (await req.json()) as IStats[];
      const createdStats = await createManyStats(body);
      return NextResponse.json(createdStats, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/stats error:", error);
    return NextResponse.json(
      { message: "Error creating stats" },
      { status: 500 }
    );
  }
}
