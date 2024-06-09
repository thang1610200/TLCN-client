import {
    Content,
    Exercise,
    LanguageOptions,
    UserProgressCode,
    UserProgressQuiz,
} from '@/app/types';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { ChevronRight, Loader2, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { KeyedMutator, mutate } from 'swr';
import qs from 'query-string';
import Split from 'react-split';
import OutputWindow from './output-code';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Editor } from '@monaco-editor/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizModalProps {
    data?: Exercise;
    isLocked?: boolean;
    isValidating: boolean;
    mutateProgress: KeyedMutator<any>;
    course_slug: string;
    content_current: Content;
    next_content_token: string;
    codeProgress: UserProgressCode[];
}

interface CodeProps {
    value: string;
}

const CodeModal: React.FC<QuizModalProps> = ({
    data,
    isLocked,
    isValidating,
    mutateProgress,
    course_slug,
    content_current,
    next_content_token,
    codeProgress
}) => {
    const session = useSession();
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [outputDetails, setOutputDetails] = useState('');
    const [inputValues, setInputValues] = useState<CodeProps[]>([]);

    useEffect(() => {
        // if(content_current.userProgress[0].isCompleted) {
        //     setOutputDetails('3');
        // }

        const initialInputValues = data?.code?.file.map((item, index) => {
            const data: CodeProps = {
                value: codeProgress[index]?.answer || item.default_content
            };

            return data;
        });

        setInputValues(initialInputValues || []);
    }, [codeProgress, data?.code?.file, content_current.userProgress]);

    const handleSubmit = async () => {
        setProcessing(true);

        const codeFile: string[] = [];

        inputValues.forEach((item) => {
            codeFile.push(btoa(item.value));
        })

        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/course/detail-course-auth`,
            query: {
                course_slug,
                email: session.data?.user.email,
            },
        });

        const formData = {
            code_token: data?.code.token,
            exercise_token: data?.token,
            course_slug,
            content_token: content_current.token,
            email: session.data?.user.email,
            codeFile,
            next_content_token
        };

        const options = {
            method: 'POST',
            url: `${BACKEND_URL}/code/submit-code`,
            headers: {
                Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                'content-type': 'application/json',
                'Content-Type': 'application/json',
            },
            data: formData,
        };

        try {
            const response = await axios.request(options);
            mutate([url, session.data?.backendTokens.accessToken]);
            mutateProgress();
            router.refresh();
            if (response.data) {
                setOutputDetails('2')
            }
            else {
                setOutputDetails('1');
            }
        } catch {
            toast.error('Something went error!');
        } finally {
            setProcessing(false);
        }
    };


    if (isValidating) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    const regex = /(<([^>]+)>)/gi;

    return (
        <div>
            {isLocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
                    <Lock className="w-8 h-8" />
                    <p className="text-sm">This exercise is locked</p>
                </div>
            ) : (
                <>
                    <Split
                        sizes={[75, 25]}
                        minSize={280}
                        expandToMin={true}
                        gutterSize={10}
                        gutterAlign="center"
                        snapOffset={30}
                        dragInterval={1}
                        direction="horizontal"
                        cursor="col-resize"
                        className="flex row-auto aspect-video"
                    >
                        <div>
                            <Tabs defaultValue={data?.code.file[0].id}>
                                <TabsList>
                                    {data?.code.file.map((item, index) => (
                                        <TabsTrigger
                                            key={index}
                                            value={item.id}
                                        >{`${item.fileName}.${item.mime}`}</TabsTrigger>
                                    ))}
                                </TabsList>
                                {data?.code.file.map((item, index) => (
                                    <TabsContent
                                        key={index}
                                        value={item.id}
                                        className="aspect-video"
                                    >
                                        <Editor
                                            value={inputValues[index]?.value}
                                            height="100px"
                                            language={item.language}
                                            theme="oceanic-next"
                                            defaultValue={item.default_content}
                                            onChange={(data: any) => {
                                                const updatedInputValues = [...inputValues];
                                                updatedInputValues[index].value = data;
                                                setInputValues(updatedInputValues);
                                            }}
                                        />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                        <Split
                            sizes={[75, 25]}
                            minSize={200}
                            expandToMin={true}
                            gutterSize={10}
                            gutterAlign="center"
                            snapOffset={30}
                            dragInterval={1}
                            direction="vertical"
                            cursor="col-resize"
                            className='flex flex-col w-full h-full row-auto'>
                            <Card className='w-full h-full'>
                                <CardHeader className='flex flex-row items-center justify-between'>
                                    <CardTitle>Bài tập</CardTitle>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        variant={'success'}
                                    >
                                        Submit
                                    </Button>
                                </CardHeader>
                                <CardContent className=''>
                                    {data?.code.question.replace(regex, "")}
                                </CardContent>
                            </Card>
                            <OutputWindow outputDetails={outputDetails} />
                        </Split>
                    </Split>
                </>
            )}
        </div>
    );
};

export default CodeModal;
