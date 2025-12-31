import { Button } from "@/components/ui/button";
import { ScheduleColumns } from "@/components/Table/columns";
import { DataTable } from "@/components/Table/data-table";
import Link from "next/link";
import { DataTableType } from "@/components/Table/types";
import { getLeagues } from "@/app/api/model/mongo/league";


export default async function SchedulePage() {
  const scheduleList = await getLeagues() as Schedule[];
  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit flex items-center rounded-lg border border-slate-200 bg-slate-300">
        <Button
          className="bg-hs-sidebar hover:bg-hs-sidebar-hover rounded-lg rounded-r-none"
          asChild
        >
          <Link href={"/schedule-management/schedule"}>
            {/* <span>{`Members（${memberList.length}）`}</span> */}
            <span>賽程</span>
          </Link>
        </Button>

        <Button
          className="bg-slate-300 text-white hover:bg-hs-sidebar-hover rounded-lg rounded-l-none"
          asChild
        >
          <Link href={"/schedule-management/game"}>
            <span>比賽</span>
          </Link>
        </Button>
      </div>
      <hr className="my-4" />
      <DataTable
        data={scheduleList}
        columns={ScheduleColumns}
        filter={DataTableType.SCHEDULE}
      />
    </div>
  );
}
