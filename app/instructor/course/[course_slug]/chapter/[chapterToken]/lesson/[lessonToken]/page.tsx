'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, Image, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import useLessonDetail from '@/app/hook/useLessonDetail';
import { LessonTitleForm } from './components/lesson-title-form';
import { LessonDescriptionForm } from './components/lesson-description-form';
import { LessonVideoForm } from './components/lesson-video';
import { LessonActions } from './components/lesson-action';
import { ThumbnailForm } from './components/thumbnail-video';

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
                    className="flex items-center text-sm hover:opacity-75 transition mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                        <div>
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

                            <div className="mt-8">
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
                        <div className="space-y-6">
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
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default LessonToken;
