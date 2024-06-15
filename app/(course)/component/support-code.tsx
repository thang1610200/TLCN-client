import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/lib/constant';
import qs from 'query-string';
import { Button } from '@/components/ui/button';
import { Preview } from '@/components/preview';
import { RotateCw } from 'lucide-react';

interface SupportCodeProps {
    codeTitle?: string;
    codeLang?: string;
}

interface ResponseProps {
    code?: string,
    explain?: string;
}

const SupportCode:React.FC<SupportCodeProps> = ({
    codeTitle,
    codeLang
}) => {
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ResponseProps>();
    async function supportCode() {
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/chatgpt/support-code`,
            query: {
                codeTitle,
                codeLang
            }
        })
        try {
            setIsLoading(true)
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            //onsole.log(response.data[0]);
            setData(response.data[0])
        }
        catch(err) {
            console.log(err);
            toast.error('Something went wrong!');
        }
        finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            <div className='flex items-center justify-center w-full h-full mt-6'>
                {!data
                    ? <>
                        {isLoading
                            ? <Button disabled>
                                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lí
                            </Button>
                            : <Button onClick={() => { supportCode() }} className=' bg-emerald-500 hover:bg-emerald-700'>Hỗ trợ</Button>
                        }
                    </>
                    : (
                        <p>{data.code}</p>
                    )
                }
            </div>
        </>
    )
}

export default SupportCode;
