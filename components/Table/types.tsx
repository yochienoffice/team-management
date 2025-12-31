import { ActionType } from "@/app/api/model/enums/ActionType";
import { Row } from "@tanstack/react-table";

export interface DataTableRowAction<TData> {
  row?: Row<TData>;
  tableType: "Member" | "Manager";
  type: ActionType;
  dataSize?: number;
}

export enum DataTableType  {
  USERS = "球員",
  SCHEDULE = "賽程",
  TEAM = "球隊總覽",
  STATS = "數據統計",
}
