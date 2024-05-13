'use client';

import { Button } from '@/components/ui/button';
import LoadingModal from '@/components/modal/loading-modal';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { map, flatten, findIndex } from 'lodash';
import { OverviewNavigation } from '@/app/(course)/component/overview-navigation';
import CourseSidebar from '@/app/(course)/component/course-sidebar';
import useLessonDetailUser from '@/app/hook/useLessonDetailUser';
import { useSession } from 'next-auth/react';
import CourseProgressButton from '@/app/(course)/component/course-progress-button';
import { Banner } from '@/components/banner';
import useCourseDetailAuth from '@/app/hook/useCourseDetailAuth';
import { useCallback, useMemo } from 'react';
import VideoReview from '@/app/(course)/component/video-review';
import QuizModal from '@/app/(course)/component/quiz';
import CodeModal from '@/app/(course)/component/code';
import BentoGridCoursePage from './lesson-bento-grid';
import { BentoGrid } from '@/components/ui/bento-grid';

export default function CourseAccessDetail({ params }: { params: { slug: string; token: string } }) {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error } = useCourseDetailAuth(
        params.slug,
        session.data?.user.email,
        session.data?.backendTokens.accessToken
    );
    const { content, loadingContent, errorContent, isValidating, mutate } =
        useLessonDetailUser(
            params.slug,
            session.data?.backendTokens.accessToken,
            params.token,
            session.data?.user.email
        );

    const contentlist = useMemo(() => {
        return flatten(map(data?.chapters, 'contents'));
    }, [data?.chapters]);

    const indexLesson = useMemo(() => {
        return findIndex(contentlist, { token: params.token });
    }, [contentlist, params.token]);

    const isOwner = data?.owner.email === session.data?.user.email;
    const isLocked = (content?.userProgress.length === 0 && !isOwner) ? true : false;

    const onNextLesson = useCallback(() => {
        let index =
            findIndex(contentlist, { token: params.token }) === -1
                ? 0
                : findIndex(contentlist, { token: params.token });

        index = index === contentlist.length - 1 ? 0 : index + 1;

        router.push(`/course/${params.slug}/lesson/${contentlist[index].token}`);
    }, [params.slug, contentlist, router, params.token]);

    const onPrevLesson = useCallback(() => {
        let index =
            findIndex(contentlist, { token: params.token }) === -1
                ? 0
                : findIndex(contentlist, { token: params.token });

        index = index === 0 ? contentlist.length - 1 : index - 1;

        router.push(`/course/${params.slug}/lesson/${contentlist[index].token}`);
    }, [params.slug, contentlist, router, params.token]);

    if (isLoading || loadingContent) {
        return (
            <SkeletonGird/>
        )
    }

    if (error || errorContent) {
        return router.push("/");
    }

    return (
        <div className='w-screen h-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]'>
            <BentoGridCoursePage params={params} />
            {/* <div className="hidden md:block">
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
                                <div>
                                    { content?.type === "LESSON"  && (
                                        <div className="relative mb-4 border rounded-md aspect-video bg-slate-100">
                                            <VideoReview
                                                data={content.lesson}
                                                isLocked={isLocked}
                                            />
                                        </div>
                                    )}
                                    { content?.type === "EXERCISE"  && (
                                        <div className="relative mb-4 border rounded-md aspect-video">
                                            {
                                                content.exercise?.type === 'QUIZZ' && (
                                                    <QuizModal
                                                        content_current={content}
                                                        isValidating={isValidating}
                                                        data={content.exercise}
                                                        isLocked={isLocked}
                                                        course_slug={params.slug}
                                                        mutateProgress={mutate}
                                                        next_content_token={
                                                            contentlist[indexLesson + 1]?.token
                                                        }
                                                        quiz={content?.userProgress[0]?.userProgressQuiz}
                                                    />
                                                )
                                            }
                                            {
                                                content.exercise?.type === 'CODE' && (
                                                    <CodeModal 
                                                        content_current={content}
                                                        isValidating={isValidating}
                                                        data={content.exercise}
                                                        isLocked={isLocked}
                                                        mutateProgress={mutate}
                                                        course_slug={params.slug}
                                                        next_content_token={
                                                            contentlist[indexLesson + 1]?.token
                                                        }
                                                        codeProgress={content?.userProgress[0]?.userProgressCode || []}
                                                    />
                                                )
                                            }
                                        </div>
                                    )}
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
                                <div className="flex flex-col items-center justify-between p-6 mt-6 border rounded-md lg:flex-row">
                                    <h2 className="mb-2 text-lg font-semibold lg:text-2xl lg:mb-0 lg:text-center">
                                        {content?.lesson?.title || content?.exercise?.title}
                                    </h2>
                                    {!isLocked && (
                                        <div className="flex items-center space-x-2">
                                            {
                                                content?.type === "LESSON" && (
                                                    <CourseProgressButton
                                                        isValidating={isValidating}
                                                        initdata={content}
                                                        course_slug={params.slug}
                                                        mutate={mutate}
                                                        next_lesson={
                                                            contentlist[indexLesson + 1]
                                                        }
                                                    />
                                                )
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CourseSidebar
                                initdata={data}
                                course_slug={params.slug}
                                content_token={params.token}
                            />
                            <div className="h-full col-span-2 p-4">
                                {
                                    content?.type === "LESSON" && (
                                        <OverviewNavigation
                                            lesson={content.lesson}
                                            course={data}
                                            course_slug={params.slug}
                                        />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

const SkeletonGird = () => (
    <BentoGrid className="w-screen h-screen mx-auto duration-[1500] md:auto-rows-min animate-pulse ">
        <div className="w-full h-[80vh] col-span-3 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
        <div className="md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
        <div className="md:col-span-1 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
    </BentoGrid>
)