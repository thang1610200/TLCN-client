'use client';

import axios from 'axios';
import qs from 'query-string';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useModal } from '@/app/hook/useModalStore';
import { useState } from 'react';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
import { FileIcon, X } from 'lucide-react';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';

const MAX_FILE_SIZE = 1000;

const formSchema = z.object({
    fileUrl: z
        .any()
        .refine(
            (files) => files?.size,
            `Attachment is required.`
        ),
});

type FileFormValues = z.infer<typeof formSchema>;

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const [file, setFile] = useState('');
    const session = useSession();
    const isModalOpen = isOpen && type === 'messageFile';
    const { apiUrl, query } = data;

    const defaultValues: Partial<FileFormValues> = {
        fileUrl: '',
    };

    const form = useForm<FileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files?.[0];
        form.setValue('fileUrl', files);
        if (files) {
            setFile(files.name);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files?.[0];
        form.setValue('fileUrl', files);
        if (files) {
            setFile(files.name);
        }
    };

    const handleRemoveImage = () => {
        setFile('');
        form.setValue('fileUrl', '');
    };

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: FileFormValues) => {
        try {
            await axios.post(
                `${BACKEND_URL}/message/upload-file-message`,
                {
                    file: values.fileUrl,
                    channelToken: query?.channelToken,
                    serverToken: query?.serverToken,
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleClose = () => {
        setFile('');
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem
                                            onDrop={handleOnDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <FormControl className="mb-8">
                                                {file !== '' ? (
                                                    <div>
                                                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                                                            <div
                                                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                                                            >
                                                                {file}
                                                            </div>
                                                            <button
                                                                disabled={isLoading}
                                                                onClick={() =>
                                                                    handleRemoveImage()
                                                                }
                                                                className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                                                                type="button"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label
                                                        htmlFor="file"
                                                        className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                                                    >
                                                        <div>
                                                            <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                                                                Drop files here
                                                            </span>
                                                            <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                                                Or
                                                            </span>
                                                            <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                                                Browse
                                                            </span>
                                                        </div>
                                                        <Input
                                                            type="file"
                                                            id="file"
                                                            className="hidden"
                                                            {...form.register(
                                                                'fileUrl'
                                                            )}
                                                            onChange={
                                                                handleOnChange
                                                            }
                                                        />
                                                    </label>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
