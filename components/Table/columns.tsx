"use client";

import { MemberItem } from "@/utils/Models";
import { ColumnDef, Row, RowData } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, Edit, Plus } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { DataTableRowAction } from "./types";
import { ActionType } from "@/app/api/model/enums/ActionType";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { calculateAVG, calculateOBP, calculateOPS, calculateSLG } from "@/utils/StatsUtil";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    setRowAction: React.Dispatch<
      React.SetStateAction<
        DataTableRowAction<MemberItem> | DataTableRowAction<Schedule> | null
      >
    >;
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export const MemberColumns: ColumnDef<MemberItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    filterFn: "includesString",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          背號
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const number: number = row.getValue("number");
      return <span className="font-semibold">{number}</span>;
    },
  },
  {
    accessorKey: "displayName",
    header: "姓名",
    cell: ({ row }) => {
      const displayName = row.getValue("displayName");
      return <span className="text-slate-500">{`${displayName}`}</span>;
    },
  },
  // {
  //   accessorKey: "identity",
  //   header: "身分證字號",
  //   cell: ({ row }) => {
  //     const identity = (row.getValue("identity") as string).replaceAll(
  //       /\d+/g,
  //       "*********"
  //     );
  //     return <span className="text-slate-500">{`${identity}`}</span>;
  //   },
  // },
  {
    accessorKey: "birthDate",
    header: "生日",
    cell: ({ row }) => {
      const birthDate = row.getValue("birthDate");
      return <span className="text-slate-500">{`${birthDate}`}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: ({ table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Edit className="text-slate-400" size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>動作</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>刪除選取的球員</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              table.options.meta?.setRowAction({
                row: undefined,
                type: ActionType.UPDATE,
                tableType: "Member",
              });
            }}
          >
            新增球員
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    cell: ({ row, table }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Edit className="text-blue-400" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>動作</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(member.id.toString())
              }
            >
              Copy Member ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.setRowAction({
                  row,
                  type: ActionType.UPDATE,
                  tableType: "Manager",
                });
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const ManagerColumns: ColumnDef<MemberItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "背號",
    cell: ({ row }) => {
      const number: number = row.getValue("number");
      return <span className="font-semibold">{number}</span>;
    },
  },
  {
    accessorKey: "displayName",
    header: "姓名",
    cell: ({ row }) => {
      const name = row.getValue("displayName");
      return <span className="text-slate-500">{`${name}`}</span>;
    },
  },
  // {
  //   accessorKey: "identity",
  //   header: "身分證字號",
  //   cell: ({ row }) => {
  //     const identity = (row.getValue("identity") as string).replaceAll(
  //       /\d+/g,
  //       "*********"
  //     );
  //     return <span className="text-slate-500">{`${identity}`}</span>;
  //   },
  // },
  {
    accessorKey: "birthDate",
    header: "生日",
    cell: ({ row }) => {
      const birthDate = row.getValue("birthDate");
      return <span className="text-slate-500">{`${birthDate}`}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: ({ table }) => {
      const row = table.getRowModel().rows[0];
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Edit className="text-slate-400" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>動作</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>刪除選取的管理員</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.setRowAction({
                  row: undefined,
                  type: ActionType.UPDATE,
                  tableType: "Manager",
                });
              }}
            >
              新增管理員
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row, table }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Edit className="text-blue-400" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>動作</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.setRowAction({
                  row: row,
                  type: ActionType.UPDATE,
                  tableType: "Manager",
                });
              }}
            >
              編輯
            </DropdownMenuItem>
            <DropdownMenuItem>刪除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const StatsColumns: ColumnDef<Stats>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "背號",
    cell: ({ row }) => {
      const number: number = row.getValue("number");
      return <span className="font-semibold">{number}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "姓名",
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      return <span className="text-slate-500">{name}</span>;
    },
  },
  {
    accessorKey: "pa",
    header: "打席",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  {
    accessorKey: "atBats",
    header: "打數",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  {
    accessorKey: "hits",
    header: "一安",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  {
    accessorKey: "doubles",
    header: "二安",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  {
    accessorKey: "triples",
    header: "三安",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  {
    accessorKey: "homeruns",
    header: "全壘打",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  {
    accessorKey: "strikeouts",
    header: "三振",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  {
    accessorKey: "walks",
    header: "四壞",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return <span className="text-slate-500">{value as string}</span>;
    },
  },
  // {
  //   accessorKey: "sc",
  //   header: "SC",
  //   cell: ({ row }) => {
  //     const sc = row.getValue("birthday");
  //     return <span className="text-slate-500">{`${sc}`}</span>;
  //   },
  // },
  {
    accessorKey: "runs",
    header: "得分",
    cell: ({ row }) => {
      const runs = row.getValue("runs");
      return <span className="text-slate-500">{`${runs}`}</span>;
    },
  },
  {
    accessorKey: "rbis",
    header: "打點",
    cell: ({ row }) => {
      const rbis = row.getValue("rbis");
      return <span className="text-slate-500">{`${rbis}`}</span>;
    },
  },
  {
    accessorKey: "avg",
    header: "打擊率",
    cell: ({ row }) => {
      const stats = row.original;
      const avg: string = calculateAVG([stats]);
      return <span className="text-slate-500">{avg}</span>;
    },
  },
  {
    accessorKey: "obp",
    header: "上壘率",
    cell: ({ row }) => {
      const stats = row.original;
      const obp: string = calculateOBP([stats]);
      return <span className="text-slate-500">{obp}</span>;
    },
  },
  {
    accessorKey: "slg",
    header: "長打率",
    cell: ({ row }) => {
      const stats = row.original;
      const slg: string = calculateSLG([stats]);
      return <span className="text-slate-500">{slg}</span>;
    },
  },
  {
    accessorKey: "ops",
    header: "攻擊指數",
    cell: ({ row }) => {
      const stats = row.original;
      const ops: string = calculateOPS([stats]);
      return <span className="text-slate-500">{ops}</span>;
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: ({ table }) => (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button variant="ghost" className="h-8 w-8 p-0">
  //           <Edit className="text-slate-400" size={20} />
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end">
  //         <DropdownMenuLabel>動作</DropdownMenuLabel>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem>刪除選取的球員</DropdownMenuItem>
  //         <DropdownMenuItem>新增球員</DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   ),
  //   cell: ({ row, table }) => {
  //     const member = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <Edit className="text-blue-400" size={20} />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>動作</DropdownMenuLabel>
  //           {/* <DropdownMenuItem
  //             onClick={() =>
  //               navigator.clipboard.writeText(member.id.toString())
  //             }
  //           >
  //             Copy Member ID
  //           </DropdownMenuItem> */}
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem
  //             onClick={() => {
  //               table.options.meta?.setRowAction({
  //                 row,
  //                 type: "update",
  //                 tableType: "Manager",
  //               });
  //             }}
  //           >
  //             Edit
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>Delete</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export const GameStatsColumns: ColumnDef<Stats>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "playerId",
    header: "背號",
    cell: ({ row }) => {
      const playerId: number = row.getValue("playerId");
      return <span className="font-semibold">{playerId}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "姓名",
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      return <span className="text-slate-500">{name}</span>;
    },
  },
  {
    accessorKey: "pa",
    header: "打席",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "atBats",
    header: "打數",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "hits",
    header: "一安",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "doubles",
    header: "二安",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "triples",
    header: "三安",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "homeruns",
    header: "全壘打",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "strikeouts",
    header: "三振",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "walks",
    header: "四壞",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
{
    accessorKey: "sacrifices",
    header: "犧飛",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "doublePlays",
    header: "雙殺打",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "runs",
    header: "得分",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
  {
    accessorKey: "rbis",
    header: "RBI",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData &&
          table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);
      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="text-slate-500 w-10"
        />
      );
    },
  },
];

export const ScheduleColumns: ColumnDef<Schedule>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id: number = row.getValue("id");
      return <span className="font-semibold">{id}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "賽程名稱",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return <span className="text-slate-500">{`${name}`}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: ({ table }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Edit className="text-slate-400" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>動作</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>刪除</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.setRowAction({
                  row: undefined,
                  type: ActionType.UPDATE,
                  tableType: "Manager",
                  dataSize: table.getRowModel().rows.length,
                });
              }}
            >
              新增
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row, table }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Edit className="text-blue-400" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>動作</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.setRowAction({
                  row,
                  type: ActionType.UPDATE,
                  tableType: "Manager",
                  dataSize: table.getRowModel().rows.length,
                });
              }}
            >
              編輯
            </DropdownMenuItem>
            <DropdownMenuItem>刪除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
