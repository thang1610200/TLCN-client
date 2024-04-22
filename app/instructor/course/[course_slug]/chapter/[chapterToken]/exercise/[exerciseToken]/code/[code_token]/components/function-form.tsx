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
import { Code } from "@/app/types";

interface FunctionFormProps {
    initialData?: Code;
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string
};

const formSchema = z.object({
  title: z.string().min(1),
});

export const FunctionForm = ({
    initialData,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token,
}: FunctionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.file[0].functionName
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`${BACKEND_URL}/code/update-function-name`, {
                code_token,
                exercise_token,
                email: session.data?.user.email,
                chapter_token,
                course_slug,
                fileId: initialData?.file[0].id,
                content: values.title
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("File updated");
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
            Function Name
            <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
                <>Hủy bỏ</>
            ) : (
                <>
                <Pencil className="w-4 h-4 mr-2" />
                Chỉnh sửa tên function
                </>
            )}
            </Button>
        </div>
            {!isEditing && (
                <p className="mt-2 text-sm">
                {initialData?.file[0].functionName}
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
                            placeholder="e.g. 'function Sum(a,b) {}'"
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