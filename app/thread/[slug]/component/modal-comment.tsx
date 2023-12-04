"use client"

import { Heart, MessageCircle, Share2, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/button';
import React, { Fragment, useState, useRef } from 'react';
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



type UserComment = {
    username: string;
    avatar: string;
    comment: string;
}


interface ModalThreadProps {
    UserComment: UserComment[];
}


const QuestionAnswerFormSchema = z.object({
    answer: z
        .string()
})

type QuestionAnswerFormValues = z.infer<typeof QuestionAnswerFormSchema>

// This can come from your database or API.
const defaultValues: Partial<QuestionAnswerFormValues> = {
    answer: "comment here"
}


export default function ModalComment(props: ModalThreadProps) {
    const heartRef = useRef<SVGSVGElement>(null);
    const comment = props.UserComment;

    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<QuestionAnswerFormValues>({
        resolver: zodResolver(QuestionAnswerFormSchema),
        defaultValues,
        mode: "onChange",
    })



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
            <div className="flex items-center space-x-4">
                <Heart  size={32} ref={heartRef} onClick={() => {
                    if (heartRef.current) {
                        heartRef.current.style.backgroundColor = 'pink';
                    }
                }} />
                <MessageCircle size={32} onClick={() => { setIsOpen(true) }} />
                <Share2 size={32} />
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
                                <Dialog.Panel className="w-3/4 p-6 space-y-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="flex justify-between text-lg font-medium leading-6 text-gray-900 "
                                    >
                                        <div className="flex items-center justify-center w-full text-2xl font-bold">Comment</div>
                                        <X className='rounded-lg hover:bg-slate-300' size={32} onClick={() => { setIsOpen(false) }} />
                                    </Dialog.Title>
                                    <div className="flex items-center justify-center ">
                                        <div className="w-full h-full space-y-4">
                                            {comment.map((values: UserComment, index: number) => (
                                                <div key={index} className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarImage src="/avatars/01.png" />
                                                        <AvatarFallback>OM</AvatarFallback>
                                                    </Avatar>
                                                    <Input
                                                        readOnly={true}
                                                        placeholder={values.comment}
                                                        className="resize-none focus-visible:ring-0 focus-visible:border-none w-fit h-fit"
                                                    />
                                                </div>
                                            ))}
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center w-full h-full pt-10 space-x-4">
                                                    <Avatar>
                                                        <AvatarImage src="/avatars/01.png" />
                                                        <AvatarFallback>OM</AvatarFallback>
                                                    </Avatar>
                                                    <FormField
                                                        control={form.control}
                                                        name="answer"
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
                                                    <Button type="submit">Comment</Button>
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
