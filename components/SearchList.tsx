"use client";

import React from "react";
import { Button } from "./ui/button";

export default function SearchList({
  dataList,
  onOpenChange,
  onClick,
  tagIndex,
}: {
  dataList: any[];
  onOpenChange: (value: boolean) => void;
  onClick: (value: string, index?: number) => void;
  tagIndex?: number;
}) {
  return (
    <div className="absolute top-full flex flex-col p-2 border z-50 w-full bg-white rounded-md gap-2 overflow-y-scroll max-h-[30dvh]">
      {dataList && dataList.length > 0 ? (
        dataList.map((data) => (
          <Button
            variant={"ghost"}
            className="justify-start"
            key={data.displayName}
            value={data.displayName}
            onClick={(e) => {
              onClick((e.target as HTMLButtonElement).value, tagIndex);
              onOpenChange(false);
            }}
          >
            {data.displayName}
          </Button>
        ))
      ) : (
        <div className="w-auto h-full flex justify-center items-center">
          No Item Found
        </div>
      )}
    </div>
  );
}
