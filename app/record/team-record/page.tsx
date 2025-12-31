"use client";

import { MouseEvent, useEffect, useState, useTransition } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/Table/data-table";
import { DataTableType } from "@/components/Table/types";
import { GameStatsColumns, StatsColumns } from "@/components/Table/columns";
import { IStats } from "@/app/api/model/mongo/stats";
import { updateGameStats } from "./Actions";
import Link from "next/link";

export default function TeamRecordPage() {
  const [gameStats, setGameStats] = useState<Stats[]>([]);
  const [playerData, setPlayerData] = useState<PlayerSimple[]>([]);

  useEffect(() => {
    fetchPlayers();
    fetchStats();
  }, []);

  async function fetchPlayers() {
    const res = await fetch("/api/player/read");
    if (!res.ok) throw new Error("Failed to fetch stats");
    else {
      const data = await res.json();
      setPlayerData(data as PlayerSimple[]);
    }
  }

  async function fetchStats() {
    const res = await fetch("/api/stats");
    if (!res.ok) throw new Error("Failed to fetch stats");
    else {
      const data = await res.json() as IStats[];
      console.log(data)
      setGameStats(data as Stats[]);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit flex items-center rounded-lg border border-slate-200 bg-slate-300">
        <Button
          className="bg-slate-300 hover:bg-hs-sidebar-hover rounded-lg rounded-r-none"
          asChild
        >
          <Link href={"/record/personal-record"}>
            {/* <span>{`Members（${memberList.length}）`}</span> */}
            <span>個人成績</span>
          </Link>
        </Button>

        <Button
          className="bg-hs-sidebar text-white hover:bg-hs-sidebar-hover rounded-lg rounded-l-none"
          asChild
        >
          <Link href={"/record/team-record"}>
            <span>球隊成績</span>
          </Link>
        </Button>
      </div>
      <hr className="my-4" />
      <DataTable
        data={gameStats}
        columns={StatsColumns}
        filter={DataTableType.STATS}
      />
    </div>
  );
}
