'use client';

import React from 'react';
import SearchInput from '@/components/search-input';
import { useSearchParams } from 'next/navigation';
import useAllCoursePublish from '../hook/useAllCoursePublish';
import LoadingModal from '@/components/modal/loading-modal';
import ErrorModal from '@/components/error';
import { useAllTopicHome } from '../hook/use-topic';
import { CoursesList } from './components/ListCourse'
import DropBarFilter from './components/DropBarFilter';
import Skeleton from './components/skeleton';

export default function HomePage() {
    const searchParams = useSearchParams();
    const currentTopic = searchParams.getAll('topic') || [];
    const currentLevel = searchParams.getAll('level') || [];
    const currentTitle = searchParams.get('title') || undefined;
    const currentPage = searchParams.get('page') || undefined;
    const currentDuration = searchParams.getAll('duration') || [];

    const { data, isLoading, error } = useAllCoursePublish(
        currentTitle,
        currentTopic,
        currentLevel,
        currentPage,
        currentDuration
    );
    const { data: topic = [], loadingTopic } = useAllTopicHome();

    if (isLoading || loadingTopic) {
        return <Skeleton topic={topic} />;
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
                        <DropBarFilter topic={topic} />
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
