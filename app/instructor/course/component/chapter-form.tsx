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
import { Chapter, Course } from "@/app/types";
import { ChaptersList } from "./chapter-list";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";

interface ChaptersFormProps {
    initialData?: Course & { chapters: Chapter[] };
    course_slug: string;
    mutate: KeyedMutator<any>
};

const formSchema = z.object({
    title: z.string().min(1),
});

export const ChaptersForm = ({
    initialData,
    course_slug,
    mutate
}: ChaptersFormProps) => {
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
            await axios.post(`${BACKEND_URL}/chapter/create-chapter`, {
                slug: course_slug,
                title: values.title,
                email: session.data?.user.email
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Chapter created");
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

            await axios.put(`${BACKEND_URL}/chapter/reorder-chapter`, {
                courseSlug: course_slug,
                email: session.data?.user.email,
                list: updateData
        },{
            headers: {
                Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                "Content-Type": "application/json"
            }
        });
            toast.success("Chapters reordered");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (token: string) => {
        router.push(`/instructor/course/${course_slug}/chapter/${token}`);
    }

    return (
        <div className="relative p-4 mt-6 border rounded-md bg-slate-100">
        {isUpdating && (
            <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full bg-slate-500/20 rounded-m">
            <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
            </div>
        )}
        <div className="flex items-center justify-between font-medium">
            Các chương trong khóa học
            <Button onClick={toggleCreating} variant="ghost">
            {isCreating ? (
                <>Hủy bỏ</>
            ) : (
                <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Tạo chương mới
                </>
            )}
            </Button>
        </div>
        {isCreating && (
            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-4"
            >
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to the course'"
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
            !initialData?.chapters.length && "text-slate-500 italic"
            )}>
            {!initialData?.chapters.length && "No chapters"}
            <ChaptersList
                onEdit={onEdit}
                onReorder={onReorder}
                items={initialData?.chapters || []}
            />
            </div>
        )}
        {!isCreating && (
            <p className="mt-4 text-xs text-muted-foreground">
            Kéo thả để chỉnh sửa thứ tự chương
            </p>
        )}
        </div>
    )
}