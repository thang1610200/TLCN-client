'use client';

import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
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

const CourseAccessDetail = ({
    params,
}: {
    params: { slug: string; token: string };
}) => {
    const session = useSession();
    const { data, isLoading, error } = useCourseDetailHome(params.slug);
    const { lesson, loadingLesson, errorLesson, mutate } = useLessonDetailUser(
        params.slug,
        session.data?.backendTokens.accessToken,
        params.token,
        session.data?.user.email
    );
    const router = useRouter();
    if (isLoading || loadingLesson) {
        return <LoadingModal />;
    }

    if (error || errorLesson) {
        return router.back();
    }

    const lessonlist = flatten(map(data?.chapters, 'lessons'));

    const isLocked = lesson?.userProgress.length === 0 ? true : false;

    function onNextLesson() {
        let index =
            findIndex(lessonlist, { token: params.token }) === -1
                ? 0
                : findIndex(lessonlist, { token: params.token });

        index = index === lessonlist.length - 1 ? 0 : index + 1;

        router.push(`/course/${params.slug}/lesson/${lessonlist[index].token}`);
    }

    function onPrevLesson() {
        let index =
            findIndex(lessonlist, { token: params.token }) === -1
                ? 0
                : findIndex(lessonlist, { token: params.token });

        index = index === 0 ? lessonlist.length - 1 : index - 1;

        router.push(`/course/${params.slug}/lesson/${lessonlist[index].token}`);
    }

    return (
        <div>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-3 grid-rows-2 mt-4">
                            <div className="col-span-2 p-4">
                                {isLocked && (
                                    <Banner
                                        variant="warning"
                                        label="You need to complete the previous lesson."
                                    />
                                )}
                                <div className="relative aspect-video border rounded-md overflow-hidden bg-slate-100 mb-4">
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
                            <div className="h-full col-span-2 p-4">
                                {/* <OverviewNavigation
                                    data={lesson}
                                    tokenLesson={
                                        tokenLesson === ''
                                            ? data?.chapters[0].lessons[0].token
                                            : tokenLesson
                                    }
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAccessDetail;
