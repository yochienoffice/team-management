// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ILeague, updateLeague } from "../../model/mongo/league";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ILeague;
    const createdStats = await updateLeague(body.id, body);
    revalidatePath("/schedule-management/schedule");
    return NextResponse.json(createdStats, { status: 201 });
  } catch (error) {
    console.error("POST /api/league/update error:", error);
    return NextResponse.json({ message: "Error updateing league" }, { status: 500 });
  }
}
