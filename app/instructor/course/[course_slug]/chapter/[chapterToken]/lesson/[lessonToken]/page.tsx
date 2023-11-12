'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, Image, LayoutDashboard, Video, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import useLessonDetail from '@/app/hook/useLessonDetail';
import { LessonTitleForm } from './components/lesson-title-form';
import { LessonDescriptionForm } from './components/lesson-description-form';
import { LessonVideoForm } from './components/lesson-video';
import { LessonActions } from './components/lesson-action';
import { ThumbnailForm } from './components/thumbnail-video';
import { LessonQuizzForm } from './components/lesson-quizz';

const LessonToken = ({
    params,
}: {
    params: { course_slug: string; chapterToken: string; lessonToken: string };
}) => {
    const session = useSession();
    const { data, isLoading, error, mutate } = useLessonDetail(
        params.course_slug,
        session.data?.user.email,
        session.data?.backendTokens.accessToken,
        params.chapterToken,
        params.lessonToken
    );

    const requiredFields = [data?.title, data?.description, data?.videoUrl];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    if (isLoading) {
        return <LoadingModal />;
    }

    if (error) {
        return redirect('/');
    }

    return (
        <>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="flex items-center bg-black space-between"></div>
                <a
                    href={`/instructor/course/${params.course_slug}/chapter/${params.chapterToken}`}
                    className="flex items-center mb-6 text-sm transition hover:opacity-75"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to chapter setup
                </a>
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Lesson Creation
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        <LessonActions
                            disabled={!isComplete}
                            course_slug={params.course_slug}
                            chapter_token={params.chapterToken}
                            lesson_token={params.lessonToken}
                            isPublished={data?.isPublished}
                            mutate={mutate}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-10 ">
                        <div className="grid grid-cols-2 grid-rows-1 gap-6 border-2">
                            <div className='border-2'>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={LayoutDashboard} />
                                    <h2 className="text-xl">
                                        Customize your lesson
                                    </h2>
                                </div>
                                <LessonTitleForm
                                    initialData={data}
                                    course_slug={params.course_slug}
                                    chapter_token={params.chapterToken}
                                    lesson_token={params.lessonToken}
                                    mutate={mutate}
                                />
                                <LessonDescriptionForm
                                    initialData={data}
                                    course_slug={params.course_slug}
                                    chapter_token={params.chapterToken}
                                    lesson_token={params.lessonToken}
                                    mutate={mutate}
                                />

                            </div>
                            <div className="border-2">
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={Image} />
                                    <h2 className="text-xl">Thumbnail</h2>
                                </div>
                                <ThumbnailForm
                                    initialData={data}
                                    course_slug={params.course_slug}
                                    chapter_token={params.chapterToken}
                                    lesson_token={params.lessonToken}
                                    mutate={mutate}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 space-y-6 border-2 aspect-video">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl">Add a video</h2>
                            </div>
                            <LessonVideoForm
                                initialData={data}
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                lesson_token={params.lessonToken}
                                mutate={mutate}
                            />
                        </div>
                        <div className="col-span-2 space-y-6 border-2">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ClipboardCheck} />
                                <h2 className="text-xl">Add Quizz</h2>
                            </div>
                            {/* <LessonVideoForm
                                initialData={data}
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                lesson_token={params.lessonToken}
                                mutate={mutate}
                            /> */}
                            {/* <LessonQuizzForm
                                    initialData={data}
                                    course_slug={params.course_slug}
                                    chapter_token={params.chapterToken}
                                    lesson_token={params.lessonToken}
                                    mutate={mutate}
                                /> */}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default LessonToken;
