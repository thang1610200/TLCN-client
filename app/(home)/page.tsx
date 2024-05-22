'use client';

import React from 'react';
import SearchInput from '@/components/search-input';
import { useSearchParams } from 'next/navigation';
import useAllCoursePublish from '../hook/useAllCoursePublish';
import ErrorModal from '@/components/error';



import { useAllTopicHome } from '../hook/use-topic';
import { CoursesList } from './components/ListCourse'
import DropBarFilter from './components/DropBarFilter';

export default function HomePage() {
    const searchParams = useSearchParams();
    const currentTopic = searchParams.get('topic') || undefined;
    const currentTitle = searchParams.get('title') || undefined;

    const { data, isLoading, error } = useAllCoursePublish(
        currentTitle,
        currentTopic
    );
    const { data: topic = [] } = useAllTopicHome();

    if (isLoading) {
        return <Skeleton />;
    }

    if (error) {
        return <ErrorModal status_code={500} status_name="Internal Server" />;
    }

    return (
        <>
            <div className="flex items-center justify-center w-full h-full ">
                <div className="container flex flex-col items-center justify-center w-full h-full gap-10">
                    <div className="flex items-end justify-center w-full h-20 gap-4 py-4">
                        <SearchInput />
                        <DropBarFilter />
                    </div>
                    <div className="flex items-start justify-center w-full h-full">
                        {/* <FilterBar topic={topic} />  */}
                        <CoursesList items={data} />
                    </div>
                </div>
            </div>
        </>
    );
}

const Skeleton = () => (
    <div className="flex items-center justify-center w-full h-full ">
        <div className="container flex flex-col items-center justify-center w-full h-full gap-10">
            <div className="flex items-end justify-center w-full h-20 gap-4 py-4">
                <SearchInput />
                <DropBarFilter />
            </div>
            <div className="flex items-start justify-center w-full h-full">
                <div className='flex flex-row flex-wrap items-start justify-start w-full overflow-hidden h-fit'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                        <div key={index} className="flex items-center justify-center w-1/2 h-48 animate-pulse">
                            <div className="flex items-start justify-start w-full h-full gap-4 p-4 overflow-hidden rounded-lg group">
                                <div className="relative overflow-hidden rounded-md min-w-52 max-w-52 h-36">
                                    <div className="h-full aspect-video w-52 bg-slate-200 "></div>
                                </div>
                                <div className="flex flex-col items-center justify-center w-full h-full bg-slate-400 ">
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

)
