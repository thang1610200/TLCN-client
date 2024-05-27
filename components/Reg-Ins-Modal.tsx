'use client';

import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loader from '@/components/loader';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import useRegisterInstructor from '@/app/hook/useRegisterInstructor';
import LoadingModal from './modal/loading-modal';
import Image from 'next/image';


interface RegisterProps{
    isOpen: boolean;
    setIsOpen: (value: boolean) => void
}

const MAX_FILE_SIZE: number = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export default function RegisterInsModal({isOpen, setIsOpen}:RegisterProps) {
    const CertificateFormSchema = z.object({
        image: z.any()
            .refine((files) => files?.size <= MAX_FILE_SIZE, `Max image size is 1MB.`)
            .refine(
                (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
                "Only .jpg, .jpeg, .png and .webp formats are supported."
            )
    });

    type CertificateFormValues = z.infer<typeof CertificateFormSchema>;
    const [isLoading, setIsLoading] = useState(false);
    const [imageCertificate, setImageCertificate] = useState("");
    const session = useSession();
    const router = useRouter();
    const { data, isLoadingRegister, error } = useRegisterInstructor(session.data?.user.email, session.data?.backendTokens.accessToken);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    setImageCertificate(e.target.result as string);
                }
            };

            reader.readAsDataURL(file);
            form.setValue('image', file);
        }
    }

    const onHandleClick = () => {
        if (!error) {
            switch (data?.status) {
                case 'PROGRESSING':
                    toast('Chứng chỉ của bạn đang được xem xét. Vui lòng kiểm tra email', {
                        duration: 5000,
                        position: 'top-right'
                    })
                    break;
                case 'SUCCESS':
                    toast('Chứng chỉ đã được chấp thuận. Vui lòng đăng nhập lại để tiếp tục', {
                        duration: 5000,
                        position: 'top-right'
                    })
                    signOut({ callbackUrl: '/login' })
                    break;
                default:
                    setIsOpen(true);
            }
        }
    }

    const form = useForm<CertificateFormValues>({
        resolver: zodResolver(CertificateFormSchema),
        defaultValues: {
            image: ""
        },
    });

    function SubmitUpdate(data: CertificateFormValues) {
        setIsLoading(true);
        axios.post(`${BACKEND_URL}/register-instructor/create`, {
            email: session.data?.user.email,
            file: data.image
        }, {
            headers: {
                Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res: any) => {
                toast.success("Send success!");
                form.reset();
                setIsOpen(false);
                setImageCertificate("");
                router.refresh();
            })
            .catch((err: any) => {
                toast.error("Something went wrong");
            })
            .finally(() => setIsLoading(false));
    }

    function CancelImage() {
        form.reset();
        setIsOpen(false);
        setImageCertificate("");
    }

    if (isLoadingRegister) {
        return (
            <></>
        )
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { setIsOpen(false) }}>
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
                                <Dialog.Panel className="w-full max-w-xl p-6 space-y-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="flex items-center justify-center p-4 pb-0 text-2xl font-semibold leading-6 text-gray-900"
                                    >
                                        Bạn muốn trở thành giảng viên

                                    </Dialog.Title>
                                    <p className='flex items-center justify-center text-center indent-4 max-w-[500px] min-w-[500px]'>
                                        Để trở thành giảng viên, chúng tôi yêu cầu bạn xác thực trình độ. Vui lòng cung cấp hình ảnh chứng minh chứng chỉ của bạn
                                    </p>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(SubmitUpdate)}>

                                            <FormField
                                                control={form.control}
                                                name="image"
                                                disabled={isLoading}
                                                render={({ field }) => (
                                                    <FormItem className='flex items-center justify-center '>
                                                        <FormControl>
                                                            <div className="flex items-center justify-center max-w-[500px] min-w-[500px] max-h-[500px] min-h-[500px]">
                                                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 max-w-[500px] min-w-[500px] max-h-[500px] min-h-[500px]">
                                                                    {!imageCertificate && <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                        <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">PG, JPEG, PNG or WEBP (Max image size is 10MB)</p>
                                                                    </div>}
                                                                    {imageCertificate && <Image
                                                                        src={imageCertificate}
                                                                        alt="User image"
                                                                        className="relative justify-center object-scale-down p-4 bg-no-repeat  max-w-[500px] min-w-[500px] max-h-[500px] min-h-[500px]"
                                                                        width={400}
                                                                        height={400}
                                                                    />}
                                                                    <Input id="dropzone-file" accept="image/*" type="file" {...form.register("image")} onChange={handleOnChange} className='hidden' />
                                                                </label>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid w-full grid-cols-2 gap-10 pt-6">
                                                <Button disabled={isLoading} type="submit">{isLoading ? <Loader /> : 'Lưu lại'}</Button>
                                                <Button type="button" onClick={() => { CancelImage() }}>Hủy bỏ</Button>
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
    )
}
