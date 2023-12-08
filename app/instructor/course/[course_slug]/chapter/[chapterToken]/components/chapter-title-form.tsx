"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    };
    course_slug: string;
    chapter_token: string;
    mutate: KeyedMutator<any>
};

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChapterTitleForm = ({
    initialData,
    course_slug,
    chapter_token,
    mutate
}: ChapterTitleFormProps) => {
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
            await axios.patch(`${BACKEND_URL}/chapter/update-chapter`, {
                course_slug: course_slug,
                value: {
                    title: values.title
                },
                email: session.data?.user.email,
                token: chapter_token
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Course updated");
            toggleEdit();
            mutate();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
        <div className="flex items-center justify-between font-medium">
            Tiêu đề chương
            <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
                <>Hủy bỏ</>
            ) : (
                <>
                <Pencil className="w-4 h-4 mr-2" />
                Chỉnh sửa tiêu đề
                </>
            )}
            </Button>
        </div>
            {!isEditing && (
                <p className="mt-2 text-sm">
                {initialData?.title}
                </p>
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