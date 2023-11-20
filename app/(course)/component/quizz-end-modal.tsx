import React, {
    useState,
    Fragment,
    useMemo,
    useEffect,
    useCallback,
} from 'react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, Loader2, RefreshCcw } from 'lucide-react';
import { Exercise, Lesson } from '@/app/types';
import { shuffle, indexOf } from 'lodash';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface QuizzEndModalProps {
    initdata?: Exercise;
    lesson?: Lesson;
}

export default function QuizzEndModal({
    initdata,
    lesson,
}: QuizzEndModalProps) {
    const index = lesson?.userProgress[0].userProgressQuiz.length || 0;
    const end = lesson?.userProgress[0].userProgressQuiz.length === initdata?.quizz.length;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [questionIndex, setQuestionIndex] = React.useState(index);
    const [hasEnded, setHasEnded] = React.useState(end);
    const session = useSession();
    const [selectedChoice, setSelectedChoice] = React.useState<number>(0);

    const currentQuestion = useMemo(() => {
        if (!initdata?.quizz) return;
        return initdata?.quizz[questionIndex];
    }, [questionIndex, initdata?.quizz]);

    const options = useMemo(() => {
        if (!currentQuestion) return [];
        if (!currentQuestion.option) return [];
        return currentQuestion.option as string[];
    }, [currentQuestion]);

    function checkAnswer(result?: string) {
        setIsLoading(true);
        axios
            .post(
                `${BACKEND_URL}/user-progress/add-answer-quiz`,
                {
                    email: session.data?.user.email,
                    lesson_token: lesson?.token,
                    quizzId: initdata?.quizz[questionIndex].id,
                    answer: initdata?.quizz[questionIndex].answer,
                    isCorrect: initdata?.quizz[questionIndex].answer === result,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(() => {
                if (questionIndex === (initdata?.quizz.length || 1) - 1) {
                    setHasEnded(true);
                    return;
                }
                setQuestionIndex((questionIndex) => questionIndex + 1);
            })
            .catch(() => {
                toast.error('Something went wrong');
            })
            .finally(() => setIsLoading(false));
    }

    const handleNext = useCallback(() => {
        checkAnswer(initdata?.quizz[questionIndex].option[selectedChoice]);

        setSelectedChoice(0);
    }, [questionIndex, initdata?.quizz.length, checkAnswer]);

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

    return (
        <>
            <div className="flex items-center justify-center">
                <Button
                    type="button"
                    onClick={() => {
                        setIsOpen(true);
                    }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-600/80 h-10 px-4 py-2 w-full md:w-auto"
                >
                    Exercise
                    <BookOpen className="ml-2" size={20} />
                </Button>
                {/* <button
                    type="button"
                    onClick={() => { setIsOpen(true) }}
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >

                </button> */}
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => {
                        setIsOpen(false);
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="md:w-[80vw] max-w-4xl w-[90vw] p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title>
                                        {hasEnded ? (
                                            <div className="pb-20 flex flex-col items-center">
                                                <h1 className="mb-8 text-center text-lg font-medium">
                                                    You got 2 out of { initdata?.quizz.length }
                                                    questions right.
                                                </h1>
                                                <Button className='md:text-lg'>
                                                    <div className="flex items-center">
                                                        <span className="mr-3">Restart quiz</span>
                                                        <RefreshCcw size={24} />
                                                    </div>
                                                </Button>
                                                <Button className='md:text-lg mt-5'>
                                                    <div className="flex items-center">
                                                        <span className="mr-3">Review quiz</span>
                                                        <RefreshCcw size={24} />
                                                    </div>
                                                </Button>
                                            </div>
                                        ) : (
                                            <Card className="w-full mt-4">
                                                <CardHeader className="flex flex-row items-center">
                                                    <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
                                                        <div>
                                                            {questionIndex + 1}
                                                        </div>
                                                        <div className="text-base text-slate-400">
                                                            {
                                                                initdata?.quizz
                                                                    ?.length
                                                            }
                                                        </div>
                                                    </CardTitle>
                                                    <CardDescription className="flex-grow text-lg">
                                                        {
                                                            currentQuestion?.question
                                                        }
                                                    </CardDescription>
                                                </CardHeader>
                                            </Card>
                                        )}
                                    </Dialog.Title>
                                    {!hasEnded && (
                                    <div className="flex flex-col items-center justify-center w-full mt-4">
                                        {options.map((option, index) => {
                                            return (
                                                <Button
                                                    key={option}
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
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
