'use client';

import { Content, Exercise, UserProgressQuiz } from '@/app/types';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { ChevronRight, Loader2, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { KeyedMutator, mutate } from 'swr';
import qs from 'query-string';
import { countBy } from 'lodash';
import { useReviewQuizStore } from '@/app/hook/use-review-quiz-store';
import QuizReview from './quiz-review';

interface QuizModalProps {
    data?: Exercise;
    content_current: Content;
    isLocked?: boolean;
    isValidating: boolean;
    mutateProgress: KeyedMutator<any>;
    quiz?: UserProgressQuiz[];
    next_content_token: string;
    course_slug: string;
}

const QuizModal: React.FC<QuizModalProps> = ({
    data,
    content_current,
    isLocked,
    isValidating,
    mutateProgress,
    quiz,
    next_content_token,
    course_slug,
}) => {
    const session = useSession();
    const router = useRouter();
    const review = useReviewQuizStore();
    const [questionIndex, setQuestionIndex] = useState(quiz?.length || 0);
    const [selectedChoice, setSelectedChoice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const currentQuestion = useMemo(() => {
        if (!data?.quizz) return;
        return data?.quizz[questionIndex];
    }, [questionIndex, data?.quizz]);

    const options = useMemo(() => {
        if (!currentQuestion) return [];
        if (!currentQuestion.option) return [];
        return currentQuestion.option as string[];
    }, [currentQuestion]);

    const answer_correct = useMemo(() => {
        return countBy(quiz, ({ isCorrect }) => (isCorrect ? 'true' : 'false'));
    }, [content_current]);

    const handleNext = async () => {
        setIsLoading(true);
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/course/detail-course-auth`,
            query: {
                course_slug,
                email: session.data?.user.email,
            },
        });
        try {
            await axios.post(
                `${BACKEND_URL}/user-progress/add-answer-quiz`,
                {
                    email: session.data?.user.email,
                    quiz_token: data?.quizz[questionIndex].token,
                    answer: data?.quizz[questionIndex].option[selectedChoice],
                    user_progress_id: content_current.userProgress[0].id,
                    exercise_token: data?.token,
                    next_content_token,
                    course_slug,
                    last_quiz: questionIndex + 1 === data?.quizz.length,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (questionIndex + 1 === data?.quizz.length) {
                mutate([url, session.data?.backendTokens.accessToken]);
                mutateProgress();
                router.refresh();
            }
            setQuestionIndex((item) => item + 1);
            setSelectedChoice(0);
        } catch (err: any) {
            console.log(err);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const retakeQuiz = async () => {
        setIsLoading(true);
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/user-progress/retake-quiz`,
            query: {
                email: session.data?.user.email,
                user_progress_id: content_current.userProgress[0].id,
                course_slug,
                content_token: content_current.token,
            },
        });
        try {
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            mutateProgress();
            setQuestionIndex(0);
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            if (key === '1') {
                setSelectedChoice(0);
            } else if (key === '2') {
                setSelectedChoice(1);
            } else if (key === '3') {
                setSelectedChoice(2);
            } else if (key === '4') {
                setSelectedChoice(3);
            } else if (key === 'Enter') {
                handleNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleNext]);

    if (isValidating) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (questionIndex === data?.quizz.length && !review.isOpen) {
        return (
            <>
                <div className="w-full py-6">
                    <div className="container flex items-center justify-center px-4">
                        <div className="space-y-3 text-center">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                Quiz Result
                            </h1>
                        </div>
                    </div>
                </div>
                <section className="w-full py-6">
                    <div className="container flex items-center justify-center px-4">
                        <div className="grid w-full max-w-sm gap-2">
                            <div className="grid grid-cols-2 items-center justify-between">
                                <p className="text-sm font-medium">Score</p>
                                <p className="text-sm font-medium text-right">
                                    {`${answer_correct?.true || 0}/${
                                        data?.quizz.length
                                    }`}
                                </p>
                            </div>
                            <div className="rounded-full h-0.5 bg-gray-200 dark:bg-gray-800" />
                            <div className="grid grid-cols-2 items-center justify-between">
                                <p className="text-sm font-medium">Feedback</p>
                                <p className="text-sm font-medium text-right">
                                    {answer_correct?.true >= data.number_correct
                                        ? 'Well done!'
                                        : 'Try harder next time!'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-6">
                    <div className="container flex items-center justify-center px-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                disabled={isLoading}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                onClick={() => {
                                    retakeQuiz();
                                }}
                            >
                                Retake Quiz
                            </Button>
                            <Button
                                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 text-gray-900 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                onClick={() => review.onOpen()}
                            >
                                Review Quiz
                            </Button>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <div>
            {isLocked ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This exercise is locked</p>
                </div>
            ) : (
                <>
                    {!review.isOpen ? (
                        <>
                            <Card className="w-full">
                                <CardHeader className="flex flex-row items-center">
                                    <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
                                        <div>{questionIndex + 1}</div>
                                        <div className="text-base text-slate-400">
                                            {data?.quizz.length}
                                        </div>
                                    </CardTitle>
                                    <CardDescription className="flex-grow text-lg">
                                        {currentQuestion?.question}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <div className="flex flex-col items-center justify-center w-full mt-4">
                                {options.map((option, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            variant={
                                                selectedChoice === index
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="justify-start w-full py-8 mb-4"
                                            onClick={() =>
                                                setSelectedChoice(index)
                                            }
                                        >
                                            <div className="flex items-center justify-start">
                                                <div className="p-2 px-3 mr-5 border rounded-md">
                                                    {index + 1}
                                                </div>
                                                <div className="text-start">
                                                    {option}
                                                </div>
                                            </div>
                                        </Button>
                                    );
                                })}
                                <div className="mt-2 flex justify-between">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        disabled={isLoading}
                                        onClick={() => {
                                            handleNext();
                                        }}
                                    >
                                        {isLoading && (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        )}
                                        Next{' '}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <QuizReview initdata={data} user_progress_quiz={quiz} />
                    )}
                </>
            )}
        </div>
    );
};

export default QuizModal;
