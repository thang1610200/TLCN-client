'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Check, Pencil, X, XCircle } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@/app/types';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { Input } from '@/components/ui/input';

interface LearningOutcomeFormFormProps {
    initialData?: Course;
    course_slug?: string;
    mutate: KeyedMutator<any>;
}

const formSchema = z.object({
    // description: z.string().min(1, {
    //     message: "Description is required",
    // }),
    description: z
        .array(
            z.object({
                value: z.string().min(5),
            })
        )
        .optional()
        .default([]),
});

export const LearningOutcomeForm = ({
    initialData,
    course_slug,
    mutate,
}: LearningOutcomeFormFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();
    let learning_outcome = initialData?.learning_outcome?.map((item) => {
        return {
            'value': item
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.learning_outcome.length === 0 ? [{ value: '' }] : learning_outcome
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: 'description',
        control: form.control,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const outcome = values.description.map((item) => item.value);
            await axios.patch(
                `${BACKEND_URL}/course/update-course`,
                {
                    slug: course_slug,
                    value: {
                        learning_outcome: outcome,
                    },
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Course updated');
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
                Mục tiêu khóa học
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Hủy bỏ</>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Chỉnh sửa mục tiêu
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                // <p
                //     className={cn(
                //         'text-sm mt-2',
                //         !initialData?.learning_outcome &&
                //             'text-slate-500 italic'
                //     )}
                // >
                //     {initialData?.learning_outcome || 'No learning outcome'}
                // </p>
                (initialData?.learning_outcome.length === 0 ? (
                    <p className="mt-2 text-sm italic text-slate-500">
                        Không có
                    </p>
                ) : (
                    <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
                        {initialData?.learning_outcome.map((item, index) => (
                            <li key={index} className="flex items-center space-x-3">
                                <Check
                                    className="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400"
                                />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ))}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        {fields.map((field, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <div
                                            className="flex items-center space-x-2 rounded-md"
                                        >
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'This course is about...'"
                                                    {...form.register(
                                                        `description.${index}.value`
                                                    )}
                                                />
                                            </FormControl>
                                            {index > 0 && (
                                                <Button
                                                    disabled={isSubmitting}
                                                    type='button'
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                >
                                                    <X />
                                                </Button>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting}
                                type="button"
                                onClick={() => append({ value: '' })}
                            >
                                Thêm
                            </Button>
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
