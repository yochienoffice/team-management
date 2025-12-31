import { getPlayers } from "@/app/api/model/mongo/player";
import { ManagerColumns } from "@/components/Table/columns";
import { DataTable } from "@/components/Table/data-table";
import { DataTableType } from "@/components/Table/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BackofficeManagersPage() {
  const playerList = await getPlayers();


  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit flex items-center rounded-lg border border-slate-200 bg-slate-300">
        <Button
          className="bg-slate-300 text-white hover:bg-hs-sidebar-hover rounded-lg rounded-r-none"
          asChild
        >
          <Link href={"/users/members"}>
            <span>球員</span>
          </Link>
        </Button>

        <Button
          className="bg-hs-sidebar hover:bg-hs-sidebar-hover rounded-none"
          asChild
        >
          <Link href={"/users/managers"}>
            <span>管理員</span>
          </Link>
        </Button>

        <Button
          className="bg-slate-300 text-white hover:bg-hs-sidebar-hover rounded-lg rounded-l-none"
          asChild
        >
          <Link href={"/users/role-groups"}>
            <span>權限管理</span>
          </Link>
        </Button>
      </div>
      <hr className="my-4" />
      <DataTable
        data={playerList}
        columns={ManagerColumns}
        filter={DataTableType.USERS}
      />
    </div>
  );
}
