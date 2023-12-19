'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useExerciseDetail from '@/app/hook/useExerciseDetail';
import LoadingModal from '@/components/modal/loading-modal';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard, ListChecks, Zap } from 'lucide-react';
import { TitleForm } from './components/title-form';
import { Actions } from './components/action';
import { ExerciseTypeForm } from './components/exercise-type';
import { QuizzForm } from './components/quizz-form';
import QuizzAiModal from './components/quiz-ai-form';

const ExerciseDetail = ({ params }: { params: { token: string } }) => {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error, mutate } = useExerciseDetail(
        session.data?.user.email,
        session.data?.backendTokens.accessToken,
        params.token
    );

    const requiredFields = [
        data?.title,
        data?.type,
        data?.quizz.length > 0,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    if (isLoading) {
        return <LoadingModal />;
    }

    if (error) {
        return router.back();
    }

    return (
        <>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="flex items-center bg-black space-between"></div>
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
                            disabled={!isComplete}
                            token={params.token}
                            isOpen={data?.isOpen}
                            mutate={mutate}
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
                                initialData={data}
                                token={data?.token}
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
                                            exercise_token={data?.token}
                                            mutate={mutate}
                                        />
                                    </div>
                                </div>
                                <QuizzForm
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
