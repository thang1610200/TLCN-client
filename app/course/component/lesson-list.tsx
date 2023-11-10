'use client';

import { Chapter, Lesson } from '@/app/types';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, PlaySquare } from 'lucide-react';
import { useState } from 'react';

interface LessonListProps {
    data?: Chapter[];
}

const LessonList: React.FC<LessonListProps> = ({ data }) => {
    return (
        <div className="w-full mt-[20px] mx-auto bg-white rounded-2xl">
            {data?.map((item, index) => (
                <Disclosure key={index}>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="w-full px-4 py-2 text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                <div className="flex justify-between items-center font-medium">
                                    <h2 className="text-[22px] text-black dark:text-white">
                                        {item.title}
                                    </h2>
                                    <ChevronUpIcon
                                        size={25}
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } text-purple-500`}
                                    />
                                </div>
                                <h5 className="text-black">
                                    8 lesson • 18 minutes
                                </h5>
                            </Disclosure.Button>
                            {item.lessons.map((lesson, lesson_index) => (
                                <Disclosure.Panel key={lesson_index} className="w-full px-4 pt-4 pb-2 cursor-pointer transition-all">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-start">
                                            <PlaySquare
                                                size={25}
                                                className="mr-2"
                                                color="#1cdada"
                                            />
                                            <h1 className="text-[18px] inline-block break-words text-black">
                                                { lesson.title }
                                            </h1>
                                        </div>
                                        <h5 className="text-black">
                                            18 minutes
                                        </h5>
                                    </div>
                                </Disclosure.Panel>
                            ))}
                        </>
                    )}
                </Disclosure>
            ))}
        </div>
    );
};

export default LessonList;
