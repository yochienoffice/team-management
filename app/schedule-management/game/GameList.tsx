"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GameCard from "./GameCard";
import { useState } from "react";
import { ActionType } from "@/app/api/model/enums/ActionType";
import { EditGameSheet } from "./EditGameSheet";

export default function GameList({
  team,
  gameList,
  leagueList,
  hasPermission,
}: {
  team: Team;
  leagueList: Schedule[];
  gameList: Game[];
  hasPermission: Boolean;
}) {
  const [actionType, setActionType] = useState<ActionType>(ActionType.READ);

  return (
    <div className={`flex flex-col gap-2 ${`justify-center`} w-full`}>
      <Card className="bg-slate-300 text-white flex-1 w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            比賽列表
            {hasPermission && (
              <Button
                variant={"secondary"}
                onClick={() => setActionType(ActionType.CREATE)}
              >
                新增比賽
              </Button>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
      <div className={`grid xl:grid-cols-3 md:grid-cols-2 gap-2`}>
        {gameList &&
          gameList.length > 0 &&
          gameList.map((game, index) => {
            return (
              <GameCard
                team={team}
                game={game}
                league={leagueList.find(
                  (league) => league.id === game.leagueId
                )}
                className="text-slate-700"
              />
            );
          })}
      </div>
      {actionType === ActionType.CREATE ? (
        <EditGameSheet
          open={actionType === ActionType.CREATE}
          onOpenChange={() => setActionType(ActionType.READ)}
          type={actionType}
          game={null}
          leagueList={leagueList}
          dataSize={gameList.length}
        />
      ) : null}
    </div>
  );
}
