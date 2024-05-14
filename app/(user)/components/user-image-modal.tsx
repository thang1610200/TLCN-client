import React from 'react';
import Image from 'next/image';
import { User } from '@/app/types';
import * as z from 'zod';
import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, Transition } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/lib/constant';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Loader from '@/components/loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProps {
    data: User;
    token?: string;
}

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

const avatarFormSchema = z.object({
    image: z
        .any()
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            `Max image size is 10MB.`
        )
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            'Only .jpg, .jpeg, .png and .webp formats are supported.'
        ),
});

type AvatarFormValues = z.infer<typeof avatarFormSchema>;

export default function UserImageModal(props: UserProps) {
    const user = props.data;
    const { update, data: session } = useSession();
    const router = useRouter();
    const [isOpenChangeImage, setIsOpenChangeImage] = useState(false);
    const [imageUser, setImageUser] = useState(user.image);
    const [isLoading, setIsLoading] = useState(false);

    const defaultValues: Partial<AvatarFormValues> = {
        image: '',
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            // setFileInput(file);
            reader.onload = (e) => {
                if (e.target) {
                    setImageUser(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const form = useForm<AvatarFormValues>({
        resolver: zodResolver(avatarFormSchema),
        defaultValues,
    });

    function SubmitUpdate(data: AvatarFormValues) {
        setIsLoading(true);
        axios
            .patch(
                `${BACKEND_URL}/user/update-avatar`,
                {
                    email: user.email,
                    file: data.image[0],
                },
                {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            .then((res: any) => {
                toast.success('Update success!');
                update({
                    user: {
                        ...session?.user,
                        image: res.data.image as string,
                        name: res.data.name as string,
                    },
                });
                setImageUser(res.data.image);
                setIsOpenChangeImage(false);
                router.refresh();
            })
            .catch((err: AxiosError<any, any>) => {
                if (err.response?.status === 401) {
                    router.push('/login');
                } else {
                    toast.error('Something went wrong');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function CancelImage() {
        setIsOpenChangeImage(false);
        setImageUser(user.image);
    }

    return (
        <>
            <div className="flex justify-center ">
                <div className="w-[150px] h-[150px] relative   ">
                    <div className="flex overflow-hidden rounded-full shrink-0">
                        <Avatar className="w-full h-full">
                            <AvatarImage src={user?.image} alt="User Image" />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                        {/* <Image src={user?.image} className="w-full h-full aspect-square" width={100} height={100} alt='User image' /> */}
                    </div>
                    <Button
                        onClick={() => {
                            setIsOpenChangeImage(true);
                        }}
                        className="absolute bottom-0 right-0 w-10 h-10 text-xl text-white rounded-full bg-slate-400"
                    >
                        ＋
                    </Button>
                </div>
            </div>
            <Transition appear show={isOpenChangeImage} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => {
                        setIsOpenChangeImage(false);
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full gap-5 p-4 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Select image user
                                    </Dialog.Title>
                                    <Avatar className="relative justify-center object-cover p-4 bg-no-repeat rounded-full max-w-[400px] min-w-[400px] max-h-[400px] min-h-[400px]">
                                        <AvatarImage
                                            src={user?.image}
                                            alt="User Image"
                                        />
                                        <AvatarFallback>User</AvatarFallback>
                                    </Avatar>
                                    {/* <Image
                                        src={imageUser}
                                        alt="User image"
                                        className="relative justify-center object-cover p-4 bg-no-repeat rounded-full max-w-[400px] min-w-[400px] max-h-[400px] min-h-[400px]"
                                        width={400}
                                        height={400}
                                    /> */}
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(
                                                SubmitUpdate
                                            )}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="image"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                disabled={
                                                                    isLoading
                                                                }
                                                                accept="image/*"
                                                                type="file"
                                                                {...form.register(
                                                                    'image'
                                                                )}
                                                                onChange={
                                                                    handleOnChange
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* <Input onChange={handleOnChange} accept="image/*" type="file" /> */}

                                            <div className="grid w-full grid-cols-2 gap-10 pt-6">
                                                <Button
                                                    disabled={isLoading}
                                                    type="submit"
                                                >
                                                    {isLoading ? (
                                                        <Loader />
                                                    ) : (
                                                        'Save'
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        CancelImage();
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
