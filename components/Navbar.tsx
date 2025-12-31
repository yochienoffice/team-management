"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { cn } from "@/lib/utils";
import { LogOutIcon, Contact, Users, ClipboardList, Trophy, Rss, Boxes } from "lucide-react";
import IconLogoTitle from "@/public/assets/img/logo-blackdog.png";

const routes: Route[] = [
  {
    name: "個人管理",
    url: "/personal-management",
    icon: <Contact />,
  },
  {
    name: "球隊總覽",
    url: "/team-overview",
    icon: <Boxes />,
  },
  {
    name: "賽程管理",
    url: "/schedule-management/schedule",
    icon: <ClipboardList />,
  },
  {
    name: "隊員管理",
    url: "/users/members",
    icon: <Users />,
  },
  {
    name: "數據統計",
    url: "/record/personal-record",
    icon: <Trophy />,
  },
  {
    name: "球隊公告",
    url: "/team-board",
    icon: <Rss />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname.includes("login");
  const isHomePage = pathname === "/";

  useEffect(() => {
    function directToLoginPage() {
      if (pathname === "/") {
        if (localStorage.getItem("token") != "") {
          router.push("/team-overview");
        } else {
          router.push("/login");
        }
      }
    }

    directToLoginPage();
  }, [pathname]);

  function handleLogoutClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    router.push("/login");
  }

  function NavTree({
    className,
    isMobile,
  }: {
    className: string;
    isMobile: boolean;
  }) {
    return (
      <div className={cn("flex-col gap-2 items-start md:w-60 overscroll-y-scroll no-scrollbar", className)}>
        {routes.map((route) => {
          if (route.collapsible) {
            return (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                key={`${route.name} route button`}
              >
                <AccordionItem value={route.name} className="w-full border-b-0">
                  <AccordionTrigger className="text-white w-full py-0 pr-2 hover:bg-blue-400 rounded-md transition hover:no-underline">
                    <div className="h-10 px-4 py-2 space-x-2 hover:bg-blue-400 flex justify-between items-center text-sm">
                      {route.icon}
                      <span>{route.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="ml-8 pb-0 flex flex-col gap-2 items-start">
                    {route.submenu?.map((subroute) => (
                      <Button
                        variant={"navbar-nested"}
                        className="w-full flex justify-start text-slate-300"
                        key={`${subroute.name} route button`}
                      >
                        <Link className="space-x-2" href={subroute.url!}>
                          <span>{subroute.name}</span>
                        </Link>
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          } else {
            return (
              <div className="w-full" key={`${route.name} route`}>
                {isMobile ? (
                  <SheetClose asChild>
                    <Button
                      variant={"navbar"}
                      className="w-full flex justify-start"
                      asChild
                    >
                      <Link className="space-x-2 text-lg" href={route.url!}>
                        {route.icon}
                        <span>{route.name}</span>
                      </Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <Button
                    className="w-full flex justify-start"
                    variant={"navbar"}
                    asChild
                  >
                    <Link className="space-x-4" href={route.url!}>
                      {route.icon}
                      <span className="text-base">{route.name}</span>
                    </Link>
                  </Button>
                )}
                <div className="ml-8 flex flex-col gap-2 items-start">
                  {route.submenu?.map((subroute) => {
                    if (isMobile) {
                      return (
                        <SheetClose asChild>
                          <Button
                            variant={"navbar-nested"}
                            className="w-full flex justify-start"
                            key={`${subroute.name} route button`}
                            asChild
                          >
                            <Link className="space-x-2" href={subroute.url!}>
                              <span>{subroute.name}</span>
                            </Link>
                          </Button>
                        </SheetClose>
                      );
                    }

                    return (
                      <Button
                        variant={"navbar-nested"}
                        className="w-full flex justify-start"
                        key={`${subroute.name} route button`}
                        asChild
                      >
                        <Link className="space-x-2" href={subroute.url!}>
                          <span>{subroute.name}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }

  if (!isLoginPage && !isHomePage) {
    return (
      <nav className="xl:fixed h-full px-4 py-4 md:py-8 flex flex-col justify-between bg-hs-sidebar">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between xl:justify-center items-center">
            <Link
              href={"/team-overview"}
              className="flex gap-2 justify-center items-center text-hs-sidebar-hover text-xl font-bold"
            >
              <Image priority src={IconLogoTitle} width={240} alt="壘球黑狗"></Image>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="xl:hidden" variant={"navbar"}>
                  <HamburgerMenuIcon className="text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-hs-sidebar flex flex-col justify-between border-l-0 overflow-y-scroll no-scrollbar">
                <NavTree className="flex pt-8" isMobile={true}></NavTree>
                <Button
                  className={`flex xl:hidden flex-row justify-between items-center bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-colors`}
                  onClick={(e) => handleLogoutClick(e)}
                >
                  <h2 className="text-white font-medium px-4">登出</h2>
                  <LogOutIcon className="text-[#98a2b3]" />
                </Button>
              </SheetContent>
            </Sheet>
          </div>
          <NavTree className={"hidden xl:flex"} isMobile={false} />
        </div>

        <Button
          className={`hidden xl:flex flex-row justify-between items-center bg-hs-logout p-2 rounded-lg hover:bg-slate-600 transition-colors`}
          onClick={(e) => handleLogoutClick(e)}
        >
          <h2 className="text-white font-medium px-4">登出</h2>
          <LogOutIcon className="text-[#98a2b3]" />
        </Button>
      </nav>
    );
  }
}
