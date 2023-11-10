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
import { Course } from '@/app/types';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { Input } from '@/components/ui/input';

interface RequirementFormFormProps {
    initialData?: Course;
    course_slug?: string;
    mutate: KeyedMutator<any>;
}

const formSchema = z.object({
    description: z
        .array(
            z.object({
                value: z.string().min(5),
            })
        )
        .optional()
        .default([]),
});

export const RequirementForm = ({
    initialData,
    course_slug,
    mutate,
}: RequirementFormFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();
    let requirement = initialData?.requirement?.map((item) => {
        return {
            'value': item
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.requirement.length === 0 ? [{ value: '' }] : requirement
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
                        requirement: outcome,
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
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Requirement
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit content
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (initialData?.requirement.length === 0 ? (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No requirement
                    </p>
                ) : (
                    <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
                        {initialData?.requirement.map((item, index) => (
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
                        className="space-y-4 mt-4"
                    >
                        {fields.map((field, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2 rounded-md"
                                        >
                                            <FormControl>
                                                <Input
                                                    key={index}
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'This course is about...'"
                                                    {...form.register(
                                                        `description.${index}.value`
                                                    )}
                                                />
                                            </FormControl>
                                            {index > 0 && (
                                                <Button
                                                    key={index}
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
                                disabled={isSubmitting}
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
