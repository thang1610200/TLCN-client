'use client';
import { delay, motion, stagger } from "framer-motion"
import React from 'react';


export default function HomePage() {

    return (
        <>
            <div className='relative w-screen h-screen bg-gradient-to-l from-blue-950 to-sky-800'>
                <div className="auto-rows-auto grid grid-row-3 absolute right-[10%] top-[20%] h-3/5 w-1/4 bg-black bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]">
                    <div className='flex p-4 '>
                        <div className='p-2 rounded-lg  bg-slate-600 bg-opacity-75 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border  border-solid border-[rgba(_255,255,255,0.18_)]'>
                            <AnimatedText text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" className="text-white" />
                        </div>
                    </div>
                    <div className='flex p-4 '>
                        <div className='p-2 rounded-lg ml-28  bg-slate-600 bg-opacity-75 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border  border-solid border-[rgba(_255,255,255,0.18_)]'>
                            <span className='text-white'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam risus sapien, semper eget neque eu, aliquet eleifend lectus.</span>
                        </div>
                    </div>
                    <div className='flex items-center p-4 text-white '>
                        {/* <div className='relative grid grid-cols-12 p-2 mr-4 rounded-lg bg-slate-50 text-slate-900'>
                            <div className='col-span-11'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            </div>
                            <div className='text-xl text-center rounded-full w-7 h-7 bg-slate-600'>
                                {">"}
                            </div>
                        </div> */}
                        <div className='relative p-2 mr-4 rounded-lg bg-slate-50 text-slate-900'>
                            <div className='pr-6'>
                                Lorem ipsum dolor sit amet, consetur adipiscing elit
                            </div>
                            <div className='absolute text-xl text-center -translate-y-1/2 rounded-full right-2 top-1/2 w-7 h-7 bg-slate-300'>
                                {">"}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

const defaultAnimations = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible:{
        opacity: 1,
        y: -50,
        transition: {
            duration: 0.1
        }
    }
}

type AnimatedTextProps = {
    text: string,
    el?: keyof JSX.IntrinsicElements,
    className?: string
}

export const AnimatedText = ({
    text,
    el: Wrapper = "p",
    className,
}: AnimatedTextProps) => {
    return <Wrapper className={className}>
        <span className="sr-only">{text}</span>
        <motion.span className="inline-block" initial="hidden" animate="visible" transition={{staggerChildren: 0.1}} aria-hidden>
            {text.split("").map((char)=>(
                <motion.span variants={defaultAnimations}>{char}</motion.span>
            ))}
        </motion.span>
    </Wrapper>
}
