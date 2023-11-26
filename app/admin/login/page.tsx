"use client";

import { Metadata } from "next"

import Link from "next/link"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/components/loader";


export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginFormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("Logged in!");
          router.push('/');
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const socialAction = (action: string) => {
    signIn(action, {
      redirect: false,
      callbackUrl: "/home"
    });
  }

  // const dispatch = useAppDispatch();

  // const hanleLoginClick = () => {
  //   dispatch(authActions.login({
  //     sessionStatus: session.status
  //   }))
  // }
  // const hanleLogoutClick = () => {
  //   dispatch(authActions.logout());
  // }

  return (
    <>
      <div className="relative">
        <div className="container relative items-center justify-center h-screen lg:max-w-none lg:px-0">
          {/* <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
            <Link href="/home" legacyBehavior passHref>
              <h2 className="z-10 text-4xl font-bold cursor-pointer">Udemy</h2>
            </Link>
            <div className="absolute inset-0 bg-zinc-900" />
          </div> */}
          <div className="relative h-full text-white lg:p-8 bg-gradient-to-b from-slate-500 to-gray-200 dark:border-r lg:flex">
            <Link href="/home" legacyBehavior passHref>
              <h2 className="z-10 text-4xl font-bold cursor-pointer">Udemy</h2>
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] -translate-x-16">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-4xl font-bold tracking-tight text">
                  Admin Login
                </h1>
              </div>
              <Card>
                <CardContent className="grid gap-4 pt-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">Email</FormLabel>
                              <FormControl>
                                <Input disabled={isLoading} placeholder="m@example.com" className="invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-2 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-600" {...form.register("email")} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">Password</FormLabel>
                              <FormControl>
                                <Input disabled={isLoading} placeholder="••••••••" type="password" {...form.register("password")} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button disabled={isLoading} className="w-full mt-5" type="submit">{isLoading ? <Loader /> : 'Login'}</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}