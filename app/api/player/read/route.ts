import { NextResponse } from "next/server";
import { getPlayers } from "../../model/mongo/player";

export async function GET() {
  try {
    const data = await getPlayers();
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/player/read error:", error);
    return NextResponse.json({ message: "Error gettign player" }, { status: 500 });
  }
}
