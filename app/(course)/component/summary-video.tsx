import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import qs from 'query-string';
import { BACKEND_URL } from '@/lib/constant';
import { Content } from '@/app/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { RotateCw } from 'lucide-react';

interface SummaryVideoProps {
    initdata?: Content;
    course_slug: string;
}



export default function SummaryVideo({ initdata, course_slug }: SummaryVideoProps) {
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [summaryText, setSummaryText] = useState("")
    async function generateSummary() {
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/lesson/summary-video`,
            query: {
                content_token: initdata?.token,
                course_slug
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
            setSummaryText(response.data)
        }
        catch {
            toast.error('Something went wrong!');
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center w-full h-full mt-6'>
            {summaryText === ""
                ? <>
                    {isLoading
                        ? <Button disabled>
                            <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                            Đang xử lí
                        </Button>
                        : <Button onClick={()=>{generateSummary()}} className=' bg-emerald-500 hover:bg-emerald-700'>Tạo nội dung tóm tắt</Button>
                    }
                </>
                : <span>{summaryText}</span>}
        </div>
    )
}
