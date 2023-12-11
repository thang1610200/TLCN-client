'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SetPasswordSchema = z
.object({
    currentPassword: z.string(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(
            new RegExp(
                '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'
            ),
            {
                message:
                    'Password must contain contain at least a capital letter, a small letter, a number, a special character',
            }
        ),
    confirmPassword: z.string(),
})
.refine((data) => data.password !== data.currentPassword, {
    message: "New password matches current password",
    path: ['password'],
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const UpdatePasswordForm = () => {

type SetPasswordFormValues = z.infer<typeof SetPasswordSchema>;
    const form = useForm<SetPasswordFormValues>({
        resolver: zodResolver(SetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const session = useSession();
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof SetPasswordSchema>) => {
        try {
            await axios.patch(
                `${BACKEND_URL}/user/update-password`,
                {
                    email: session.data?.user.email,
                    password: values.password,
                    currentPassword: values.currentPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Password updated');
            router.refresh();
            form.reset();
        } catch(err: any) {
            if(err.response.status === 404){
                toast.error("Current password don't match");
            }else{
                toast.error('Something went wrong');
            }
        }
    };

    const { isSubmitting } = form.formState;

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        disabled={isSubmitting}
                                        placeholder="••••••••"
                                        {...form.register('currentPassword')}
                                    />
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
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        disabled={isSubmitting}
                                        placeholder="••••••••"
                                        {...form.register('password')}
                                    />
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
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        disabled={isSubmitting}
                                        placeholder="••••••••"
                                        {...form.register('confirmPassword')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        Save new password
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default UpdatePasswordForm;
