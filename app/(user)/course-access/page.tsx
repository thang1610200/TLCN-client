'use client';
import { DataTable } from '../components/data-table';
import { Tabs, TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { columns } from '../components/columns';
import useAllCoursePublish from '@/app/hook/useAllCoursePublish';
import { CourseCard } from '@/components/course-card';
import { PaginationCourse } from '@/components/pagination/course-access-pagination';

import ErrorModal from '@/components/error';
import Skeleton from '@/app/home/components/skeleton';
import { useAllTopicHome } from '@/app/hook/use-topic';
import SearchInput from '@/components/search-input';
import DropBarFilter from '@/app/home/components/DropBarFilter';

export default function page() {
    const { data, isLoading, error } = useAllCoursePublish(
        undefined,
        undefined
    );
    const { data: topic = [], loadingTopic } = useAllTopicHome();
    if (isLoading || loadingTopic) {
        return <Skeleton topic={topic} />;
    }

    if (error) {
        return <ErrorModal status_code={500} status_name="Internal Server" />;
    }

    if (!data) {
        return (
            <div className="flex flex-row flex-wrap items-start justify-start w-full h-full overflow-hidden">
                <div className="mt-10 text-sm text-center text-muted-foreground">
                    No courses found
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-center w-full h-full ">
                <div className="container flex flex-col items-center justify-center w-full h-full ">
                    <div className="flex items-end justify-center w-full h-20 gap-4 py-4">
                        <SearchInput />
                        <DropBarFilter topic={topic} />
                    </div>
                    <div className="flex items-start justify-center w-full h-full">
                        <div className='flex items-center justify-center w-full h-full '>
                            <div className="flex items-center justify-center w-full h-full ">
                                <div className='grid w-full grid-cols-2 grid-rows-subgrid h-fit'>
                                    {data?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-center w-full h-full">
                                            <CourseCard
                                                key={index}
                                                slug={item.slug}
                                                title={item.title}
                                                imageUrl={item.picture!}
                                                chaptersLength={item.chapters.length}
                                                total={item.total}
                                                description={item.description}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PaginationCourse />
        </>
    )
}
