"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Chapter, Lesson } from "@/app/types";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";
import { LessonsList } from "./lesson-list";

interface LessonsFormProps {
    initialData?: Chapter & { lessons: Lesson[] };
    course_slug: string;
    chapter_token: string;
    mutate: KeyedMutator<any>
};

const formSchema = z.object({
    title: z.string().min(1),
});

export const LessonsForm = ({
    initialData,
    course_slug,
    chapter_token,
    mutate
}: LessonsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`${BACKEND_URL}/lesson/create-lesson`, {
                course_slug: course_slug,
                title: values.title,
                email: session.data?.user.email,
                chapter_token: chapter_token
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Lesson created");
            toggleCreating();
            form.reset();
            mutate();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`${BACKEND_URL}/lesson/reorder-lesson`, {
                list: updateData
        },{
            headers: {
                Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                "Content-Type": "application/json"
            }
        });
            toast.success("Lessons reordered");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (token: string) => {
        router.push(`/instructor/course/${course_slug}/chapter/${chapter_token}/lesson/${token}`);
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
        {isUpdating && (
            <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
            </div>
        )}
        <div className="font-medium flex items-center justify-between">
            Chapter lessons
            <Button onClick={toggleCreating} variant="ghost">
            {isCreating ? (
                <>Cancel</>
            ) : (
                <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a lesson
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
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to the lesson'"
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
            <div className={cn(
            "text-sm mt-2",
            !initialData?.lessons.length && "text-slate-500 italic"
            )}>
            {!initialData?.lessons.length && "No lessons"}
            <LessonsList
                onEdit={onEdit}
                onReorder={onReorder}
                items={initialData?.lessons || []}
            />
            </div>
        )}
        {!isCreating && (
            <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder the lessons
            </p>
        )}
        </div>
    )
}