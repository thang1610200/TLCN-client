"use client";

import { Metadata } from "next";
import Image from "next/image";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BACKEND_URL } from "@/lib/constant";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const formSchema = z.object({
  email: z.string().email(),
  name: z.string()
              .min(6, {
                message: "Username must be at least 2 characters.",
              })
              .max(50, {
                message: "Username must not be longer than 50 characters.",
              }),
  password: z.string()
              .min(10, { message: "Password must be at least 10 characters" })
              .regex(
                new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"),
                {
                  message:
                    "Password must contain contain at least a capital letter, a small letter, a number, a special character",
                }
              )
})

type RegisterFormValues = z.infer<typeof formSchema>;

export default function AuthenticationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch(BACKEND_URL + "/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          image: `https://ui-avatars.com/api/?background=random&name=${values.name.split(" ").join("+")}`
        }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if(!res.ok && res.status === 409){
        toast.error("Email already exists");
      }
      else if(res.ok){ 
        signIn('credentials', {
          ...values,
          redirect: false
        })
        .then((callback) => {
          if(callback?.error){
              toast.error("Invalid credentials");
          }
  
          if(callback?.ok && !callback?.error){
              toast.success("Logged in!");
              router.push("/home");
          }
        })
        .finally(() => setIsLoading(false)); 
      }
    }
    catch(err){
      toast.error("Error");
    }
  }

  const socialAction = (action: string) => {
    signIn(action, {
        redirect: false,
        callbackUrl: "/home"
    });
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
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] mt-12">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
            </div>
            <Card>
              <CardContent className="grid gap-4 pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                      <FormField
                          disabled = {isLoading}
                          control={form.control}
                          name="name"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">Username</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Bonnie Green" className="invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-2 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-600" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                          disabled = {isLoading}
                          control={form.control}
                          name="email"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="m@example.com" className="invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-2 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-600" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        disabled = {isLoading}
                        control={form.control}
                        name="password"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">Password</FormLabel>
                            <FormControl>
                              <Input placeholder="••••••••" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button disabled={isLoading} className="w-full mt-5" type="submit">Sign In</Button>
                  </form>
                </Form>
                <div className="relative px-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Button disabled={isLoading} onClick={() => socialAction('github')} variant="outline">
                    <Icons.gitHub className="w-4 h-4 mr-2" />
                    Github
                  </Button>
                  <Button disabled={isLoading} onClick={() => socialAction('google')} variant="outline">
                    <Icons.google className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                </div>
                <div className="relative px-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                </div>
                <Link rel="stylesheet" href="\login" className="grid gap-2">
                  <Button type="button">
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
