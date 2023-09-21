'use client';



import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import Navbar from "../home/Navbar"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import {
  Card,
  CardContent,

} from "@/components/ui/card"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SubmitHandler, useForm } from "react-hook-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}




const registerFormSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "Username must be at least 2 characters.",
    })
    .max(50, {
      message: "Username must not be longer than 50 characters.",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }).regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$"), { message: "Password must contain contain at least a capital letter, a small letter, a number, a special character" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password is required" }).regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$"), { message: "Password must contain contain at least a capital letter, a small letter, a number, a special character" }),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });


type ValidationSchema = z.infer<typeof registerFormSchema>;

export default function Register() {
  // const { register, handleSubmit, formState: { errors }, } = useForm<ValidationSchema>({
  //   resolver: zodResolver(registerFormSchema),
  // });
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(registerFormSchema),
  });
  const { errors, isValid } = form.formState
  const onSubmit: SubmitHandler<ValidationSchema> = (data) => console.log(data);
  return (
    <>
      <Navbar />
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
                Register
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your username and password to register account
              </p>
            </div>
            <Card className="grid gap-4 pt-4">
              <CardContent className="grid gap-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="userName" className="after:content-['_*'] after:text-red-600 pb-1">Username</FormLabel>
                          <FormControl>
                            <Input id="userName" type="text" placeholder="" {...form.register("username")} autoComplete="off" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password" className="after:content-['_*'] after:text-red-600 pb-1">Password</FormLabel>
                          <FormControl>
                            <Input id="password" type="password" placeholder="" {...form.register("password")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="c_password" className="after:content-['_*'] after:text-red-600 pb-1">Confirm Password</FormLabel>
                          <FormControl>
                            <Input id="c_password" type="password" placeholder="" {...form.register("confirmPassword")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
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
  )
}