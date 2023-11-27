'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, Eye, LayoutDashboard } from 'lucide-react';
import useQuizzDetail from '@/app/hook/useQuizzDetail';
import { QuestionForm } from '../components/question-form';
import { OptionForm } from '../components/option-form';
import { ExplainForm } from '../components/explain-form';
import { ActionQuestion } from '../components/action-question';
import PreviewQuiz from '../components/preview-quiz';

const QuizzDetail = ({
    params,
}: {
    params: { token: string; quizz_token: string };
}) => {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error, mutate } = useQuizzDetail(
        session.data?.user.email,
        session.data?.backendTokens.accessToken,
        params.token,
        params.quizz_token
    );

    const requiredFields = [data?.question, data?.answer, data?.option];

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
                <a
                    href={`/instructor/exercise/${params.token}`}
                    className="flex items-center mb-6 text-sm transition hover:opacity-75"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to exercise setup
                </a>
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Question setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        <ActionQuestion
                            disabled={!isComplete}
                            token={params.quizz_token}
                            exercise_token={params.token}
                            isPublished={data?.isPublished}
                            mutate={mutate}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your question
                                </h2>
                            </div>
                            <QuestionForm
                                initialData={data}
                                exercise_token={params.token}
                                token={data?.token}
                                mutate={mutate}
                            />
                            <OptionForm
                                initialData={data}
                                exercise_token={params.token}
                                token={data?.token}
                                mutate={mutate}
                            />
                            <ExplainForm
                                initialData={data}
                                exercise_token={params.token}
                                token={data?.token}
                                mutate={mutate}
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-x-2 ">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">Preview</h2>
                            </div>
                            <PreviewQuiz
                                initdata={data} 
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default QuizzDetail;
