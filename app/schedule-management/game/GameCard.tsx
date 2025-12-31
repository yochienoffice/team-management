"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ActionType } from "@/app/api/model/enums/ActionType";
import { EditGameSheet } from "./EditGameSheet";
import Link from "next/link";

export default function GameCard({
  game,
  className,
  team,
  league,
}: GameCardProps) {
  const [actionType, setActionType] = useState<ActionType>(ActionType.READ);

  return (
    <div
      className={cn(
        `flex shadow-lg p-8 text-black rounded-lg  border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 border`,
        className
      )}
    >
      <div className="flex flex-col justify-between gap-4 flex-4 w-full">
        <span className="">
          <h5 className="text-md font-semibold text-slate-400">{`${game.date} ${game.time}`}</h5>
          <h5 className="text-lg font-semibold">{`${team.name} vs ${game.opponent}`}</h5>
        </span>
        <span className="">
          <h5 className="text-md text-slate-500">{`${league?.name}`}</h5>
        </span>
      </div>

      <div className="flex flex-col gap-4 text-xl flex-1">
        <Button onClick={() => setActionType(ActionType.UPDATE)}>
          編輯比賽
        </Button>

        <Button asChild>
          <Link href={`/schedule-management/game/${game.id}/order`}>
            <span>攻守名單</span>
          </Link>
        </Button>
        <Button>
          <Link href={`/schedule-management/game/${game.id}/record`}>
            <span>記錄比賽</span>
          </Link>
        </Button>
        <Button>比賽成績</Button>
      </div>
      {actionType === ActionType.UPDATE ? (
        <EditGameSheet
          open={actionType === ActionType.UPDATE}
          onOpenChange={() => setActionType(ActionType.READ)}
          type={actionType}
          game={game ?? null}
        />
      ) : null}
    </div>
  );
}
