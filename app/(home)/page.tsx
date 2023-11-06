'use client';

import React from 'react';
import useAllCoursePublish from '../hook/useAllCoursePublish';
import LoadingModal from '@/components/modal/loading-modal';
import { Categories } from './components/categories';
import { CoursesList } from '@/components/courses-list';
import useAllTopicHome from '../hook/useAllTopicHome';
import { useSearchParams } from 'next/navigation';

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
            <div className="p-6 space-y-4">
                <Categories items={topic} />
                <CoursesList items={data} />
            </div>
        </>
    );
}
