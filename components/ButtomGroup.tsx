"use client";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Button } from "./ui/button";

interface ButtonGroupProps {
  totalPages: number;
  currentPage: number;
  dataDisplayPerPage: number;
  onPageChange: (newPage: number) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  totalPages,
  currentPage,
  dataDisplayPerPage,
  onPageChange,
}) => {
  const [selectedPage, setSelectedPage] = useState(currentPage);
  const roundPage = Math.ceil(totalPages / dataDisplayPerPage);
  const pages = Array.from({ length: roundPage }, (_, i) => i + 1);

  const handlePageChange = (newPage: number) => {
    setSelectedPage(newPage);
    onPageChange(newPage);
  };

  return (
    <div className="flex gap-4">
      {/* {totalPages / dataDisplayPerPage <= 5 &&
        totalPages / dataDisplayPerPage > 1 && (
          <div className="flex border border-slate-200 rounded-md">
            <Button
              className="flex items-center py-1 px-2 md:py-2 md:px-4 text-sm gap-2 rounded-r-none hover:bg-slate-50"
              onClick={() =>
                handlePageChange(
                  currentPage > 1 ? currentPage - 1 : currentPage
                )
              }
            >
              <ArrowLeft className="h-4 w-4 md:h-6 md:w-6" />
              <span className="hidden md:inline-block">Previous</span>
            </Button>

            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                className={
                  page === selectedPage
                    ? "rounded-none active px-4 bg-slate-200 hover:bg-slate-50"
                    : "rounded-none hover:bg-slate-50"
                }
              >
                {page}
              </Button>
            ))}

            <Button
              className="flex items-center py-1 px-2 md:py-2 md:px-4 text-sm gap-2 rounded-l-none hover:bg-slate-50"
              onClick={() =>
                handlePageChange(
                  currentPage < pages.length ? currentPage + 1 : currentPage
                )
              }
            >
              <span className="hidden md:inline-block">Next</span>
              <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
            </Button>
          </div>
        )} */}

      {totalPages / dataDisplayPerPage > 1 ? (
        <div className="flex rounded-md border-slate-200">
          <Button
            variant={"ghost"}
            className="flex items-center py-1 px-2 md:py-2 md:px-4 text-sm gap-2 rounded-r-none border-[1px] border-r-0"
            onClick={() =>
              handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)
            }
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>

          <Select onValueChange={(value) => handlePageChange(Number(value))}>
            <SelectTrigger className="rounded-none">
              {"Page " + currentPage + " / " + roundPage}
            </SelectTrigger>
            <SelectContent className="w-min">
              {pages.map((page, index) => (
                <SelectItem key={index} value={String(page)}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={"ghost"}
            className="flex items-center py-1 px-2 md:py-2 md:px-4 text-sm gap-2 rounded-l-none border-[1px] border-l-0"
            onClick={() =>
              handlePageChange(
                currentPage < pages.length ? currentPage + 1 : currentPage
              )
            }
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ButtonGroup;
