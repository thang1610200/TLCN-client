'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Check, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';

interface OptionFormProps {
    initialData?: {
        answer: string;
        option: string[];
    };
    exercise_token: string;
    token?: string;
    mutate: KeyedMutator<any>;
    isCheck?: boolean;
    course_slug: string;
    chapter_token: string;
}

const formSchema = z.object({
    answer: z.string().min(1, {
        message: 'Option is required',
    }),
    option: z
        .array(
            z.object({
                value: z.string().min(1, {
                    message: 'Option is required',
                }),
            })
        )
        .optional()
        .default([]),
});

export const OptionForm = ({
    initialData,
    exercise_token,
    token,
    mutate,
    isCheck,
    course_slug,
    chapter_token
}: OptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    let options: any = initialData?.option.map((item) => {
        if (item !== initialData.answer) {
            return {
                value: item,
            };
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answer: initialData?.answer || '',
            option:
                initialData?.option.length === 0 ? [{ value: '' }] : options,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const { fields, append, remove } = useFieldArray({
        name: 'option',
        control: form.control,
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const optionValue = values.option.map((item) => item.value);
            optionValue.push(values.answer);
            await axios.patch(
                `${BACKEND_URL}/quizz/update-quizz`,
                {
                    quiz_token: token,
                    exercise_token,
                    value: {
                        answer: values.answer,
                        option: optionValue,
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
            toast.success('Question updated');
            toggleEdit();
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Option
                {!isCheck && (
                    <Button onClick={toggleEdit} variant="ghost">
                        {isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit option
                            </>
                        )}
                    </Button>
                )}
            </div>
            {!isEditing &&
                (initialData?.option.length === 0 ? (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No option
                    </p>
                ) : (
                    <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
                        {initialData?.option.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center space-x-3"
                            >
                                <Check className="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                                {item === initialData.answer ? (
                                    <span className="font-semibold">
                                        {item}
                                    </span>
                                ) : (
                                    <span>{item}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                ))}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correct Answer</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Optional'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {fields.map((fieldValue, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name="option"
                                render={({ field }) => (
                                    <FormItem>
                                        {index === 0 && (
                                            <FormLabel>False Answer</FormLabel>
                                        )}
                                        <div className="flex items-center space-x-2 rounded-md">
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'Optional'"
                                                    {...form.register(
                                                        `option.${index}.value`
                                                    )}
                                                />
                                            </FormControl>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    disabled={isSubmitting}
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
                                type="button"
                                disabled={isSubmitting || fields.length >= 3}
                                onClick={() => append({ value: '' })}
                            >
                                Add
                            </Button>
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
