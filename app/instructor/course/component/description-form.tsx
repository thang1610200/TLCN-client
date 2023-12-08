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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/app/types";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";

interface DescriptionFormProps {
    initialData?: Course;
    course_slug?: string;
    mutate: KeyedMutator<any>
};

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required",
    }),
});

export const DescriptionForm = ({
    initialData,
    course_slug,
    mutate
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const session = useSession();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`${BACKEND_URL}/course/update-course`, {
                slug: course_slug,
                value: {
                    description: values.description
                },
                email: session.data?.user.email
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
                Mô tả khóa học
                <Button onClick={toggleEdit} variant="ghost">
                {isEditing ? (
                    <>Hủy bỏ</>
                ) : (
                    <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Chỉnh sửa mô tả
                    </>
                )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                "text-sm mt-2",
                !initialData?.description && "text-slate-500 italic"
                )}>
                {initialData?.description || "No description"}
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea
                            disabled={isSubmitting}
                            placeholder="e.g. 'This course is about...'"
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