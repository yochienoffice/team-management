"use client";
import React, { forwardRef, useEffect, useState } from "react";
import PopupHint from "./PopupHint";
import { TabContent } from "@/utils/Models";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavTabProps extends React.HTMLAttributes<HTMLDivElement> {
  routes: Array<TabContent>;
}

const NavTab = forwardRef<HTMLDivElement, NavTabProps>(
  ({ className, routes, ...props }, ref) => {
    const pathname = usePathname();
    const [currentTab, setCurrentTab] = useState("");

    useEffect(() => {
      switch (pathname.split("/")[3]) {
        case "menu-events":
          setCurrentTab("Menu Events");
          break;
        case "menu-profiles":
          setCurrentTab("Menu Profiles");
          break;
        case "menu-items":
          setCurrentTab("Menu Items");
          break;
        case "menu-categories":
          setCurrentTab("Menu Categories");
          break;
        case "modifier-menu":
          setCurrentTab("Modifier Menu");
          break;
        case "modifier-items":
          setCurrentTab("Modifier Items");
          break;
        default:
          break;
      }
    }, [pathname]);

    return (
      <div className="flex flex-row flex-[1] h-full border-b-[1px] border-solid border-[#EAECF0]">
        {routes &&
          routes.map((route, index) => {
            return (
              <Link
                href={route.url}
                className={
                  "flex flex-row text-[#667085] m-2 ml-0 p-2 font-[700] justify-center items-center" +
                  (route.title == currentTab
                    ? " text-[#6941C6] border-b-2 border-solid border-[#6941C6]"
                    : "")
                }
                key={index}
                onClick={() => setCurrentTab(route.title)}
              >
                {route.title}
                <PopupHint
                  className={
                    route.title === currentTab
                      ? "bg-[#F9F5FF] text-[#6941C6] "
                      : "bg-[#F2F4F7] text-[#344054] "
                  }
                >
                  {route.displayHint && (
                    <>
                      <div className="m-4 text-[#344054] font-[600] text-sm">
                        {route.hint && route.hint.header}
                      </div>
                      <div className="m-4 text-[#667085] font-[300] text-sm">
                        {route.hint && route.hint.body}
                      </div>
                      <div className="m-4 text-[#344054] font-[300] text-sm">
                        {route.hint && route.hint.footer}
                      </div>
                    </>
                  )}
                </PopupHint>
              </Link>
            );
          })}
      </div>
    );
  }
);
NavTab.displayName = "NavTab";

export { NavTab };
