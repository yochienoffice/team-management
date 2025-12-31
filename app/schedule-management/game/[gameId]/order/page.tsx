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
import { updateOrder } from "./Actions";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { set } from "date-fns";
import { IStats } from "@/app/api/model/mongo/stats";

export default function LineupPage() {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  // 可能要加上displaySeq才能區分棒次
  const [players, setPlayers] = useState([
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
  ]);

  const [benchPlayers, setBenchPlayers] = useState([
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
    { name: "", position: "", number: -1 },
  ]);

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
    const selectedPlayer = playerData.find((p) => p.number.toString() === value);
    const updated = [...players];
    if (selectedPlayer) {
      updated[index].name = selectedPlayer.displayName;
      updated[index].number = selectedPlayer.number;
      setPlayers(updated);
    }
  };

  const updateBenchPlayer = (index: number, value: string) => {
    const selectedPlayer = playerData.find((p) => p.number.toString() === value);
    const updated = [...benchPlayers];
    if (selectedPlayer) {
      updated[index].name = selectedPlayer.displayName;
      updated[index].number = selectedPlayer.number;
      setBenchPlayers(updated);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchStats();
  }, []);

  const submitOrder = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    startUpdateTransition(async () => {
      // if (!member) return;
      const fullLineup = [...players, ...benchPlayers].filter(
        (p) => p.number !== -1
      );

      const { error } = await updateOrder(fullLineup, params.gameId);

      if (error) {
        toast({
          title: "錯誤",
          description: error as string,
        });
        return;
      }
      toast({
        title: "成功",
        description: "攻守名單已更新！",
      });
      router.push(`/schedule-management/game`);
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
      const data = (await res.json()) as IStats[];
      console.log(data);
      const updated = [...players];
      const benchUpdated = [...benchPlayers];
      data.forEach((stat, index) => {
        if (index < 10) {
          updated[index].name = "";
          updated[index].number = stat.playerId;
        } else {
          benchUpdated[index - 10].name = "";
          benchUpdated[index - 10].number = stat.playerId;
        }
      });
      setPlayers(updated);
      setBenchPlayers(benchUpdated);
    }
  }

  // 需要處理球員名單是空的時候會出錯的狀況
  return (
    <div className="p-6 mx-auto grid gap-4">
      <h1 className="text-3xl font-bold mb-4 text-center">攻守名單</h1>

      <div className="flex justify-center gap-4">
        <Card className="rounded-2xl shadow p-2 flex flex-col gap-2">
          {players.map((p, i) => (
            <CardContent
              key={i}
              className="grid grid-cols-12 gap-4 justify-center items-center p-0 px-4"
            >
              <CardHeader className="font-semibold text-lg col-span-2">
                {i + 1}
              </CardHeader>
              <Select
                onValueChange={(value) => updatePlayer(i, value)}
                value={p.number.toString()}
              >
                <SelectTrigger className="col-span-5">
                  <SelectValue placeholder="球員名稱" />
                </SelectTrigger>
                <SelectContent>
                  {playerData &&
                    playerData.length > 0 &&
                    playerData?.map((player) => (
                      <SelectItem
                        key={player.number}
                        value={player.number.toString()}
                      >
                        {`#${player.number} ${player.displayName}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* <Select
                onValueChange={(value) => updatePlayer(i, "position", value)}
                value={p.position}
              >
                <SelectTrigger className="col-span-5">
                  <SelectValue placeholder="守備位置" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </CardContent>
          ))}
        </Card>

        <Card className="rounded-2xl shadow p-2 flex flex-col gap-2">
          {benchPlayers.map((p, i) => (
            <CardContent
              key={i}
              className="grid grid-cols-12 gap-4 justify-center items-center p-0 px-4"
            >
              <CardHeader className="font-semibold text-lg col-span-2">
                {i + 11}
              </CardHeader>
              <Select
                onValueChange={(value) => updateBenchPlayer(i, value)}
                value={p.number.toString()}
              >
                <SelectTrigger className="col-span-5">
                  <SelectValue placeholder="球員名稱" />
                </SelectTrigger>
                <SelectContent>
                  {playerData &&
                    playerData.length > 0 &&
                    playerData?.map((player) => (
                      <SelectItem
                        key={player.number}
                        value={player.number.toString()}
                      >
                        {`#${player.number} ${player.displayName}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* <Select
                onValueChange={(value) => updatePlayer(i, "position", value)}
                value={p.position}
              >
                <SelectTrigger className="col-span-5">
                  <SelectValue placeholder="守備位置" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </CardContent>
          ))}
        </Card>
      </div>

      <Button
        className="w-full mt-4 py-6 rounded-2xl text-lg"
        disabled={isUpdatePending}
        onClick={(e) => submitOrder(e)}
      >
        {isUpdatePending && (
          <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        確認打序
      </Button>
    </div>
  );
}
