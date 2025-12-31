// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createGame, IGame } from "../../model/mongo/game";

// export async function GET() {
//   try {
//     const gameData = await getGames();
//     return NextResponse.json(gameData);
//   } catch (error) {
//     console.error("Error fetching games:", error);
//     return NextResponse.json(
//       { message: "Error fetching games" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Omit<IGame, "id">;
    const createdStats = await createGame(body);
    revalidatePath("/schedule-management/game");
    return NextResponse.json(createdStats, { status: 201 });
  } catch (error) {
    console.error("POST /api/game error:", error);
    return NextResponse.json({ message: "Error creating game" }, { status: 500 });
  }
}
