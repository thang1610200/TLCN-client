'use client';
import { motion, stagger } from "framer-motion"
import React from 'react';


export default function HomePage() {
    const variants = {
        initial: {
            width: 0, 
            borderRightWidth: 2 
        },
        animate: {
            width: 250, 
            borderRightWidth: 0,
            transition: {
                staggerChildren: 2,
                duration: 2
              }
        },

    }
    return (
        <>
            <div className='relative w-screen h-screen bg-gradient-to-l from-blue-950 to-sky-800'>
                <div className="auto-rows-auto grid grid-row-3 absolute right-[10%] top-[20%] h-3/5 w-1/4 bg-black bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]">
                    <div className='flex p-4 '>
                        <div className='p-2 rounded-lg   bg-slate-600 bg-opacity-75 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border  border-solid border-[rgba(_255,255,255,0.18_)]'>
                            <motion.div className="mx-auto my-0 overflow-hidden whitespace-nowrap" variants={variants} >
                                <motion.div className="text-white " variants={variants}  >
                                    Lorem ipsum dolor sit amet, cons
                                </motion.div>
                            </motion.div>
                            <motion.div className="text-white " >
                                ectetur adipiscing elit. Etiam risus sapien, semper eget neque eu, aliquet eleifend lectus.
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
