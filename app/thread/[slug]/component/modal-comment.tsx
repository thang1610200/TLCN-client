"use client"

import { Heart, MessageCircle, Share2 } from 'lucide-react';
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


interface ModalThreadProps {
    dataComment: string[];
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
    const comment = props.dataComment;

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
                <Heart size={32} />
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
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Comment
                                    </Dialog.Title>
                                    <div className="flex items-center justify-center ">
                                        <div className="w-full h-full space-y-4">
                                            {comment.map((comment: string) => (
                                                <Textarea
                                                    readOnly = {true}
                                                    placeholder={comment}
                                                    className="resize-none focus-visible:ring-0 focus-visible:border-none"
                                                />
                                            ))}
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                                                    <FormField
                                                        control={form.control}
                                                        name="answer"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Tell us a little bit about yourself"
                                                                        className="resize-none"
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
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => { setIsOpen(false) }}
                                        >
                                            Close Modal
                                        </button>
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
