import { Button } from "@/components/ui/button";
import Link from "next/link";
import GameList from "./GameList";
import { getGames } from "@/app/api/model/mongo/game";
import { getLeagues } from "@/app/api/model/mongo/league";

// async function getLeagueData() {
//   const scheduleList = await fetchLeagues();
//   if (scheduleList) {
//     return scheduleList.sort((a, b) => a.id - b.id);
//   }
// }

export default async function GamePage() {
  const gameList =  await getGames() as Game[];
  const leagueList = await getLeagues() as Schedule[];
  // const user = await getCurrentUser();
  // const isNormalUser = user.role === UserRole.TEAMMATE;
  const teamData: Team = {
    id: 1,
    name: "台北市議員李明賢慢壘隊",
    description: "",
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit flex items-center rounded-lg border border-slate-200 bg-slate-300">
        <Button
          className="bg-slate-300 hover:bg-hs-sidebar-hover rounded-lg rounded-r-none"
          asChild
        >
          <Link href={"/schedule-management/schedule"}>
            {/* <span>{`Members（${memberList.length}）`}</span> */}
            <span>賽程</span>
          </Link>
        </Button>

        <Button
          className="bg-hs-sidebar text-white hover:bg-hs-sidebar-hover rounded-lg rounded-l-none"
          asChild
        >
          <Link href={"/schedule-management/game"}>
            <span>比賽</span>
          </Link>
        </Button>
      </div>
      <hr className="my-4" />
      <GameList
        team={teamData}
        gameList={gameList}
        hasPermission={true}
        leagueList={leagueList}
      />
    </div>
  );
}
