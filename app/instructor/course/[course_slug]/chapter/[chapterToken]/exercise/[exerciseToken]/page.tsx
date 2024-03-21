'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useExerciseDetail from '@/app/hook/useExerciseDetail';
import LoadingModal from '@/components/modal/loading-modal';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, LayoutDashboard, ListChecks, Zap } from 'lucide-react';
import { TitleForm } from './components/title-form';
import { Actions } from './components/action';
import { ExerciseTypeForm } from './components/exercise-type';
import { QuizzForm } from './components/quizz-form';
import QuizzAiModal from './components/quiz-ai-form';
import Link from 'next/link';
import { NumberAnswerCorrectForm } from './components/answer-correct-quiz';

const ExerciseDetail = ({ params }: { params: { exerciseToken: string, course_slug: string; chapterToken: string; } }) => {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error, mutate, isValidating } = useExerciseDetail(
        session.data?.user.email,
        session.data?.backendTokens.accessToken,
        params.exerciseToken,
        params.course_slug,
        params.chapterToken
    );

    const requiredFields = [
        data?.title,
        data?.type,
        data?.quizz?.length > 0,
    ];

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
                                Exercise setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        <Actions
                            course_slug={params.course_slug}
                            chapter_token={params.chapterToken}
                            disabled={!isComplete}
                            token={params.exerciseToken}
                            isOpen={data?.isOpen}
                            mutates={mutate}
                            isCheck={data?.lesson?.length > 0}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your exercise
                                </h2>
                            </div>
                            <TitleForm
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                initialData={data}
                                token={data?.token}
                                mutate={mutate}
                            />
                            <NumberAnswerCorrectForm
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                initialData={data}
                                exercise_token={data?.token}
                                mutate={mutate}
                            />
                            <ExerciseTypeForm initialData={data} />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={ListChecks} />
                                    <h2 className="text-xl">Question list</h2>
                                    <div className="ml-auto">
                                        <QuizzAiModal
                                            course_slug={params.course_slug}
                                            chapter_token={params.chapterToken}
                                            exercise_token={data?.token}
                                            mutate={mutate}
                                        />
                                    </div>
                                </div>
                                <QuizzForm
                                    course_slug={params.course_slug}
                                    chapter_token={params.chapterToken}
                                    initialData={data}
                                    exercise_token={data?.token}
                                    mutate={mutate}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default ExerciseDetail;
