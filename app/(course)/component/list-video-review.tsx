import React, { Fragment, useEffect, useState } from 'react'
import VideoReview from './video-review'
import { Dialog, Transition } from '@headlessui/react'
import { Content, Course } from '@/app/types';
import { filter, find, flatten, map } from 'lodash';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';


interface ListVideoReviewProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    lessonReview: Content;
    data: Course
}


export default function ListVideoReview({ isOpen, setIsOpen, lessonReview, data }: ListVideoReviewProps) {
    const course_content = flatten(map(data?.chapters, 'contents'));
    const listVideoReview = flatten(map(filter(course_content, function (o) {
        if (o.type === "LESSON" && o.lesson?.isPreview) return o;
    }), 'lesson'));
    const [lesson, setLesson] = useState(lessonReview.lesson)
    return (
        <div>
            <Transition appear show={isOpen} as={Fragment} >
                <Dialog as="div" className="relative z-10" onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen overflow-y-auto">
                        <div className="flex items-center justify-center w-full h-full p-4 text-center max-w-7xl max-h-5xl">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="flex flex-col w-full h-full p-8 space-y-6 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
                                    <Dialog.Title
                                        as="h1"
                                        className="text-3xl font-medium leading-6 text-slate-950"
                                    >
                                        {data.title}
                                    </Dialog.Title>
                                    <div className="flex flex-row items-center justify-center w-full h-full rounded-lg">
                                        <div className='w-full h-full rounded-2xl'>
                                            <VideoReview
                                                data={lesson}
                                            />
                                            <div className="p-4 space-y-2">
                                                <h3 className='text-3xl font-bold text-slate-950'>{lesson?.title}</h3>
                                                <p className='text-xl text-slate-800 '>{lesson?.description}</p>
                                            </div>
                                        </div>
                                        <div className="h-full w-[40rem] rounded-lg">
                                            <div className="flex flex-col items-center justify-start w-full h-full pr-4 space-y-1 overflow-y-auto">
                                                {listVideoReview.map((item, index) => (
                                                    <div key={item.id} className={cn(lesson?.token === item.token ? "bg-emerald-500" : "", 'pl-4 flex items-center justify-center w-full space-x-2 rounded-lg max-h-32 min-h-32')}  onClick={()=>{setLesson(item)}}>
                                                        <div className="relative rounded-lg h-3/4 aspect-video">
                                                            <Image src={item.thumbnail} fill={true} className='object-contain rounded-lg ' alt="List image preview"></Image>
                                                        </div>
                                                        <div className="flex flex-col items-start justify-start ">
                                                            <div className="text-lg font-semibold line-clamp-1 text-slate-950">{item.title}</div>
                                                            <div className="line-clamp-2 text-slate-800">{item.description}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-0 right-0 pr-5 ">
                                        <Button autoFocus type='button' variant="ghost" onClick={() => { setIsOpen(false) }} className=''>
                                            <X color='#020617' size={32}/>
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
