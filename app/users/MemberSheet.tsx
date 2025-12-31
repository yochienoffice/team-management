"use client"

import { MemberItem } from "@/utils/Models";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { memberSchema, type MemberSchema } from "./Validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "./Actions";
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

interface UpdateMemberSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  member: MemberItem | null;
  type?: string;
}

export function MemberSheet({ member, ...props }: UpdateMemberSheetProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const { toast } = useToast();

  const roleList = ["manager", "dev", "support"];

  const form = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      ...member,
    },
  });

  function onSubmit(input: MemberSchema) {
    startUpdateTransition(async () => {
      // if (!member) return;

      const { error } = await updateUser({
        ...input,
        id: member?.number || -1,
      });

      if (error) {
        toast({
          title: "Error",
          description: error as string,
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
          <SheetTitle>編輯球員</SheetTitle>
          <SheetDescription>
            編輯球員詳細資料請點選儲存來更新資料
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="請輸入您的姓名..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>背號</FormLabel>
                  <FormControl>
                    <Input placeholder="請輸入您的背號..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>身分證字號</FormLabel>
                  <FormControl>
                    <Input placeholder="請輸入您的身分證字號" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="birthDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>生日</FormLabel>
                  <Input placeholder="請輸入您的生日" {...field} />
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  取消
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending} type="submit">
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
