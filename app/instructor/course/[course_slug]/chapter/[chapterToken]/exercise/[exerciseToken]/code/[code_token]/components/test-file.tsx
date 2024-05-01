'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { Code } from '@/app/types';
import { Input } from '@/components/ui/input';
import { TabFile } from './tab-file';

interface FileFormProps {
    initialData?: Code;
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
}

const formSchema = z.object({
    name: z.string().min(1),
});

export const EvaluationFileForm = ({
    initialData,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token,
}: FileFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `${BACKEND_URL}/code/add-file-test`,
                {
                    code_token,
                    exercise_token,
                    fileName: values.name,
                    email: session.data?.user.email,
                    chapter_token,
                    course_slug,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('File updated');
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
                Evaluation File
                {
                    !initialData?.fileTest && (
                        <Button onClick={toggleEdit} variant="ghost">
                            {isEditing ? (
                                <>Cancel</>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add file
                                </>
                            )}
                        </Button>
                    )
                }
            </div>
            {!isEditing && (
                !initialData?.fileTest ? (
                    <p
                        className='text-sm mt-2 text-slate-500 italic'
                    >
                        No file
                    </p>
                ) : (
                    <TabFile
                        code_token={code_token}
                        chapter_token={chapter_token}
                        course_slug={course_slug}
                        exercise_token={exercise_token} 
                        mutate={mutate}
                        initialData={initialData}
                        fileType='EVALUATION'
                    />
                )
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên file</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'main'"
                                            {...form.register('name')}
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
