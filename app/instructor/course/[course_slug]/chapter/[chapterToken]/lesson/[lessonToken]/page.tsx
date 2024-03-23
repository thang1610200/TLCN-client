'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { IconBadge } from '@/components/icon-badge';
import {
    ArrowLeft,
    Image,
    LayoutDashboard,
    Video,
    ClipboardCheck,
    File
} from 'lucide-react';
import Link from 'next/link';
import useLessonDetail from '@/app/hook/useLessonDetail';
import { LessonTitleForm } from './components/lesson-title-form';
import { LessonDescriptionForm } from './components/lesson-description-form';
import { LessonVideoForm } from './components/lesson-video';
import { LessonActions } from './components/lesson-action';
import { ThumbnailForm } from './components/thumbnail-video';
import { AttachmentForm } from './components/attachment-form';

const LessonToken = ({
    params,
}: {
    params: { course_slug: string; chapterToken: string; lessonToken: string };
}) => {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error, mutate, isValidating } = useLessonDetail(
        params.course_slug,
        session.data?.user.email,
        session.data?.backendTokens.accessToken,
        params.chapterToken,
        params.lessonToken
    );
    const requiredFields = [data?.title, 
                            data?.description, 
                            data?.videoUrl,
                            data?.thumbnail];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    if (isLoading || isValidating) {
        return <LoadingModal />;
    }
    if (error) {
        return router.push('/instructor/course');
    }
    return (
        <>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="flex items-center bg-black space-between"></div>
                <Link
                    href={`/instructor/course/${params.course_slug}/chapter/${params.chapterToken}`}
                    className="flex items-center mb-6 text-sm transition hover:opacity-75"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Trở về trang thông tin chương
                </Link>
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Thông tin bài học
                            </h1>
                            <span className="text-sm text-slate-700">
                                Thông tin đã hoàn thành {completionText}
                            </span>
                        </div>
                        <LessonActions
                            coursePublished={data?.content.chapter.course.isPublished}
                            disabled={!isComplete}
                            course_slug={params.course_slug}
                            chapter_token={params.chapterToken}
                            lesson_token={params.lessonToken}
                            isPreview={data?.isPreview}
                            isPublished={data?.isPublished}
                            mutates={mutate}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">Chỉnh sửa bài học</h2>
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

                            <div className="flex items-center gap-x-2 mt-12">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                Tài nguyên & Tệp đính kèm
                                </h2>
                            </div>
                            <AttachmentForm
                                mutate={mutate}
                                initialData={data}
                                lesson_token={params.lessonToken}
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl">Thêm video mới</h2>
                            </div>
                            <LessonVideoForm
                                initialData={data}
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                lesson_token={params.lessonToken}
                                mutate={mutate}
                            />
                            <div className="flex items-center mt-12 gap-x-2">
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
                </TabsContent>
            </Tabs>
        </>
    );
};
export default LessonToken;
