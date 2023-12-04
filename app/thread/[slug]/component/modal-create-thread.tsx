"use client"

import { Heart, MessageCircle, Share2, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/button';
import React, { Fragment, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils"
import axios from 'axios';
import getSession from '@/app/actions/getSession';
import { BACKEND_URL } from '@/lib/constant';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"






const QuestionAnswerFormSchema = z.object({
    caption: z
        .string()
})

type QuestionAnswerFormValues = z.infer<typeof QuestionAnswerFormSchema>

// This can come from your database or API.
const defaultValues: Partial<QuestionAnswerFormValues> = {
    caption: "Caption"
}


export default function ModalCreateThread() {

    const [imageThread, setImageThread] = useState("");

    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<QuestionAnswerFormValues>({
        resolver: zodResolver(QuestionAnswerFormSchema),
        defaultValues,
        mode: "onChange",
    })


    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            // setFileInput(file);
            reader.onload = (e) => {
                if (e.target) {
                    setImageThread(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }


    function onSubmit(data: QuestionAnswerFormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }
    return (
        <>
            <div className="flex items-center justify-center w-1/2 h-32 p-4 space-x-4 border-2 rounded-lg bg-card">
                <Avatar>
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <Button className='w-full border-2 bg-background text-slate-700 hover:bg-slate-300' onClick={() => { setIsOpen(true) }}>Create Thread</Button>
            </div>
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
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 ">
                        <div className="flex items-center justify-center min-h-full p-4 text-center ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-1/2 p-6 space-y-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="relative flex justify-center text-lg font-medium leading-6 text-gray-900"
                                    >
                                        <div className="text-2xl font-bold">New Thread</div>
                                        <X className='absolute rounded-lg right-2 hover:bg-slate-300 ' size={32} onClick={() => { setIsOpen(false) }} />
                                    </Dialog.Title>
                                    <div className="flex items-center justify-center ">
                                        <div className="w-full h-full">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    <AvatarImage src="/avatars/01.png" />
                                                    <AvatarFallback>OM</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">Sofia Davis</p>
                                                    <p className="text-sm text-muted-foreground">m@example.com</p>
                                                </div>
                                            </div>
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="items-center justify-center w-full h-full pt-10 space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="caption"
                                                        render={({ field }) => (
                                                            <FormItem className='w-full h-full'>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Tell us a little bit about yourself"
                                                                        className="w-full h-full resize-none"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    {imageThread &&
                                                        <div className='flex items-center justify-center w-full'>
                                                            <img
                                                                src={imageThread}
                                                                alt="Thread image"
                                                                className="relative justify-center object-scale-down p-4 bg-no-repeat rounded-lg max-w-[300px] min-w-fit max-h-[300px] min-h-fit"
                                                                width={400}
                                                                height={400}
                                                            />
                                                        </div>}
                                                    <Input accept="image/*" type="file" onChange={handleOnChange} />

                                                    <div className="flex items-center justify-center w-full mt-4">
                                                        <Button className='w-1/2 ' type="submit">Post</Button>
                                                    </div>
                                                </form>
                                            </Form>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
