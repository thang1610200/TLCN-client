"use client";

import { Metadata } from "next"
import Image from "next/image"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import Processing from "../component/processing"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form"
import Loader from '@/components/loader';
import { Textarea } from "@/components/ui/textarea"
import useAllCoursePublish from "@/app/hook/useAllCoursePublish";
import { course } from "@/types";


export const metadata: Metadata = {
    title: "Music App",
    description: "Example music app using the components.",
}







export default function DetailCourse() {
    const { data, isLoading } = useAllCoursePublish();
    const data_chapter1: course = data ? data[0] : null;
    const [videoCourse, setVideoCourse] = useState("");



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
    return (
        <>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Processing data={data_chapter1 && data_chapter1.id} />
                            {data_chapter1 &&
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
                                                            {data_chapter1.title}
                                                        </h2>
                                                        <p className="text-sm text-muted-foreground">
                                                            {data_chapter1.owner_id}
                                                        </p>
                                                    </div>
                                                </div>


                                            </TabsContent>
                                            {/* <TabsContent
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


                                            </TabsContent> */}
                                            <div className="w-full p-2 border-2 rounded-lg h-fit">
                                                <h3 className="text-xl font-semibold tracking-tight">Course Descrription</h3>
                                                <p className="text-left indent-8">{data_chapter1.description}</p>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="w-full p-2 border-2 rounded-lg h-fit">
                                                <h3 className="text-xl font-semibold tracking-tight">Learning outcome</h3>
                                                <p className="text-left indent-8">{data_chapter1.learning_outcome}</p>
                                            </div>
                                            <div className="h-screen space-y-2">
                                                <div className="w-full border-2 rounded-lg aspect-video">
                                                </div>
                                            </div>
                                        </Tabs>

                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}