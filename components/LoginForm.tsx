"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import React from "react";
import { useRouter } from "next/navigation";
import crypto from "crypto";
import { useToast } from "./ui/use-toast";
import { encodeHSInfo } from "@/utils/Security";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function LoginForm() {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      const user: User = {
        email: values.email,
        password: values.password,
      };

      const data = {
        user: user,
      };

      // Generate a random key and IV
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      // Encode the data
      const encryptedData = encodeHSInfo(key, iv, JSON.stringify(data));

      // Serialize key and iv to strings
      const keyString = key.toString("hex");
      const ivString = iv.toString("hex");

      // const response: boolean | null = await login(
      //   keyString,
      //   ivString,
      //   encryptedData
      // );

      toast({
        title: "登入成功",
        description: "即將前往球隊總覽頁面...",
      });

      router.push("/team-overview");
      // if (response == null) {
      //   toast({
      //     title: "Login failed.",
      //     description: "Please check your username and password.",
      //   });
      // } else if(!response) {
      //   toast({
      //     title: "Permission Denied.",
      //     description: "You cannot access any store.",
      //   });
      // } else {
      //   router.push("/software-groups/backoffice/members");
      // }
    } catch (error) {
      toast({
        title: "Login failed.",
        description: "Please check your username and password.",
      });
    }
  }

  return (
    <Card className="p-8 xl:mr-70">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-hs-sidebar-hover">
          壘球黑狗球隊管理
        </h1>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form
            className="bg-white space-y-6"
            onSubmit={loginForm.handleSubmit(onSubmit)}
          >
            <FormField
              name="email"
              control={loginForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用者名稱</FormLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="user@example.com"
                  />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={loginForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密碼</FormLabel>
                  <Input {...field} type="password" placeholder="********" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" className="w-full">
                登入
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
