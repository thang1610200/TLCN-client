'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import Loader from '@/components/loader';
import { Textarea } from '@/components/ui/textarea';
import useAllCoursePublish from '@/app/hook/useAllCoursePublish';
import { course } from '@/types';
// import LessonList from '../component/lesson-list';
import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import OverviewNavigation from "../component/overview-navigation"

export const metadata: Metadata = {
    title: 'Music App',
    description: 'Example music app using the components.',
};

export default function DetailChapter({ params }: { params: { slug: string } }) {
    const { data, isLoading, error } = useCourseDetailHome(params.slug);

    return (
        <>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-3 grid-rows-2">
                            <div className="col-span-2 p-4 aspect-video">
                                <div className="w-full h-full mb-4 border-2 rounded-lg"></div>
                                <div className='flex justify-between'>
                                    <Button>Previous Lesson</Button>
                                    <Button>Next Lesson</Button>
                                </div>
                            </div>
                            <div className="row-span-2 p-4 pt-4 ml-8 border-2">
                                <h1 className=" text-3xl font-Poppins font-[600] dark:text-white bg-purple-200 rounded-lg p-2 text-violet-700 ">
                                    Course Overview
                                </h1>
                                <div className="w-full">
                                    {/* <LessonList data={data?.chapters} /> */}
                                </div>
                            </div>
                            <div className='h-full col-span-2 p-4'>
                                <OverviewNavigation/>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
