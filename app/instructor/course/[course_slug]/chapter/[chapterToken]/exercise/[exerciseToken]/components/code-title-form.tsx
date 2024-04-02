"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle } from "lucide-react";
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
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Exercise } from "@/app/types";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";

interface CodeTitleFormProps {
    initialData: Exercise;
    course_slug: string;
    chapter_token: string;
    exercise_token: string;
    mutate: KeyedMutator<any>;
};

const formSchema = z.object({
    title: z.string().min(1),
});

export const CodeTitleForm = ({
    initialData,
    course_slug,
    chapter_token,
    mutate,
    exercise_token
}: CodeTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleAdd = () => setIsEditing((current) => !current);

    const toggleEdit = () => {
        return router.push(`/instructor/course/${course_slug}/chapter/${chapter_token}/exercise/${exercise_token}/code/${initialData.code.token}`);
    }

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            title: initialData?.code?.question || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`${BACKEND_URL}/code/add-question`, {
                course_slug: course_slug,
                exercise_token,
                chapter_token,
                email: session.data?.user.email,
                question: values.title
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Exercise updated");
            toggleAdd();
            mutate();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
        <div className="flex items-center justify-between font-medium">
            Câu hỏi
            {
                !initialData?.code?.question ? (
                    <Button onClick={toggleAdd} variant="ghost">
                        {isEditing ? (
                            <>Hủy bỏ</>
                        ) : (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add a question
                            </>
                        )}
                    </Button>
                ) : (
                    <Button onClick={toggleEdit} variant="ghost">
                        <Pencil className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                    </Button>
                )
            }
        </div>
        {!isEditing && (
            <div className={cn(
            "text-sm mt-2",
            !initialData?.code?.question && "text-slate-500 italic"
            )}>
            {!initialData?.code?.question && "Không có câu hỏi"}
            {initialData?.code?.question && (
                <Preview
                value={initialData?.code?.question}
                />
            )}
            </div>
        )}
        {isEditing && (
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
                            <Editor
                                value={form.watch(field.name)}
                                onChange={(value) => {
                                    form.setValue('title',value, {
                                        shouldValidate: true,
                                    })
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
                    Lưu lại
                </Button>
                </div>
            </form>
            </Form>
        )}
        </div>
    )
}