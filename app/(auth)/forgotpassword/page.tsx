"use client";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Navbar from "../../../components/navbar";
import { Button } from "@/components/ui/button";
import { BiArrowBack } from "react-icons/bi";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from "@/lib/constant";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";


export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>


export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    axios.post(`${BACKEND_URL}/auth/reset-password`, { email: values.email })
      .then(() => {
        toast.success("Check your email to reset your password");
        form.setValue("email", "");
      })
      .catch((err: AxiosError<any, any>) => {
        toast.error(err.response?.data?.message || "Error");
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative flex-col items-center justify-center hidden h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
          <Link href="/home" legacyBehavior passHref>
            <h2 className="z-10 text-4xl font-bold cursor-pointer">Udemy</h2>
          </Link>
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Forgot account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to get a link to reset your password.
              </p>
            </div>
            <Card className="grid gap-4 pt-4">
              <CardContent className="grid gap-4">
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
                    <Button disabled={isLoading} className="w-full mt-5" type="submit">{isLoading ? <Loader /> : 'Reset Email'}</Button>
                  </form>
                </Form>
                <div className="relative px-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <Link rel="stylesheet" href="/login" className="grid gap-2">
                  <Button variant="outline" type="button">
                    <BiArrowBack className="w-4 h-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <p className="px-8 text-sm text-center text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
