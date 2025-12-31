"use server";
import { revalidatePath } from "next/cache";
import { getStatsModel, IStats } from "../model/mongo/stats";
import { NextRequest, NextResponse } from "next/server";
import { getStats } from "../model/mongo/stats";

export async function createStats(
  statsData: {
    id: number;
    gameId: number;
    playerId: number;
    atBats: number;
    hits: number;
    rbis: number;
    runs: number;
    strikeouts: number;
    walks: number;
    doubles: number;
    triples: number;
    homeruns: number;
    notes?: string;
  }[]
) {
  const Stats = await getStatsModel();
  const createdStats: IStats[] = [];
  for (const data of statsData) {
    try {
      const stats = new Stats(data);
      await stats.save();
      createdStats.push(stats);
      console.log("Created stats:", stats.id);
    } catch (error: any) {
      console.error(`Failed to create stats:`, error.message);
    }
  }

  revalidatePath("/schedule-management/game");

  return createdStats;
}

export async function GET(req: NextRequest) {
  try {
    const statsData = await getStats();
    return NextResponse.json(statsData);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}
