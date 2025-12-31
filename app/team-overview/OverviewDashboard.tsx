"use client";

import RankCard from "@/components/RankCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateAVG, calculateHits, calculateStats } from "@/utils/RankUtil";

export default function OverviewDashboard({
  team,
  stats,
  hasPermission,
}: {
  team: Team;
  stats: Stats[];
  hasPermission: Boolean;
}) {
  const avgLeaders: RankData[] = calculateAVG(stats, 5);
  const hitsLeaders: RankData[] = calculateHits(stats, 5);
  const RBILeaders: RankData[] = calculateStats(stats, 5, "rbis");
  const strikeoutLeaders: RankData[] = calculateStats(stats, 5, "strikeouts");
  const bbLeaders: RankData[] = calculateStats(stats, 5, "walks");
  // const obpLeaders: RankData[] = calculateStats(stats, players, 5, "obp");
  // const opsLeaders: RankData[] = calculateStats(stats, players, 5, "ops");

  return (
    <div
      className={`flex flex-col gap-2 ${team ? `justify-between` : `justify-center`} w-full`}
    >
      <Card className="bg-hs-sidebar-hover text-white flex-1 w-full">
        <CardHeader>
          <CardTitle>球隊</CardTitle>
          <CardContent className="py-2 px-0 flex justify-between">
            <h1 className="text-4xl font-semibold">{`${team.name}`}</h1>
            {hasPermission && <Button variant={"secondary"}>編輯球隊</Button>}
          </CardContent>
        </CardHeader>
      </Card>
      {stats && stats.length > 0 ? (
        <div className={`grid xl:grid-cols-3 md:grid-cols-2 gap-2`}>
          <RankCard
            title="打擊率"
            data={avgLeaders}
            className="bg-hs-sidebar-hover text-white"
          />
          <RankCard
            title="安打"
            data={hitsLeaders}
            description="計算公式: H + 2B + 3B + HR"
            className="text-slate-700"
          />
          <RankCard
            title="打點"
            data={RBILeaders}
            description="扣除掉失誤與趁傳後，打回來的分數"
            className="text-slate-700"
          />

          <RankCard
            title="被三振"
            data={strikeoutLeaders}
            className="text-slate-700"
          />

          <RankCard title="四壞" data={bbLeaders} className="text-slate-700" />

          {/* <RankCard
            title="上壘率(OBP)"
            description="計算方式: (安打數 + 四壞數) / 打席數"
            data={obpLeaders}
            className="text-slate-700"
          />

          <RankCard
            title="攻擊指數(OPS)"
            description="計算方式: OPS=OBP+SLG; SLG = (1B+2*2B+3*3B+4*HR)/AB"
            data={opsLeaders}
            className="text-slate-700"
          /> */}
        </div>
      ) : (
        <Card className="bg-hs-white flex-1 ">
          <CardHeader className="flex justify-center">
            <CardTitle className="text-slate-300">
              目前無比賽記錄相關資料
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
