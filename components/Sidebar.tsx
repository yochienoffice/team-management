"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Sidebar({
  routes,
  className,
}: {
  routes: Route[];
  className?: string;
}) {
  return (
    <div
      className={cn("md:w-64 flex-col overflow-y-scroll no-scrollbar lg:overflow-y-hidden", className)}
    >
      {routes.map((route) => {
        return (
          <div key={route.name}>
            <h1 className="px-4 py-2 font-semibold">{route.name}</h1>
            <div className="pl-6 flex flex-col gap-2 items-start">
              {route.submenu!.map((subroute) => (
                <Button
                  variant={"sidebar-nested"}
                  className="w-full flex justify-start"
                  key={subroute.name}
                  asChild
                >
                  <Link href={subroute.url!}>
                    <span>{subroute.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
