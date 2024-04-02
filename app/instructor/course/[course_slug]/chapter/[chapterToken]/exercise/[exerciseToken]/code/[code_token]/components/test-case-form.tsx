"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";
import { DataTableTestCase } from "./data-table-testcase";
import { columnsTestCase } from "./columns-test-case";
import { TestCase } from "@/app/types";

interface TestCaseFormProps {
    initialData: TestCase[];
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
};

const formSchema = z.object({
  input: z.string().min(1),
  output: z.string().min(1)
});

export const TestCaseForm = ({
    initialData,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token
}: TestCaseFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`${BACKEND_URL}/code/add-test-case`, {
                code_token,
                exercise_token,
                email: session.data?.user.email,
                chapter_token,
                course_slug,
                input: values.input,
                output: values.output
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            toast.success("TestCase updated");
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
            TestCase
            <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
                <>Hủy bỏ</>
            ) : (
                <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Thêm TestCase
                </>
            )}
            </Button>
        </div>
            {!isEditing && (
                <DataTableTestCase columns={columnsTestCase} data={initialData} />
            )}
            {isEditing && (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-4 space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="input"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Input</FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isSubmitting}
                                    placeholder="e.g. '[1,2,3]'"
                                    {...form.register('input')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="output"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Output</FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isSubmitting}
                                    placeholder="e.g. '[1,2,3]'"
                                    {...form.register('output')}
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