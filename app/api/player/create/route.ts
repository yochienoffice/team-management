import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPlayer, IPlayer, updatePlayer } from "../../model/mongo/Player";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as IPlayer;
    const updatedPlayer = await createPlayer(body);
    revalidatePath("/users/members");
    return NextResponse.json(updatedPlayer, { status: 201 });
  } catch (error) {
    console.error("POST /api/player/create error:", error);
    return NextResponse.json({ message: "Error creating player" }, { status: 500 });
  }
}
