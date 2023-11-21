"use client";

import { Button } from '@/components/ui/button';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronRight } from 'lucide-react';
import { ExoticComponent, useCallback, useMemo, useState } from 'react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Exercise, UserProgressQuiz } from '@/app/types';
import { useReviewQuizStore } from '@/app/hook/useReviewQuizStore';
import { find } from 'lodash';
import useProgressQuiz from '@/app/hook/useProgressQuiz';
import { useSession } from 'next-auth/react';
import LoadingModal from '@/components/modal/loading-modal';

interface QuizReviewProps {
    fragment: ExoticComponent<{
        children?: React.ReactNode;
    }>;
    initdata?: Exercise;
    quiz?: string;
}

const QuizReview = ({ fragment, initdata, quiz }: QuizReviewProps) => {
    const session = useSession();
    const { data: answerquiz = [], isLoading } = useProgressQuiz(session.data?.backendTokens.accessToken, quiz);
    const [questionIndex, setQuestionIndex] = useState(0);
    const review = useReviewQuizStore();
    const handleNext = useCallback(() => {
        if (questionIndex === (initdata?.quizz.length || 1) - 1) {
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
        if(!answerquiz) return;
        return find(answerquiz,{ 'quizzId': currentQuestion?.id });
    },[questionIndex,answerquiz]);

    const options = useMemo(() => {
        if (!currentQuestion) return [];
        if (!currentQuestion.option) return [];
        return currentQuestion.option as string[];
    }, [currentQuestion]);


    if(isLoading){
        return (<LoadingModal />);
    }

    return (
        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                    as={fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="md:w-[80vw] max-w-4xl w-[90vw] p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <Dialog.Title>
                            <Card className="w-full mt-4">
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
                        </Dialog.Title>
                        <div className="flex flex-col items-center justify-center w-full mt-4">
                            {options.map((option, index) => {
                                return (
                                    <Button
                                        key={index}
                                        variant={
                                            currentAnswer?.answer === option
                                                ? (currentAnswer.isCorrect  ? 'success' : 'destructive')
                                                : 'outline'
                                        }
                                        className="justify-start w-full py-8 mb-4"
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
                            <Card className="w-full mt-4">
                                <CardHeader className="flex items-center float-left">
                                    <CardTitle className="mr-5 divide-zinc-600/50">
                                        <div className='text-base'>
                                            Correct Answer:{' '}<span className='text-green-600'>{ currentQuestion?.answer }</span>
                                        </div>
                                        <div className='mt-2 text-base'>Explain:{' '}<span className='text-black font-normal'>{ currentQuestion?.explain }</span></div>
                                    </CardTitle>
                                    <CardDescription>
                                        
                                    </CardDescription>
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
                                    {(questionIndex === (initdata?.quizz.length || 1) - 1) ? "Finish" : "Next" } 
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </div>
    );
};

export default QuizReview;
