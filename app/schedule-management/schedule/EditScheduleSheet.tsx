import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { updateLeague } from "./Actions";
import { ActionType } from "@/app/api/model/enums/ActionType";
import { ScheduleSchema, scheduleSchema } from "./Validations";

interface EditGameSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  schedule: Schedule | null;
  type?: ActionType;
  dataSize?: number;
}

export function EditScheduleSheet({
  schedule,
  type,
  ...props
}: EditGameSheetProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ScheduleSchema>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      ...schedule,
      id: schedule?.id || (props.dataSize && (props.dataSize + 1) * -1) || 0,
    },
  });

  function onSubmit(input: ScheduleSchema) {
    startUpdateTransition(async () => {
      const { error } = await updateLeague({
        ...input,
      });

      if (error) {
        toast({
          title: "錯誤",
          description: error as string,
        });
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast({
        title: "成功",
        description: "賽程更新成功!",
      });
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>{type}賽程</SheetTitle>
          <SheetDescription>
            編輯賽程詳細資料請點選儲存來更新資料
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名稱</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  取消
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending}>
                {isUpdatePending && (
                  <Loader
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                儲存
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
