"use client";

import { Metadata } from "next"
import Image from "next/image"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import * as z from "zod";
import Processing from "../../course/component/processing"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import Loader from '@/components/loader';
import { Textarea } from "@/components/ui/textarea"

import data from "@/public/data_course_example.json";

export const metadata: Metadata = {
    title: "Music App",
    description: "Example music app using the components.",
}

const MAX_FILE_SIZE = 100000000;
const ACCEPTED_VIDEO_TYPES = ["video/avi", "video/mp4"];



const videoCourseSchema = z.object({
    video: z.any()
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 100MB.`)
        .refine(
            (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
            "Only .avi, .mp4 formats are supported."
        ),
    content: z
        .string()
        .min(10, {
            message: "Content must be at least 10 characters.",
        })
        .max(1000, {
            message: "Content must not be longer than 1000 characters.",
        }),
});

type VideoCourseValues = z.infer<typeof videoCourseSchema>;

export default function CreateCourse() {
    const [videoCourse, setVideoCourse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const defaultValues: Partial<VideoCourseValues> = {
        video: "",
        content: ""
    };


    const form = useForm<VideoCourseValues>({
        resolver: zodResolver(videoCourseSchema),
        defaultValues,
    })



    function SubmitUpdate(data: VideoCourseValues) {
        // setIsLoading(true);
        console.log("submit video")
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            // setFileInput(file);
            reader.onload = (e) => {
                if (e.target) {
                    setVideoCourse(e.target.result as string);
                }
            };

            reader.readAsDataURL(file);
        }
    }


    // function CancelImage() {
    //     setIsOpenChangeImage(false);
    //     setImageUser(user.image);
    // }


    return (
        <>
            <div className="md:hidden">
                <Image
                    src="/examples/music-light.png"
                    width={1280}
                    height={1114}
                    alt="Music"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/music-dark.png"
                    width={1280}
                    height={1114}
                    alt="Music"
                    className="hidden dark:block"
                />
            </div>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Processing />
                            <div className="col-span-3 lg:col-span-4 lg:border-l">
                                <div className="h-full px-4 py-6 lg:px-8">
                                    <Tabs defaultValue="music" className="h-full space-y-6">
                                        <div className="flex items-center bg-black space-between">

                                        </div>
                                        <TabsContent
                                            value="music"
                                            className="p-0 border-none outline-none"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        Listen Now
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Top picks for you. Updated daily.
                                                    </p>
                                                </div>
                                            </div>


                                        </TabsContent>
                                        <TabsContent
                                            value="podcasts"
                                            className="h-full flex-col border-none p-0 data-[state=active]:flex"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        New Episodes
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Your favorite podcasts. Updated daily.
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />


                                        </TabsContent>
                                        <div className="h-screen space-y-2">
                                            <div className="w-full border-2 rounded-lg aspect-video">
                                                <video
                                                    className={`${videoCourse.length === 0 ? "hidden" : "block "}`}
                                                    autoPlay
                                                    controls
                                                    muted
                                                    src={videoCourse}

                                                ></video>
                                            </div>
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(SubmitUpdate)}>
                                                    <FormField
                                                        control={form.control}
                                                        name="video"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input accept="video/*" type="file" {...form.register("video")} onChange={handleOnChange} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="content"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Content</FormLabel>
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
                                                    {/* <Input onChange={handleOnChange} accept="image/*" type="file" /> */}

                                                    <div className="grid w-full grid-cols-2 gap-10 pt-6">
                                                        <Button disabled={isLoading} type="submit">{isLoading ? <Loader /> : 'Save'}</Button>
                                                        <Button type="button">Cancel</Button>
                                                    </div>
                                                </form>
                                            </Form>
                                        </div>
                                    </Tabs>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}