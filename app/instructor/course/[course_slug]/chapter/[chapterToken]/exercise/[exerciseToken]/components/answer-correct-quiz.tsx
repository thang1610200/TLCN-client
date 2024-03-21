'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { Quizz } from '@/app/types';
import { filter } from 'lodash';

interface NumberAnswerCorrectFormProps {
    initialData: {
        number_correct: number;
        quizz: Quizz[]
    };
    course_slug: string;
    chapter_token: string;
    exercise_token: string;
    mutate: KeyedMutator<any>;
}

export const NumberAnswerCorrectForm = ({
    initialData,
    course_slug,
    chapter_token,
    exercise_token,
    mutate,
}: NumberAnswerCorrectFormProps) => {
    const formSchema = z.object({
        number_correct: z.number().nonnegative().lte(filter(initialData?.quizz, ['isPublished', true])?.length),
    });

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `${BACKEND_URL}/exercise/update-exercise`,
                {
                    token: exercise_token,
                    value: {
                        number_correct: values.number_correct,
                    },
                    email: session.data?.user.email,
                    course_slug,
                    chapter_token
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Exercise updated');
            toggleEdit();
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
            <div className="flex items-center justify-between font-medium">
                Số lượng câu hỏi để vượt qua
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Hủy bỏ</>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Chỉnh sửa số lượng câu hỏi
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="mt-2 text-sm">{initialData?.number_correct}</p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="number_correct"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the lesson'"
                                            {...form.register('number_correct', {
                                                valueAsNumber: true
                                            })}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Lưu lại
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
