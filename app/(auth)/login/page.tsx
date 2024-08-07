'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Loader from '@/components/loader';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials');
                }

                if (callback?.ok && !callback?.error) {
                    toast.success('Logged in!');
                    router.push('/');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const socialAction = (action: string) => {
        signIn(action, {
            redirect: false,
            callbackUrl: '/',
        });
    };

    return (
        <>
            <div className="relative">
                <div className="container relative flex-col items-center justify-center hidden h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-slate-100">
                    <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
                        <div className="absolute inset-0 bg-zinc-900" />
                        <div className="relative z-20 mt-auto">
                            <blockquote className="space-y-2">
                                <p className="text-lg">
                                    &ldquo;This library has saved me countless
                                    hours of work and helped me deliver stunning
                                    designs to my clients faster than ever
                                    before.&rdquo;
                                </p>
                                <footer className="text-sm">Sofia Davis</footer>
                            </blockquote>
                        </div>
                    </div>
                    <div className="lg:p-8">
                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-4xl font-bold tracking-tight text">
                                    Đăng nhập
                                </h1>
                            </div>
                            <Card>
                                <CardContent className="grid gap-4 pt-4">
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(
                                                onSubmit
                                            )}
                                            className="space-y-4"
                                        >
                                            <div className="grid gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">
                                                                Email
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                    placeholder="m@example.com"
                                                                    className="invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-2 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-600"
                                                                    {...form.register(
                                                                        'email'
                                                                    )}
                                                                />
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
                                                            <FormLabel className="after:content-['_*'] after:text-red-600 pb-1">
                                                                Mật khẩu
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                    placeholder="••••••••"
                                                                    type="password"
                                                                    {...form.register(
                                                                        'password'
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Link
                                                rel="help"
                                                href="/forgotpassword"
                                                className="-my-2 text-xs text-right underline"
                                            >
                                                Quên mật khẩu?
                                            </Link>
                                            <Button
                                                disabled={isLoading}
                                                className="w-full mt-5"
                                                type="submit"
                                            >
                                                {isLoading ? (
                                                    <Loader />
                                                ) : (
                                                    'Đăng nhập'
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="px-2 bg-background text-muted-foreground">
                                                Hoặc tiếp tục với
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Button
                                            disabled={isLoading}
                                            onClick={() =>
                                                socialAction('github')
                                            }
                                            variant="outline"
                                        >
                                            <Icons.gitHub className="w-4 h-4 mr-2" />
                                            Github
                                        </Button>
                                        <Button
                                            disabled={isLoading}
                                            onClick={() =>
                                                socialAction('google')
                                            }
                                            variant="outline"
                                        >
                                            <Icons.google className="w-4 h-4 mr-2" />
                                            Google
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="grid gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center ">
                                            <span className="w-full px-2 border-t" />
                                        </div>
                                        <div className="relative flex justify-center px-2 text-xs uppercase">
                                            <span className="px-2 bg-background text-muted-foreground">
                                                Bạn chưa có tài khoản?
                                            </span>
                                            <Link
                                                rel="next"
                                                href="/signup"
                                                className="grid gap-2 pr-2 underline bg-background decoration-solid"
                                            >
                                                Đăng kí
                                            </Link>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                            <p className="px-8 text-sm text-center text-muted-foreground">
                                Bằng việc tiếp tục, bạn đồng ý với{' '}
                                <Link
                                    href="/terms"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Điều khoản dịch vụ
                                </Link>{' '}
                                và{' '}
                                <Link
                                    href="/privacy"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Chính sách quyền riêng tư của chúng tôi
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
