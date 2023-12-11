"use client";

import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Timer, Book, GraduationCap  } from 'lucide-react';
import { Course } from '@/app/types';

interface InfoCourseProps {
    course?: Course
}

export default function InfoCourse({
    course  
}: InfoCourseProps) {
    return (
        <div className='w-1/3 max-w-xs grid-rows-3 border-2 rounded-lg h-1/3 bg-slate-100 max-h-xs'>
            <div className="flex items-center justify-center w-full col-span-2 overflow-hidden rounded-lg h-1/3" >
                <Image
                    src={course?.picture!}
                    alt="description image"
                    width={300}
                    height={100}
                    className="object-cover w-auto h-auto transition-all hover:scale-105 "
                />
            </div>
            <div className="grid w-full grid-rows-5 px-4 py-2 space-y-2 h-2/3">
                <div className="flex items-center justify-between row-span-1">
                    <Button variant={"outline"}>{course?.title}</Button>
                </div>
                <div className="items-center justify-center row-span-3 space-y-2">
                    <p className='text-left line-clamp-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna al.</p>
                    <p className='text-xs'>By Henry Daw</p>
                </div>
                <div className="flex items-center justify-between row-span-1 ">
                    <div className="flex items-center justify-center space-x-1">
                        <Timer/>
                        <p>60m</p>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                        <Book/>
                        <p>15</p>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                        <GraduationCap/>
                        <p>Intemideate</p>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
