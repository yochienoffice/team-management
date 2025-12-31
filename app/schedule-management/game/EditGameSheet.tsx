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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { gameSchema, GameSchema } from "./Validations";
import { createGame, updateGame } from "./Actions";
import { ScheduleFakeData } from "@/utils/FakeData";
import { ActionType } from "@/app/api/model/enums/ActionType";

interface EditGameSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  game: Game | null;
  type?: ActionType;
  dataSize?: number;
  leagueList?: Schedule[];
}

export function EditGameSheet({
  game,
  type,
  ...props
}: EditGameSheetProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [scheduleList, setScheduleList] = useState<Schedule[]>(props.leagueList || []);
  const { toast } = useToast();



  const form = useForm<GameSchema>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      ...game,
      id: game?.id || 0,
    },
  });


  function onSubmit(input: GameSchema) {
    startUpdateTransition(async () => {
      let message: string | null = null;

      if (game != null) {
        const { error } = await updateGame({
          ...input,
        });
        message = error ?? null;
      } else {
        const { error } = await createGame({
          ...input,
        });

        message = error ?? null;
      }

      

      if (message) {
        toast({
          title: "Error",
          description: message as string,
        });
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast({
        title: "Success",
        description: "Member Updated!",
      });
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>{type}比賽</SheetTitle>
          <SheetDescription>
            編輯比賽詳細資料請點選儲存來更新資料
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
              name="leagueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>賽程名稱</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select your state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scheduleList &&
                        scheduleList.map((schedule, index) => (
                          <SelectItem
                            key={schedule.id}
                            value={String(schedule.id)}
                          >
                            {schedule.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>比賽日期</FormLabel>
                  <FormControl>
                    <Input placeholder="請輸入您的比賽日期" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              name="time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>比賽時間</FormLabel>
                  <Input placeholder="請輸入您的比賽時間" {...field} />
                </FormItem>
              )}
            /> */}

            <FormField
              name="opponent"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>對手</FormLabel>
                  <Input placeholder="請輸入比賽的對手" {...field} />
                </FormItem>
              )}
            />

            <FormField
              name="score"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>我方得分</FormLabel>
                  <Input placeholder="請輸入我方得分" {...field} />
                </FormItem>
              )}
            />

            <FormField
              name="opponentScore"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>對手得分</FormLabel>
                  <Input placeholder="請輸入對手得分" {...field} />
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
