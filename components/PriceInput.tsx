"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import IconChevronDown from "../public/assets/img/icon-chevron-down.svg";
import { ItemPriceType } from "../app/api/model/enums/ItemPriceType";
import { Form, FormField, FormItem, FormControl, FormLabel } from "./ui/form";
import { useForm, useFormContext } from "react-hook-form";

interface TagGroupProps {
  priceInfo: {
    price: number;
    priceType: ItemPriceType;
  };
  onValueChange: (value: object) => void;
  disable: boolean;
}

const PriceInput: React.FC<TagGroupProps> = ({ priceInfo, onValueChange, disable }) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [price, setPrice] = useState("");

  useEffect(() => {
    const tempOptions: { label: string; value: string }[] = [];
    for (const key in ItemPriceType) {
      if (isNaN(Number(key))) {
        tempOptions.push({
          label: key,
          value: ItemPriceType[key as keyof typeof ItemPriceType],
        });
      }
    }
    setOptions(tempOptions);
  }, []);

  useEffect(() => {
    if (priceInfo) {
      setPrice(String(priceInfo.price.toFixed(2) || "0"));
    }
  }, []);

  const renderPriceType = (priceType: string) => {
    switch (priceType) {
      case ItemPriceType.PRICE_BY_UNIT:
        return "per Unit";;
      default:
        return "per Unit";
    }
  };

  const handlePriceTypeChange = (value: string) => {
    let newValue;
    switch (value) {
      case "per Unit":
        newValue = {
          price: priceInfo.price,
          priceType: ItemPriceType.PRICE_BY_UNIT,
        };
        break;
      default:
        newValue = {
          price: priceInfo.price,
          priceType: priceInfo.priceType,
        };
        break;
    }
    onValueChange(newValue);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(inputValue) || inputValue === "") {
      setPrice(e.target.value);
      onValueChange({
        price: Number(e.target.value),
        priceType: priceInfo.priceType,
      });
    }
  };

  return (
    <div className="w-full flex justify-end items-center border border-solid border-[#EAECF0] rounded-xl mt-1 h-12">
      <div className="w-full flex justify-end items-center flex-[2_2_0%] py-2.5 ps-3.5 pe-2">
        <div>$</div>
        <Input
          className="h-7 border-none p-0 ms-2 mt-0"
          type="text"
          value={price}
          onChange={(e) => handlePriceChange(e)}
          disabled={disable}
        />
      </div>
      <div className="flex justify-end items-center flex-1 py-2.5 px-3.5 border-s">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-7 border-none p-0" variant="outline" disabled={disable}>
              {renderPriceType(
                priceInfo && priceInfo.priceType
                  ? priceInfo.priceType
                  : ItemPriceType.PRICE_BY_UNIT
              )}
              <Image src={IconChevronDown} className="btn-arrow-left" alt="" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32 min-w-25 flex items-center justify-center">
            <DropdownMenuRadioGroup
              className="w-full"
              value={
                priceInfo && priceInfo.priceType
                  ? renderPriceType(priceInfo.priceType)
                  : "per Unit"
              }
              onValueChange={(value) => handlePriceTypeChange(value)}
            >
              {options.map((option, index) => (
                <DropdownMenuRadioItem
                  key={index}
                  value={renderPriceType(option.value)}
                >
                  {renderPriceType(option.value)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PriceInput;
