import React from 'react'
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import FirstNavBar from './FirstNavBar';
import AutoRunText from './AutoRunText';

export default function FirstScreen() {
    return (
        <div className="w-screen h-screen dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] overflow-hidden">
            <div className='flex items-center justify-center flex-auto'>
                <div className="container flex flex-col ml-20">
                    <div className="flex max-w-4xl mt-20">
                        <h1 className="p-4 text-6xl leading-snug text-left font-beauSans-extrabold text-slate-950 line-clamp-2 ">Khám phá sức mạnh của kiến thức</h1>
                    </div>
                    <div className="">
                        <h2 className="p-4 text-xl text-left font-beauSans text-slate-950 text-balance">Nơi bạn kết nối với những người cùng đam mê, học hỏi những kiến thức mới và phát triển bản thân mỗi ngày</h2>
                    </div>
                    <div className="p-4">
                        <Button className='h-16 gap-2 text-lg text-center rounded-full bg-emerald-500 font-beauSans-extrabold w-80 text-slate-50'>
                            <h6>Khám phá ngay</h6>
                            <ArrowRight />
                        </Button>
                    </div>
                </div>
                <div className="container">
                    <Image src="/images/learning.jpg" alt='image product' width={560} height={560} className='mix-blend-multiply' />
                </div>
            </div>
            <AutoRunText/>
        </div>
    )
}
