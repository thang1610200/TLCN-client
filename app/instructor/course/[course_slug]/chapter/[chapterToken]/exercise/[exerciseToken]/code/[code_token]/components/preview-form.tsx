'use client';

import { KeyedMutator } from 'swr';
import { Code } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/constant';

interface FileFormProps {
    initialData?: Code;
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
}

interface CodeProps {
    value: string;
}

export const PreviewForm = ({
    initialData,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token,
}: FileFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputValues, setInputValues] = useState<CodeProps[]>([]);
    const session = useSession();

    useEffect(() => {
        const initialInputValues = initialData?.file.map((item) => {
            const data: CodeProps = {
                value: item.default_content
            };

            return data;
        });

        setInputValues(initialInputValues || []);
    }, [initialData?.file]);

    const onSubmit = async () => {
        setIsLoading(true);
        const codeFile: string[] = [];

        inputValues.forEach((item) => {
            codeFile.push(btoa(item.value));
        })

        try {
            const response = await axios.post(`${BACKEND_URL}/evaluate/preview`, {
                code_token,
                exercise_token,
                course_slug,
                chapter_token,
                email: session.data?.user.email,
                codeFile
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if(response.data) {
                toast.success('Exactly');
            }
            else {
                toast.error('Wrong');
            }
        }
        catch {
            toast.error('Something went wrong');
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Preview
            </div>
            {
                (!initialData?.fileTest && !initialData?.file) ? (
                    <p
                        className='text-sm mt-2 text-slate-500 italic'
                    >
                        No preview
                    </p>
                ) : (
                    <Tabs defaultValue={initialData.file[0]?.id}>
                        <TabsList>
                            {
                                initialData.file?.map((item, index) => (
                                    <TabsTrigger key={index} value={item.id}>{`${item.fileName}.${item.mime}`}</TabsTrigger>
                                ))
                            }
                        </TabsList>
                        {
                            initialData.file?.map((item, index) => (
                                <TabsContent key={index} value={item.id}>
                                    <div className="space-y-4 mt-4">
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
                                        <div className="flex items-center gap-x-2">
                                            <Button disabled={isLoading} type="button" onClick={onSubmit}>
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            ))
                        }
                    </Tabs>
                )
            }
        </div>
    );
};
