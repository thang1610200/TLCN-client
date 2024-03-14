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
import { Quizz } from "@/app/types";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";

interface ExplainFormProps {
    initialData?: Quizz;
    exercise_token: string;
    token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
};

const formSchema = z.object({
    explain: z.string().min(1, {
        message: "Explain is required",
    }),
});

export const ExplainForm = ({
    initialData,
    token,
    exercise_token,
    mutate,
    course_slug,
    chapter_token
}: ExplainFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const session = useSession();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            explain: initialData?.explain || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`${BACKEND_URL}/quizz/update-quizz`, {
                quiz_token: token,
                exercise_token,
                value: {
                    explain: values.explain
                },
                email: session.data?.user.email,
                course_slug,
                chapter_token
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("Question updated");
            toggleEdit();
            mutate();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Question explain
                <Button onClick={toggleEdit} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ) : (
                    <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit explain
                    </>
                )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                "text-sm mt-2",
                !initialData?.explain && "text-slate-500 italic"
                )}>
                {initialData?.explain || "No explain"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField
                    control={form.control}
                    name="explain"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea
                            disabled={isSubmitting}
                            placeholder="e.g. 'This explain is about...'"
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
                        Save
                    </Button>
                    </div>
                </form>
                </Form>
            )}
        </div>
    )
}