import React from "react";
import OverviewDashboard from "./OverviewDashboard";
import { UserRole } from "../api/model/enums/UserRole";
import { getAggregatedStats, IStats } from "../api/model/mongo/stats";
import { NextResponse } from "next/server";

async function getCurrentUser(): Promise<User> {
  const data: User = {
    number: 52,
    name: "簡至右",
    identity: "A123456789",
    birthday: "1993.10.01",
    role: UserRole.ROOT,
  };

  return data;
}

async function fetchStats() {
  const res = await getAggregatedStats();
  const response = NextResponse.json(res)
  if (!response.ok) throw new Error("Failed to fetch stats");
  else {
    const data = (await response.json()) as IStats[];
    return data;
  }
}

export default async function TeamOverviewPageHome() {
  const statsList = await fetchStats();
  const user = await getCurrentUser();
  const isNormalUser = user.role === UserRole.TEAMMATE;
  const teamData: Team = {
    id: 1,
    name: "台北市議員李明賢慢壘隊",
    description: "",
  };

  return (
    <div className="bg-hs-main-bg">
      <main className="p-8 w-full flex justify-center">
        <section className="w-full h-min p-5 bg-white rounded-md shadow-list-shadow">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center">
              <OverviewDashboard
                team={teamData}
                hasPermission={!isNormalUser}
                stats={statsList}
              />
            </div>
            {/* <hr className="my-4" />
            <DataTable data={memberList} columns={MemberColumns} /> */}
          </div>
        </section>
      </main>
    </div>
  );
}
