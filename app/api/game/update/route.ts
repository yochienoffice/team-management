// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { IGame, updateGame } from "../../model/mongo/game";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as IGame;
    const createdStats = await updateGame(body.id, body);
    revalidatePath("/schedule-management/game");
    return NextResponse.json(createdStats, { status: 201 });
  } catch (error) {
    console.error("POST /api/game error:", error);
    return NextResponse.json({ message: "Error creating game" }, { status: 500 });
  }
}
