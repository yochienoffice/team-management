"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function RankCard({
  title,
  data,
  className,
  description,
}: RankCardProps) {
  return (
    <Card
      className={cn(
        `flex flex-col shadow-lg p-8 text-black`,
        className
      )}
    >
      <CardHeader className="flex py-4 text-xl">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4">
          {data &&
            data.map((d, index) => (
              <div
                key={index}
                className="before:block before:absolute before:top-3 before:left-0 before:w-full gap-10 before:border-slate-500 before:border-t relative after:clear-both after:block"
              >
                <h3
                  className={cn(
                    className,
                    "relative inline-block bg-slate-500 px-2"
                  )}
                >
                  {index + 1}
                </h3>
                <h3
                  className={cn(
                    "relative inline-block px-2 bg-white",
                    className
                  )}
                >
                  {d.name}
                </h3>
                <h3
                  className={cn(
                    "absolute inline-block px-2 top-0 right-0 bg-white",
                    className
                  )}
                >
                  {d.value}
                </h3>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
