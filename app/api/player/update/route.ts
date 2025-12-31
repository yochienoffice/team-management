import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { IPlayer, updatePlayer } from "../../model/mongo/player";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as IPlayer;
    const updatedPlayer = await updatePlayer(body.number, body);
    revalidatePath("/users/members");
    return NextResponse.json(updatedPlayer, { status: 201 });
  } catch (error) {
    console.error("POST /api/player/update error:", error);
    return NextResponse.json({ message: "Error updating player" }, { status: 500 });
  }
}
