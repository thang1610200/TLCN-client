'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { IconBadge } from '@/components/icon-badge';
import {
    ArrowLeft,
    Image,
    LayoutDashboard,
    Video,
    ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import useLessonDetail from '@/app/hook/useLessonDetail';
import { LessonTitleForm } from './components/lesson-title-form';
import { LessonDescriptionForm } from './components/lesson-description-form';
import { LessonVideoForm } from './components/lesson-video';
import { LessonActions } from './components/lesson-action';
import { ThumbnailForm } from './components/thumbnail-video';
import { ExerciseLessonForm } from './components/add-exercise-form';
import useAllExercise from '@/app/hook/useAllExerciseOpen';
import { NumberQuestionPass } from './components/add-number-pass';
//import { LessonQuizzForm } from './components/lesson-quizz';

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
    const {
        data: exercise = [],
        error_exercise,
        loading,
    } = useAllExercise(
        session.data?.user.email,
        session.data?.backendTokens.accessToken
    );
    const requiredFields = [data?.title, data?.description, data?.videoUrl];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    if (isLoading || loading) {
        return <LoadingModal />;
    }
    if (error || error_exercise) {
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
                    Trở về trang thông tin chương
                </a>
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
                            disabled={!isComplete}
                            course_slug={params.course_slug}
                            chapter_token={params.chapterToken}
                            lesson_token={params.lessonToken}
                            isPublished={data?.isPublished}
                            mutate={mutate}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Chỉnh sửa bài học
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

                            <div className="flex items-center mt-12 gap-x-2">
                                <IconBadge icon={ClipboardCheck} />
                                <h2 className="text-xl">Bài tập</h2>
                            </div>
                            <ExerciseLessonForm
                                initialData={data}
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                lesson_token={params.lessonToken}
                                mutate={mutate}
                                options={exercise.map((item) => ({
                                    label: item.title,
                                    value: item.id,
                                    type: item.type,
                                }))}
                            />

                            <NumberQuestionPass
                                initialData={data}
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                lesson_token={params.lessonToken}
                                mutate={mutate}
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
