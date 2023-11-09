'use client';
import { motion } from "framer-motion"
import React from 'react';


export default function HomePage() {
    const variants = {
        blink_caret: {
            borderColor: ["blue","orange"],
            transition:{
                duration: 0.25,
                repeat:10,
                },
        },
        typing: {
            width: [0, 250],
            transition:{
                duration: 5,
                ease: "linear"
                },
        },
      }

    return (
        <>
            <div className='relative w-screen h-screen bg-gradient-to-l from-blue-950 to-sky-800'>
                <div className="auto-rows-auto grid grid-row-3 absolute right-[10%] top-[20%] h-3/5 w-1/4 bg-black bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]">
                    <div className='flex p-4 '>
                        <div className='p-2 rounded-lg   bg-slate-600 bg-opacity-75 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border  border-solid border-[rgba(_255,255,255,0.18_)]'>
                            <motion.div className="w-0 mx-auto my-0 overflow-hidden border-r-2 whitespace-nowrap" variants={variants} initial={["blink_caret","typing"]} animate={["blink_caret","typing"]} >
                                <motion.h1 className="text-white " >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam risus sapien, semper eget neque eu, aliquet eleifend lectus.
                                </motion.h1>
                            </motion.div>
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
