'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Exercise, UserProgressQuiz } from '@/app/types';
import { find } from 'lodash';
import { useReviewQuizStore } from '@/app/hook/use-review-quiz-store';

interface QuizReviewProps {
    initdata?: Exercise;
    user_progress_quiz?: UserProgressQuiz[];
}

const QuizReview = ({ initdata, user_progress_quiz }: QuizReviewProps) => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const review = useReviewQuizStore();

    const handleNext = useCallback(() => {
        if (questionIndex + 1 === initdata?.quizz.length) {
            review.onClose();
            return;
        }
        setQuestionIndex((index) => index + 1);
    }, [questionIndex, initdata?.quizz]);

    const currentQuestion = useMemo(() => {
        if (!initdata?.quizz) return;
        return initdata?.quizz[questionIndex];
    }, [questionIndex, initdata?.quizz]);

    const currentAnswer = useMemo(() => {
        if (!user_progress_quiz) return;
        return find(user_progress_quiz, { quizzId: currentQuestion?.id });
    }, [questionIndex, user_progress_quiz]);

    const options = useMemo(() => {
        if (!currentQuestion) return [];
        if (!currentQuestion.option) return [];
        return currentQuestion.option as string[];
    }, [currentQuestion]);

    return (
        <>
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center">
                    <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
                        <div>{questionIndex + 1}</div>
                        <div className="text-base text-slate-400">
                            {initdata?.quizz?.length}
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
                                currentAnswer?.answer === option
                                    ? currentAnswer.isCorrect
                                        ? 'success'
                                        : 'destructive'
                                    : 'outline'
                            }
                            className="justify-start w-full py-8 mb-4"
                        >
                            <div className="flex items-center justify-start">
                                <div className="p-2 px-3 mr-5 border rounded-md">
                                    {index + 1}
                                </div>
                                <div className="text-start">{option}</div>
                            </div>
                        </Button>
                    );
                })}
                <Card className="w-full mt-4">
                    <CardHeader className="flex items-center float-left">
                        <CardTitle className="mr-5 divide-zinc-600/50">
                            <div className="text-base">
                                Correct Answer:{' '}
                                <span className="text-green-600">
                                    {currentQuestion?.answer}
                                </span>
                            </div>
                            <div className="mt-2 text-base">
                                Explain:{' '}
                                <span className="text-black font-normal">
                                    {currentQuestion?.explain}
                                </span>
                            </div>
                        </CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                </Card>
                <div className="mt-2 flex justify-between">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => {
                            handleNext();
                        }}
                    >
                        {questionIndex + 1 === initdata?.quizz.length
                            ? 'Finish'
                            : 'Next'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
};

export default QuizReview;
