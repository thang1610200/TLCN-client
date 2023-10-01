"use client";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from 'next/navigation';
import useVerifyResetPassword from "../../hook/useVerifyResetPassword";
import LoadingModal from "@/components/loading-modal";
import ErrorModal from "@/components/error";
import { BACKEND_URL } from "@/lib/constant";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const formSchema = z.object({
    email: z.string(),
    password: z.string().min(6).regex(
    new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"),
    {
      message:
        "Password must contain contain at least a capital letter, a small letter, a number, a special character",
    }),
    confirmpassword: z.string()
}).refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
});

type ResetPasswordFormValues = z.infer<typeof formSchema>

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || undefined;
    const email = searchParams.get("email") || undefined;
    const { isLoading, error } = useVerifyResetPassword(token, email);

    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const router = useRouter();
    const session = useSession();

    if(session.status === "authenticated"){
      router.push("/home");
    }

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: '',
            confirmpassword: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoadingSubmit(true)
        axios.post(`${BACKEND_URL}/auth/update-password`,{
            email,
            token,
            password: values.password
        })
        .then(() => {
          toast.success("Reset password success!");
          router.push("/login");
        })
        .catch((err: AxiosError) => {
            toast.error(err.response?.statusText || "Error");
        })
        .finally(() => setIsLoadingSubmit(false));
    }

    if(isLoading){
        return <LoadingModal />;
    }

    return (
        <>
        {
            error ? (<ErrorModal />) : (
        <div>
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
                                                <Input disabled={true} placeholder="m@example.com" className="invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-2 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-600 disabled:bg-slate-300" {...form.register("email")} />
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
                                                <Input disabled={isLoadingSubmit} placeholder="••••••••" type="password" {...form.register("password")} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="confirmpassword"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">Confirm Password</FormLabel>
                                                <FormControl>
                                                <Input disabled={isLoadingSubmit} placeholder="••••••••" type="password" {...form.register("confirmpassword")} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button disabled={isLoadingSubmit} className="w-full mt-5" type="submit">Confirm</Button>
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
        </div>
        )}
    </>
    );
}
