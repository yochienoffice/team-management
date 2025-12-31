// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createLeague, ILeague } from "../../model/mongo/league";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Omit<ILeague, "id">;
    const createdLeague = await createLeague(body);
    revalidatePath("/schedule-management/schedule");
    return NextResponse.json(createdLeague, { status: 201 });
  } catch (error) {
    console.error("POST /api/league/create error:", error);
    return NextResponse.json({ message: "Error creating league" }, { status: 500 });
  }
}
