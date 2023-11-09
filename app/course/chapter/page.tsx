'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Processing from '../component/processing';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from '@/components/ui/form';
import Loader from '@/components/loader';
import { Textarea } from '@/components/ui/textarea';
import useAllCoursePublish from '@/app/hook/useAllCoursePublish';
import { course } from '@/types';

export const metadata: Metadata = {
    title: 'Music App',
    description: 'Example music app using the components.',
};

export default function DetailChapter() {
    const { data, isLoading } = useAllCoursePublish();
    const data_chapter1: course = data ? data[0] : null;
    const [videoCourse, setVideoCourse] = useState('');

    // const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         // setFileInput(file);
    //         reader.onload = (e) => {
    //             if (e.target) {
    //                 setVideoCourse(e.target.result as string);
    //             }
    //         };

    //         reader.readAsDataURL(file);
    //     }
    // };
    return (
        <>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Processing
                                data={data_chapter1 && data_chapter1.id}
                            />
                            {data_chapter1 && (
                                <div className="col-span-3 lg:col-span-4 lg:border-l">
                                    <div className="h-full px-4 py-6 lg:px-8">
                                        <Tabs
                                            defaultValue="music"
                                            className="h-full space-y-6"
                                        >
                                            <div className="flex items-center bg-black space-between"></div>
                                            <TabsContent
                                                value="music"
                                                className="p-0 border-none outline-none"
                                            >
                                                
                                            </TabsContent>
                                            <div className="h-[40%] aspect-video space-y-2">
                                                <div className="w-full h-full border-2 rounded-lg"></div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <Button>Previous Lesson</Button>
                                                <Button>Next Lesson</Button>
                                            </div>
                                            <div className='w-screen h-screen border-2'>
                                                content
                                            </div>
                                        </Tabs>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
