'use client';

import React from 'react';
import SearchInput from '@/components/search-input';
import { useSearchParams } from 'next/navigation';
import useAllCoursePublish from '../hook/useAllCoursePublish';
import LoadingModal from '@/components/modal/loading-modal';
import ErrorModal from '@/components/error';
import FilterBar from './components/filter-bar';
import { CoursesList } from '@/components/courses-list';
import { useAllTopicHome } from '../hook/use-topic';

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
        return <LoadingModal />;
    }

    if (error) {
        return <ErrorModal status_code={500} status_name="Internal Server" />;
    }

    return (
        <>
            <div className="container p-0">
                <div className="w-full h-full space-y-10">
                    <div className="w-full h-20 py-4 space-y-4 ">
                        <SearchInput />
                    </div>
                    <div className="flex">
                        <div className="w-full h-full">
                            <div className="w-full h-full bg-background">
                                <div className="grid grid-cols-6 place-content-center">
                                    <FilterBar topic={topic} />
                                    <CoursesList items={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
