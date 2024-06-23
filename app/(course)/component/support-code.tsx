import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/lib/constant';
import qs from 'query-string';
import { Button } from '@/components/ui/button';
import { Preview } from '@/components/preview';
import { RotateCw } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Editor } from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupportStore } from '@/app/hook/use-support-code';

interface SupportCodeProps {
    codeTitle?: string;
    codeLang?: string;
}

const SupportCode: React.FC<SupportCodeProps> = ({ codeTitle, codeLang }) => {
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData } = useSupportStore();

    async function supportCode() {
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/chatgpt/support-code`,
            query: {
                codeTitle,
                codeLang,
            },
        });
        try {
            setIsLoading(true);
            //console.log("codeTitle: " + codeTitle + " " + "codeLang: " + codeLang)
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            //console.log(response.data);
            setData(response.data);
        } catch (err) {
            //console.log(err);
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center w-full h-full mt-6">
                {(!data || data.length === 0) ? (
                    <>
                        {isLoading ? (
                            <Button disabled>
                                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lí
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    supportCode();
                                }}
                                className=" bg-emerald-500 hover:bg-emerald-700"
                            >
                                Hỗ trợ
                            </Button>
                        )}
                    </>
                ) : (
                    <Tabs defaultValue={data[0].id}>
                        <TabsList>
                            {data?.map((item, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={item.id || ''}
                                >{`${item.name}`}</TabsTrigger>
                            ))}
                        </TabsList>
                        {data?.map((item, index) => (
                            <TabsContent key={index} value={item.id || ''}>
                                <Card className="w-full h-full">
                                    <CardContent className="w-full h-full mt-10">
                                        <Editor
                                            height="300px"
                                            language={item.lang?.toLowerCase()} //Fetch API thêm language
                                            theme="vs-dark"
                                            defaultValue={item.code}
                                            className=""
                                        />
                                    </CardContent>
                                    <CardFooter>
                                        {item.explain}
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </>
    );
};

export default SupportCode;
