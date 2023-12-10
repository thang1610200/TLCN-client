'use client';

import * as z from 'zod';
import axios from 'axios';
import { PlusCircle, File, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Lesson } from '@/app/types';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';

interface AttachmentFormProps {
    initialData: Lesson;
    lesson_token: string;
    mutate: KeyedMutator<any>;
}

const ACCEPTED_IMAGE_TYPES = [
    'application/pdf',
    'application/msword',
    'text/plain',
];

const formSchema = z.object({
    attach: z
        .any()
        .refine(
            (file) => file?.length <= 3,
            'The number of required files is less than 3'
        )
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            'Only .pdf, .doc, .docx and .txt formats are supported.'
        ),
});

export const AttachmentForm = ({
    initialData,
    lesson_token,
    mutate,
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const session = useSession();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            attach: '',
        },
    });

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `${BACKEND_URL}/attachment/upload-file`,
                {
                    lesson_token,
                    email: session.data?.user.email,
                    file: values.attach[0],
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success('Lesson updated');
            toggleEdit();
            mutate();
            router.refresh();
        } catch (err: any) {
            toast.error('Something went wrong');
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(
                `${BACKEND_URL}/attachment/delete-attach?email=${session.data?.user.email}&lesson_token=${lesson_token}&attachId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    }
                }

            );
            toast.success('Attachment deleted');
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setDeletingId(null);
        }
    };

    const { isSubmitting, isValid } = form.formState;

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Tệp đính kèm bài học
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && <>Hủy</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Thêm 1 tệp
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData?.attachment?.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            Chưa có tệp đính kèm nào
                        </p>
                    )}
                    {initialData?.attachment?.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachment.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() =>
                                                onDelete(attachment.id)
                                            }
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-4 space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="attach"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                accept="application/*,.txt"
                                                type="file"
                                                {...form.register('attach')}
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
                                {/* <Button disabled={!isValid || isSubmitting} type="button">Cancel</Button> */}
                            </div>
                        </form>
                    </Form>
                    <div className="text-xs text-muted-foreground mt-4">
                        Thêm bất cứ điều gì học viên của bạn có thể cần khi học.
                    </div>
                </div>
            )}
        </div>
    );
};
