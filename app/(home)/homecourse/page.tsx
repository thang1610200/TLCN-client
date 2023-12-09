'use client';

import React from 'react';
import useAllCoursePublish from '../../hook/useAllCoursePublish';
import LoadingModal from '@/components/modal/loading-modal';
import { Categories } from '../components/categories';
import { CoursesList } from '@/components/courses-list';
import useAllTopicHome from '../../hook/useAllTopicHome';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import FilterBar from './components/filter-bar';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PlusCircle } from 'lucide-react';
import InfoCourse from './components/info-course';


export default function HomePage() {
    const searchParams = useSearchParams();
    const currentTopic = searchParams.get('topic') || undefined;
    const currentTitle = searchParams.get('title') || undefined;

    const { data, isLoading } = useAllCoursePublish(currentTitle, currentTopic);
    const { data: topic = [] } = useAllTopicHome();

    if (isLoading) {
        return <LoadingModal />;
    }
    return (
        <>
            <div className="container w-screen h-screen p-0">
                <div className="w-full h-full space-y-10">
                    <div className="w-full h-20 py-4 space-y-4 ">
                        
                        <Input
                            placeholder="Filter User..."
                            // value={
                            //     (table
                            //         .getColumn('title')
                            //         ?.getFilterValue() as string) ?? ''
                            // }
                            // onChange={(event) =>
                            //     table
                            //         .getColumn('title')
                            //         ?.setFilterValue(event.target.value)
                            // }
                            className="w-full h-full rounded-3xl bg-white bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border border-solid border-[rgba(_255,255,255,0.18_)]"
                        />
                    </div>
                    <div className="flex w-full h-screen">
                        <div className="w-full h-full ">
                            <div className="w-full h-full bg-background">
                                <div className="grid grid-cols-6 place-content-center">
                                    <FilterBar className="flex w-full h-full col-span-1 " />
                                    <div className="w-full h-full col-span-5 ">
                                        <div className="flex flex-wrap items-center justify-center w-full h-full gap-y-6 gap-x-6">
                                            <InfoCourse/>
                                            <InfoCourse/>
                                            <InfoCourse/>
                                            <InfoCourse/>
                                            <InfoCourse/>
                                            <InfoCourse/>
                                            <InfoCourse/>
                                            <InfoCourse/>
                                            <InfoCourse/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* <div className="p-6 space-y-4">
                <Categories items={topic} />
                <CoursesList items={data} />
            </div> */}
        </>
    );
}
