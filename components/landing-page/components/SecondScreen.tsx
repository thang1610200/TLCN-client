import React, { useEffect, useRef } from 'react'
import AnimationChatGPT from './animation-chatgpt'
import { useAnimation, useInView } from 'framer-motion';

export default function SecondScreen() {
    const ref = useRef(null);
    const isInView = useInView(ref);
    return (
        <div className=" w-screen h-screen  dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] " ref={ref}>
            <div className="container flex items-center justify-center w-full h-full gap-32 ">
                <div className="flex flex-col items-center justify-center gap-4 ">
                    <div className='text-6xl font-bold leading-tight tracking-widest text-center whitespace-pre w-fit font-TheFutute' >
                        <h1 className=' first-letter:text-emerald-500 first-letter:text-8xl'>ARTIFACT</h1>
                        <h1 className=' first-letter:text-emerald-500 first-letter:text-8xl'>INTELLIGENT</h1>
                    </div>
                    <h3 className='text-lg '>Học tập hiện đại với trí tuệ nhân tạo - Linh hoạt và cá nhân hóa.</h3>
                </div>
                <div className="flex items-center justify-center w-full h-full">
                    <AnimationChatGPT isInView={isInView}/>
                </div>
            </div>
        </div>
    )
}
