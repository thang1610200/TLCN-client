import { useReviewQuizStore } from '@/app/hook/useReviewQuizStore';
import { Quizz } from '@/app/types';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface PreviewResultQuizProps {
    initdata?: Quizz;
    answer?: string;
    isCorrect: boolean;
}

const PreviewResultQuiz: React.FC<PreviewResultQuizProps> = ({
    initdata,
    answer,
    isCorrect,
}) => {
    const previewResult = useReviewQuizStore();

    return (
        <div className="flex flex-col items-center justify-center w-full mt-4">
            {initdata?.option.map((option, index) => {
                return (
                    <Button
                        key={index}
                        variant={
                            answer === option
                                ? isCorrect
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
                                {initdata?.answer}
                            </span>
                        </div>
                        <div className="mt-2 text-base">
                            Explain:{' '}
                            <span className="text-black font-normal">
                                {initdata?.explain}
                            </span>
                        </div>
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
            </Card>
            <div className="mt-2 flex justify-between">
                <Button variant="default" size="lg" onClick={() => {previewResult.onClose()}}>
                    Restart
                </Button>
            </div>
        </div>
    );
};

export default PreviewResultQuiz;
