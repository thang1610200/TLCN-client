'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, PlusCircle } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { Exercise, Quizz } from '@/app/types';
import { QuizzList } from './quizz-list';

interface QuizzFormProps {
    initialData?: Exercise & { quizz: Quizz[] };
    exercise_token: string;
    mutate: KeyedMutator<any>;
}

const formSchema = z.object({
    question: z.string().min(1),
});

export const QuizzForm = ({
    initialData,
    exercise_token,
    mutate,
}: QuizzFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `${BACKEND_URL}/quizz/create-quizz`,
                {
                    exercise_token,
                    question: values.question,
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Question created');
            toggleCreating();
            form.reset();
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }
    };

    const onReorder = async (
        updateData: { token: string; position: number }[]
    ) => {
        try {
            setIsUpdating(true);

            await axios.put(
                `${BACKEND_URL}/quizz/reorder-quizz`,
                {
                    exercise_token,
                    email: session.data?.user.email,
                    list: updateData,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Questions reordered');
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsUpdating(false);
        }
    };

    const onEdit = (token: string) => {
        router.push(`/instructor/exercise/${exercise_token}/quizz/${token}`);
    };

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Quizz question
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a question
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'What is javascript?'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div
                    className={cn(
                        'text-sm mt-2',
                        !initialData?.quizz.length && 'text-slate-500 italic'
                    )}
                >
                    {!initialData?.quizz.length && 'No chapters'}
                    <QuizzList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData?.quizz || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the questions
                </p>
            )}
        </div>
    );
};
