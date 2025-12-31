import { NextResponse } from "next/server";
import { getLeagues } from "../../model/mongo/league";

export async function GET() {
  try {
    const data = await getLeagues();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/league/read error:", error);
    return NextResponse.json({ message: "Error getting league" }, { status: 500 });
  }
}
