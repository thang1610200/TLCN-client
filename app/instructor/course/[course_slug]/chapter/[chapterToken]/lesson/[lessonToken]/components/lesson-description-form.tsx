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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { Chapter } from '@/app/types';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';

interface LessonDescriptionFormProps {
    initialData: Chapter;
    course_slug: string;
    chapter_token: string;
    lesson_token: string;
    mutate: KeyedMutator<any>;
}

const formSchema = z.object({
    description: z.string().min(1),
});

export const LessonDescriptionForm = ({
    initialData,
    course_slug,
    chapter_token,
    lesson_token,
    mutate,
}: LessonDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `${BACKEND_URL}/lesson/update-lesson`,
                {
                    course_slug: course_slug,
                    value: {
                        description: values.description,
                    },
                    email: session.data?.user.email,
                    chapter_token,
                    lesson_token,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Lesson updated');
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
                Lesson description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div
                    className={cn(
                        'text-sm mt-2',
                        !initialData?.description && 'text-slate-500 italic'
                    )}
                >
                    {!initialData?.description && 'No description'}
                    {initialData?.description && (
                        <Preview value={initialData?.description} />
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor
                                            value={form.watch(field.name)}
                                            onChange={(value) => {
                                                form.setValue(
                                                    'description',
                                                    value,
                                                    {
                                                        shouldValidate: true,
                                                    }
                                                );
                                            }}
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
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
