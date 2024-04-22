'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, Eye, FileCode, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useDetailCode, useLanguageCode } from '@/app/hook/use-code';
import { CodeQuestionForm } from './components/code-question-form';
import { CodeLabForm } from './components/code-lab-form';
import { FileForm } from './components/file-form';
import { TestCaseForm } from './components/test-case-form';
import { FunctionForm } from './components/function-form';

const CodeDetailPage = ({
    params,
}: {
    params: { exerciseToken: string; code_token: string; chapterToken: string; course_slug: string };
}) => {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error, mutate, isValidating } = useDetailCode(
        session.data?.user.email,
        params.code_token,
        params.exerciseToken,
        params.course_slug,
        params.chapterToken,
        session.data?.backendTokens.accessToken,
    );

    const { data: language = [], languageCodeError, languageCodeLoading } = useLanguageCode(session.data?.user.email, session.data?.backendTokens.accessToken);

    if (isLoading || isValidating || languageCodeLoading) {
        return <LoadingModal />;
    }

    if (error || languageCodeError) {
        return router.push('/instructor/course');
    }

    return (
        <>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="flex items-center bg-black space-between"></div>
                <Link
                    href={`/instructor/course/${params.course_slug}/chapter/${params.chapterToken}/exercise/${params.exerciseToken}`}
                    className="flex items-center mb-6 text-sm transition hover:opacity-75"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to exercise setup
                </Link>
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Code setup
                            </h1>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your code
                                </h2>
                            </div>
                            <CodeQuestionForm
                                code_token={params.code_token}
                                chapter_token={params.chapterToken}
                                course_slug={params.course_slug}
                                exercise_token={params.exerciseToken}
                                initialData={data}
                                mutate={mutate} 
                            />
                            <CodeLabForm 
                                code_token={params.code_token}
                                chapter_token={params.chapterToken}
                                course_slug={params.course_slug}
                                exercise_token={params.exerciseToken}
                                initialData={data}
                                mutate={mutate} 
                                language={language}
                            />

                            <TestCaseForm
                                code_token={params.code_token}
                                chapter_token={params.chapterToken}
                                course_slug={params.course_slug}
                                exercise_token={params.exerciseToken}
                                initialData={data?.testcase || []}
                                mutate={mutate} 
                            />
                        </div>
                        <div className="space-y-6 col-span-2">
                            <div className="flex items-center gap-x-2 ">
                                <IconBadge icon={FileCode} />
                                <h2 className="text-xl">File</h2>
                            </div>
                            {
                                data?.labCode.lab !== 'WebDev' && (
                                    <FunctionForm
                                        initialData={data}
                                        code_token={params.code_token}
                                        chapter_token={params.chapterToken}
                                        course_slug={params.course_slug}
                                        exercise_token={params.exerciseToken}
                                        mutate={mutate} 
                                    />
                                )
                            }
                            <FileForm 
                                code_token={params.code_token}
                                chapter_token={params.chapterToken}
                                course_slug={params.course_slug}
                                exercise_token={params.exerciseToken}
                                initialData={data}
                                mutate={mutate} 
                                languageLab={data?.labCode.language || []}
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default CodeDetailPage;
