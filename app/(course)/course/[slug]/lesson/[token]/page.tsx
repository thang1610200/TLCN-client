'use client';

import { Button } from '@/components/ui/button';
import LoadingModal from '@/components/modal/loading-modal';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { map, flatten, findIndex, shuffle } from 'lodash';
import VideoReview from '@/app/(course)/component/video-review';
import { OverviewNavigation } from '@/app/(course)/component/overview-navigation';
import QuizzEndModal from '@/app/(course)/component/quizz-end-modal';
import CourseSidebar from '@/app/(course)/component/course-sidebar';
import useLessonDetailUser from '@/app/hook/useLessonDetailUser';
import { useSession } from 'next-auth/react';
import CourseProgressButton from '@/app/(course)/component/course-progress-button';
import { Banner } from '@/components/banner';
import useCourseDetailAuth from '@/app/hook/useCourseDetailAuth';
import { useCallback, useMemo } from 'react';

const CourseAccessDetail = ({
    params,
}: {
    params: { slug: string; token: string };
}) => {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error } = useCourseDetailAuth(
        params.slug,
        session.data?.user.email,
        session.data?.backendTokens.accessToken
    );
    const { lesson, loadingLesson, errorLesson, mutate, isValidating } =
        useLessonDetailUser(
            params.slug,
            session.data?.backendTokens.accessToken,
            params.token,
            session.data?.user.email
        );

    const lessonlist = useMemo(() => {
        return flatten(map(data?.chapters, 'lessons'));
    },[data?.chapters])

    const indexLesson = useMemo(() => {
        return findIndex(lessonlist, { token: params.token });
    },[lessonlist, params.token]);

    const isLocked = lesson?.userProgress.length === 0 ? true : false;

    const onNextLesson = useCallback(() => {
        let index =
        findIndex(lessonlist, { token: params.token }) === -1
            ? 0
            : findIndex(lessonlist, { token: params.token });

        index = index === lessonlist.length - 1 ? 0 : index + 1;

        router.push(`/course/${params.slug}/lesson/${lessonlist[index].token}`);
    },[params.slug, lessonlist, router]);

    const onPrevLesson = useCallback(() => {
        let index =
            findIndex(lessonlist, { token: params.token }) === -1
                ? 0
                : findIndex(lessonlist, { token: params.token });

        index = index === 0 ? lessonlist.length - 1 : index - 1;

        router.push(`/course/${params.slug}/lesson/${lessonlist[index].token}`);
    },[params.slug, lessonlist, router]);

    if (isLoading || loadingLesson) {
        return (<LoadingModal />);
    }

    if (error || errorLesson) {
        return router.back();
    }

    return (
        <div>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-3 mt-4">
                            <div className="col-span-2 p-4">
                                {isLocked && (
                                    <Banner
                                        variant="warning"
                                        label="You need to complete the previous lesson."
                                    />
                                )}
                                <div className="relative aspect-video border rounded-md bg-slate-100 mb-4">
                                    <VideoReview
                                        data={lesson}
                                        isLocked={isLocked}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <Button onClick={onPrevLesson}>
                                        <ArrowLeft className="mr-2" /> Prev
                                        Lesson
                                    </Button>
                                    <Button onClick={onNextLesson}>
                                        Next Lesson{' '}
                                        <ArrowRight className="ml-2" />
                                    </Button>
                                </div>
                                <div className="border rounded-md p-6 flex flex-col lg:flex-row items-center justify-between mt-6">
                                    <h2 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-0 lg:text-center">
                                        {lesson?.title}
                                    </h2>
                                    {!isLocked && (
                                        <div className="flex items-center space-x-2">
                                            {lesson?.exercise && (
                                                <QuizzEndModal
                                                    initdata={lesson.exercise}
                                                    lesson={lesson}
                                                    isValidating={isValidating}
                                                    mutate={mutate}
                                                    nextLesson={
                                                        lessonlist[
                                                            indexLesson + 1
                                                        ]
                                                    }
                                                    course_slug={params.slug}
                                                />
                                            )}
                                            <CourseProgressButton
                                                initdata={lesson}
                                                course_slug={params.slug}
                                                mutate={mutate}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CourseSidebar
                                initdata={data}
                                course_slug={params.slug}
                                lesson_token={params.token}
                            />
                            {/* <div className="h-full col-span-2 p-4">
                                <OverviewNavigation
                                    data={lesson}
                                    tokenLesson={
                                        tokenLesson === ''
                                            ? data?.chapters[0].lessons[0].token
                                            : tokenLesson
                                    }
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAccessDetail;
