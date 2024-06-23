'use client';

import React from 'react';
import { CourseCard } from '@/components/course-card';
import { PaginationCourse } from '@/components/pagination/course-access-pagination';
import ErrorModal from '@/components/error';
import { useAllTopicHome } from '@/app/hook/use-topic';
import SearchInput from '@/components/search-input';
import { useCourseAccess } from '@/app/hook/use-course';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import FilterCourseAccess from '../components/course-access-filter';
import SkeletonAccess from '../components/skeleton-access';

export default function page() {
    const session = useSession();
    const searchParams = useSearchParams();
    const currentTopic = searchParams.getAll('topic') || [];
    const currentLevel = searchParams.getAll('level') || [];
    const currentTitle = searchParams.get('title') || undefined;
    const currentPage = searchParams.get('page') || undefined;
    const { data, isLoading, error } = useCourseAccess(
        session.data?.user.email,
        session.data?.backendTokens.accessToken,
        currentTitle,
        currentTopic,
        currentLevel,
        currentPage
    );
    const { data: topic = [], loadingTopic } = useAllTopicHome();

    if (isLoading || loadingTopic) {
        return <SkeletonAccess topic={topic} />;
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
        );
    }

    return (
        <>
            <div className="flex items-center justify-center w-full h-full ">
                <div className="container flex flex-col items-center justify-center w-full h-full ">
                    <div className="flex items-end justify-center w-full h-20 gap-4 py-4">
                        <SearchInput />
                    
                        <FilterCourseAccess topic={topic} />
                    </div>
                    <div className="flex items-start justify-center w-full h-full">
                        <div className="flex items-center justify-center w-full h-full ">
                            <div className="flex items-center justify-center w-full h-full ">
                                <div className="grid w-full grid-cols-2 grid-rows-subgrid h-fit">
                                    {data?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-center w-full h-full"
                                        >
                                            <CourseCard
                                                key={index}
                                                slug={item.slug}
                                                title={item.title}
                                                imageUrl={item.picture!}
                                                description={item.description}
                                                progress={
                                                    (item?.percent || 0) * 100
                                                }
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
    );
}
