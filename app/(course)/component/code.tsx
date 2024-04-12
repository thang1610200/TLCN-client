import {
    Content,
    Exercise,
    LanguageOptions,
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
import { CodeInputEditor } from './code-input-editor';
import { useComplie } from '@/app/hook/use-editor-complie';

interface QuizModalProps {
    data?: Exercise;
    isLocked?: boolean;
    isValidating: boolean;
    mutateProgress: KeyedMutator<any>;
    course_slug: string;
}

const CodeModal: React.FC<QuizModalProps> = ({
    data,
    isLocked,
    isValidating,
    mutateProgress,
    course_slug,
}) => {
    const session = useSession();
    const router = useRouter();
    const { editorCode, valueCode } = useComplie();
    const [processing, setProcessing] = useState(false);
    const [outputDetails, setOutputDetails] = useState(null);

    useEffect(() => {
        if (!data?.code) return;
        return editorCode(data.code.file[0].default_content);
    }, [data?.code]);

    const checkStatus = async (token: string) => {
        const options = {
            method: 'GET',
            url: process.env.NEXT_PUBLIC_RAPID_API_URL_SUBMISSION + '/' + token,
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPID_API_HOST,
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
            },
        };
        try {
            let response = await axios.request(options);
            let statusId = response.data.status?.id;

            // Processed - we have a result
            if (statusId === 1 || statusId === 2) {
                // still processing
                setTimeout(() => {
                    checkStatus(token);
                }, 2000);
                return;
            } else {
                setProcessing(false);
                toast.success(`Compiled Successfully!`, {
                    position: 'top-right',
                });
                setOutputDetails(response.data);
                return;
            }
        } catch {
            setProcessing(false);
        }
    };

    const hanldeComplie = async () => {
        setProcessing(true);

        const languageCode = LanguageOptions.find((item) => {
            return item.value === data?.code.labCode.language[0];
        });

        const formData = {
            language_id: languageCode?.id,
            source_code: btoa(valueCode),
            //stdin: btoa(),
        };

        const options = {
            method: 'POST',
            url: process.env.NEXT_PUBLIC_RAPID_API_URL_SUBMISSION,
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPID_API_HOST,
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
            },
            data: formData,
        };

        try {
            const response = await axios.request(options);
            const token = response.data.token;
            checkStatus(token);
        } catch {
            toast.error('Something went error!');
        } finally {
            setProcessing(false);
        }
    };

    if (isValidating) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
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
                                        <CodeInputEditor
                                            language={item.language}
                                            defaultValue={item.default_content}
                                        />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                        <div className="flex flex-col gap-2">
                            <OutputWindow outputDetails={outputDetails} />
                            <div className="flex row gap-2 flex-row-reverse">
                                <Button
                                    disabled={processing}
                                    variant={'success'}
                                >
                                    Submit
                                </Button>
                                <Button
                                    onClick={hanldeComplie}
                                    disabled={processing}
                                    variant={'outline'}
                                >
                                    Run
                                </Button>
                            </div>
                        </div>
                    </Split>
                </>
            )}
        </div>
    );
};

export default CodeModal;
