'use client';

import { useConfettiStore } from '@/app/hook/useConfettiStore';
import { Quizz } from '@/app/types';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import PreviewResultQuiz from './preview-result-quiz';
import toast from 'react-hot-toast';
import { useReviewQuizStore } from '@/app/hook/useReviewQuizStore';

interface PreviewQuizProps {
    initdata?: Quizz;
}

const PreviewQuiz: React.FC<PreviewQuizProps> = ({ initdata }) => {
    const confetti = useConfettiStore();
    const [selectedChoice, setSelectedChoice] = useState<number>(0);
    const previewResult = useReviewQuizStore();
    const [isCorrect, setIsCorrect] = useState(false);

    const checkAnswer = (result?: string) => {
        if(result === initdata?.answer){
            setIsCorrect(true);
            toast('Good Job!', {
                icon: '👏',
            });
            confetti.onOpen();
        }
        else{
            setIsCorrect(false);
            toast('Not Good!', {
                icon: '😔',
            });
        }

        previewResult.onOpen();
        return;
    };

    return (
        <div className="p-4 rounded-lg gird bg-slate-100">
            <Card className="w-full mt-4">
                <CardHeader className="flex flex-row items-center">
                    <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
                        <div>1</div>
                        <div className="text-base text-slate-400">1</div>
                    </CardTitle>
                    <CardDescription className="flex-grow text-lg">
                        {initdata?.question}
                    </CardDescription>
                </CardHeader>
            </Card>
            {!previewResult.isOpen ? (
                <div className="flex flex-col items-center justify-center w-full mt-4">
                    {initdata?.option.map((option, index) => {
                        return (
                            <Button
                                key={index}
                                variant={
                                    selectedChoice === index
                                        ? 'default'
                                        : 'outline'
                                }
                                className="justify-start w-full py-8 mb-4"
                                onClick={() => setSelectedChoice(index)}
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
                    <div className="mt-2 flex justify-between">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => {
                                checkAnswer(initdata?.option[selectedChoice])
                            }}
                        >
                            {/* {isLoading && (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    )} */}
                            Submit
                        </Button>
                    </div>
                </div>
            ) : (
                <PreviewResultQuiz
                    answer={initdata?.option[selectedChoice]}
                    initdata={initdata}
                    isCorrect={isCorrect}
                />
            )}
        </div>
    );
};

export default PreviewQuiz;
