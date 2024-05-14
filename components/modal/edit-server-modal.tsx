'use client';

import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useModal } from '@/app/hook/useModalStore';
import { CameraIcon, PlusIcon, X } from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required.',
    }),
    imageUrl: z
        .any()
        .refine(
            (files) => files?.size <= MAX_FILE_SIZE,
            `Max image size is 1MB.`
        )
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
            'Only .jpg, .jpeg, .png and .webp formats are supported.'
        ),
});

type ImageFormValues = z.infer<typeof formSchema>;

export const EditServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { server } = data;
    const router = useRouter();
    const session = useSession();
    const isModalOpen = isOpen && type === 'editServer';
    const [image, setImage] = useState('');

    const defaultValues: Partial<ImageFormValues> = {
        name: '',
        imageUrl: '',
    };

    const form = useForm<ImageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        form.setValue('imageUrl', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
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
        const file = event.dataTransfer.files?.[0];
        form.setValue('imageUrl', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage('');
        form.setValue('imageUrl', '');
    };

    const setValueForm = () => {
        if (server) {
            form.setValue('name', server.name);
            fetch(server.imageUrl)
                .then(async response => {
                    const blob = await response.blob()
                    const file = new File([blob], 'image.jpg', {
                        type: 'image/jpeg'
                    })
                    form.setValue('imageUrl', file);
                });
            setImage(server.imageUrl);
        }
    }

    const handleClose = () => {
        setImage('');
        setValueForm();
        onClose();
    };

    useEffect(() => {
        if (server) {
            form.setValue('name', server.name);
            fetch(server.imageUrl)
                .then(async response => {
                    const blob = await response.blob()
                    const file = new File([blob], 'image.jpg', {
                        type: 'image/jpeg'
                    })
                    form.setValue('imageUrl', file);
                });
            setImage(server.imageUrl);
        }
    },[server, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: ImageFormValues) => {
        try {
            await axios.patch(
                `${BACKEND_URL}/thread/update-server`,
                {
                    file: values.imageUrl,
                    name: values.name,
                    email: session.data?.user.email,
                    serverToken: server?.token,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success('Server updated');
            mutate([`${BACKEND_URL}/thread/detail-server?serverToken=${server?.token}&email=${session.data?.user.email}`,session.data?.backendTokens.accessToken]);
            handleClose();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image.
                        You can always change it later.
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
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className="relative flex justify-center w-24 h-24"
                                                    onDrop={handleOnDrop}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={
                                                        handleDragLeave
                                                    }
                                                >
                                                    {image !== '' && (
                                                        <div
                                                            className="absolute top-0 right-0 cursor-pointer"
                                                            onClick={
                                                                handleRemoveImage
                                                            }
                                                        >
                                                            <div className="flex items-center justify-center w-8 h-8 text-white bg-red-500 rounded-full p-1">
                                                                <X className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {image !== '' && (
                                                        <Image
                                                            src={image}
                                                            className="rounded-full"
                                                            alt="User image"
                                                            height={400}
                                                            width={400}
                                                        />
                                                    )}
                                                    <label
                                                        htmlFor="input-file"
                                                        className={clsx(
                                                            `flex-col items-center justify-center w-full h-full text-center border-2 border-dashed border-gray-400 rounded-full cursor-pointer`,
                                                            image
                                                                ? 'hidden'
                                                                : 'flex'
                                                        )}
                                                    >
                                                        <Input
                                                            id="input-file"
                                                            disabled={isLoading}
                                                            accept="image/*"
                                                            type="file"
                                                            {...form.register(
                                                                'imageUrl'
                                                            )}
                                                            onChange={
                                                                handleOnChange
                                                            }
                                                            className="hidden"
                                                        />
                                                        <div className="flex flex-col items-center justify-center ">
                                                            <CameraIcon
                                                                size={30}
                                                                className="text-gray-400"
                                                            />
                                                            <span className="mt-2 text-xs text-gray-300">
                                                                UPLOAD
                                                            </span>
                                                        </div>
                                                        <div className="absolute top-0 right-0">
                                                            <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full">
                                                                <PlusIcon className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
