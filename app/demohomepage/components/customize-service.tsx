import React from 'react'
import Image from "next/image"
import { User } from "@/app/types";
import * as z from "zod";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, Transition } from '@headlessui/react';
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/lib/constant';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Loader from '@/components/loader';
import { ArrowUpFromLine } from 'lucide-react';


const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ImageFormSchema = z.object({
    image: z.any()
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 10MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
});
type ImageFormValues = z.infer<typeof ImageFormSchema>;


export default function CustomizeService() {
    const { update, data: session } = useSession();
    const router = useRouter();
    const [isOpenChangeImage, setIsOpenChangeImage] = useState(false)
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOver, setIsOver] = useState(false);

    const defaultValues: Partial<ImageFormValues> = {
        image: ""
    };

    const form = useForm<ImageFormValues>({
        resolver: zodResolver(ImageFormSchema),
        defaultValues,
    })

    function SubmitUpdate(data: ImageFormValues) {
        setIsLoading(true);
        console.log("submit")
        // axios.patch(`${BACKEND_URL}/user/update-avatar`, {
        //     email: user.email,
        //     file: data.image[0]
        // }, {
        //     headers: {
        //         Authorization: `Bearer ${props.token}`,
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        //     .then((res: any) => {
        //         toast.success("Update success!");
        //         update({
        //             user: {
        //                 ...session?.user,
        //                 image: res.data.image as string,
        //                 name: res.data.name as string
        //             }
        //         });
        //         setImageUser(res.data.image);
        //         setIsOpenChangeImage(false);
        //         router.refresh();
        //     })
        //     .catch((err: AxiosError<any, any>) => {
        //         if (err.response?.status === 401) {
        //             router.push('/login');
        //         }
        //         else {
        //             toast.error(err.response?.data?.message || "Error");
        //         }
        //     })
        //     .finally(() => {
        //         setIsLoading(false);
        //     });
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);
    };



    const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);
        console.log("File(s) dropped");

        // Prevent default behavior (Prevent file from being opened)

        const file = event.dataTransfer.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }

    }
    const handleCancelImage = () =>{
        setImage("")
        setIsOpenChangeImage(false)
    }



    return (
        <div className="flex items-center justify-center w-1/2 p-10 bg-black rounded-lg h-4/5">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
                    <div className="text-3xl font-bold text-white">Customize Service</div>
                    <div className="text-base text-center text-gray-400 text-balance">Give your new server a personality with a name and an icon. You can always change it later.</div>
                </div>
                <div className="relative w-24 h-24 ">
                    <div className='flex p-4 overflow-hidden border-4 rounded-full shrink-0'>

                        <Image src="/images/cloud-upload.png" className="w-full h-full aspect-square" width={100} height={100} alt='User image' />
                    </div>
                    <Button onClick={() => { setIsOpenChangeImage(true) }} className="absolute top-0 right-0 w-8 h-8 text-xl text-white rounded-full bg-slate-400">＋</Button>
                </div>
            </div>
            <Transition appear show={isOpenChangeImage} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { setIsOpenChangeImage(false) }}>
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

                    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
                        <div className="flex items-center justify-center w-full gap-4 p-4 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="flex flex-col items-center justify-center w-full h-full max-w-md gap-4 p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 "
                                    >
                                        Upload Image
                                    </Dialog.Title>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(SubmitUpdate)} >
                                            <FormField

                                                control={form.control}
                                                name="image"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex flex-col items-center justify-center w-full h-full max-w-[26rem] max-h-[26rem] min-w-[26rem] min-h-[26rem] p-4 border-4 border-dashed rounded-lg aspect-square" onDrop={handleOnDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                                                                {image !== "" ? <Image
                                                                    src={image}
                                                                    alt="User image"
                                                                    className="relative justify-center object-cover bg-no-repeat max-w-[25rem] max-h-[25rem] min-w-[25rem] min-h-[25rem]0px]"
                                                                    width={400}
                                                                    height={400}
                                                                /> : <label htmlFor="input-file" className='flex flex-col items-center justify-center w-full h-full text-center rounded-lg' >
                                                                    <Input id='input-file' disabled={isLoading} accept="image/*" type="file" {...form.register("image")} onChange={handleOnChange} className='hidden' />
                                                                    <div className="flex flex-col items-center justify-center ">
                                                                        <ArrowUpFromLine size={80} className='' />
                                                                        <p className='pt-4'>Drag and drop or click here <br /> to upload image</p>
                                                                        <span>Upload any images from desktop</span>
                                                                    </div>
                                                                </label>}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* <Input onChange={handleOnChange} accept="image/*" type="file" /> */}

                                            <div className="grid w-full grid-cols-2 gap-10 pt-6">
                                                <Button disabled={isLoading} type="submit">{isLoading ? <Loader /> : 'Save'}</Button>
                                                <Button type="button" onClick={handleCancelImage}>Cancel</Button>
                                            </div>
                                        </form>
                                    </Form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
