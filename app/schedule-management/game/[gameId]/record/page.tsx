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

export default function LineupPage() {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const { toast } = useToast();
  const params = useParams();
  // 可能要加上displaySeq才能區分棒次
  const [gameStats, setGameStats] = useState<Stats[]>([]);
  const [originalStats, setOriginalStats] = useState<Stats[]>([]);

  const positions = [
    "P",
    "C",
    "1B",
    "2B",
    "3B",
    "SS",
    "LF",
    "CF",
    "RF",
    "FR",
    "EP",
  ];

  const [playerData, setPlayerData] = useState<PlayerSimple[]>([]);

  const updatePlayer = (index: number, value: string) => {
    // const selectedPlayer = playerData.find((p) => p.displayName === value);
    // const updated = [...players];
    // if (selectedPlayer) {
    //   updated[index].name = selectedPlayer.displayName;
    //   updated[index].number = selectedPlayer.number;
    //   setPlayers(updated);
    // }
  };

  useEffect(() => {
    fetchPlayers();
    fetchStats();
  }, []);

  const submitGameStats = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    startUpdateTransition(async () => {
      const dataNeedsUpdate = gameStats.filter((stat, index) => {
        const originalStat = originalStats.find((s) => s.id === stat.id);
        return JSON.stringify(stat) !== JSON.stringify(originalStat);
      });

      console.log("Data needs update:", dataNeedsUpdate);

      const { error } = await updateGameStats(dataNeedsUpdate as IStats[], params.gameId);

      if (error) {
        toast({
          title: "Error",
          description: error as string,
        });
        return;
      }
      toast({
        title: "Success",
        description: "Member Updated!",
      });
    });
  };

  async function fetchPlayers() {
    const res = await fetch("/api/player/read");
    if (!res.ok) throw new Error("Failed to fetch stats");
    else {
      const data = await res.json();
      setPlayerData(data as PlayerSimple[]);
    }
  }

  async function fetchStats() {
    const res = await fetch("/api/stats?gameId=" + params.gameId);
    if (!res.ok) throw new Error("Failed to fetch stats");
    else {
      const data = await res.json();
      setGameStats(data as Stats[]);
      setOriginalStats(data as Stats[]);
    }
  }

  const updateData = (rowIndex: number, columnId: string, value: unknown) => {
    setGameStats((oldData) =>
      oldData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: Number(value),
          };
        }
        return row;
      })
    );
  };

  // 需要處理球員名單是空的時候會出錯的狀況
   return (
    <div className="flex flex-col gap-2">
      <Button onClick={submitGameStats}>更新資料</Button>
      <DataTable
        data={gameStats}
        columns={GameStatsColumns}
        filter={DataTableType.STATS}
        updateData={updateData}
      />
    </div>
  );
}
