"use client"

import { Button } from '@/components/ui/button';
import React from 'react';
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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

const QuestionAnswerFormSchema = z.object({
    answer: z
        .string()
})

type QuestionAnswerFormValues = z.infer<typeof QuestionAnswerFormSchema>

// This can come from your database or API.
const defaultValues: Partial<QuestionAnswerFormValues> = {
    answer: "comment here"
}

export default function HomePage() {
    const answerExample = ["I think you should do", "I dont think you should do"]
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
            <div className="flex items-center justify-center w-screen h-screen p-6 ">

                <div className="w-3/4 p-4 border-4 h-fit">
                    <div className="w-full my-6 text-3xl font-bold text-left h-fit indent-6 ">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse posuere ante in efficitur facilisis. Donec dignissim, ante ut feugiat auctor</div>
                    {answerExample.map((answer: string) => (
                        <div className="w-full h-[50px] flex space-x-4 space-y-4 justify-center items-center">
                            <div className='flex items-center justify-center overflow-hidden rounded-full shrink-0'>
                                <img src="https://picsum.photos/40/40" className="flex items-center justify-center w-full h-full aspect-square" width={40} height={40} />
                            </div>
                            <div className='flex w-full h-10 px-3 py-2 my-4 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>{answer}</div>
                        </div>
                    ))}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        
                                        {/* <FormLabel>Username</FormLabel> */}
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} className='mt-4 focus:ring-0' />
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
        </>
    );
}
