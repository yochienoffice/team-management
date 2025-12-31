import { Button } from "@/components/ui/button";
import { StatsColumns } from "@/components/Table/columns";
import { DataTable } from "@/components/Table/data-table";
import Link from "next/link";
import { StatsFakeData } from "@/utils/FakeData";
import { DataTableType } from "@/components/Table/types";

async function getStatsData(): Promise<Stats[]> {
  const data: Stats[] = StatsFakeData;

  return data;
}

export default async function PersonalRecordPage() {
  const statsList = (await getStatsData()) as Stats[];
  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit flex items-center rounded-lg border border-slate-200 bg-slate-300">
        <Button
          className="bg-hs-sidebar hover:bg-hs-sidebar-hover rounded-lg rounded-r-none"
          asChild
        >
          <Link href={"/record/personal-record"}>
            {/* <span>{`Members（${memberList.length}）`}</span> */}
            <span>個人成績</span>
          </Link>
        </Button>

        <Button
          className="bg-slate-300 text-white hover:bg-hs-sidebar-hover rounded-lg rounded-l-none"
          asChild
        >
          <Link href={"/record/team-record"}>
            <span>球隊成績</span>
          </Link>
        </Button>
      </div>
      <hr className="my-4" />
      <DataTable
        data={statsList}
        columns={StatsColumns}
        filter={DataTableType.STATS}
      />
    </div>
  );
}
