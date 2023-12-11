'use client';

import React from 'react';
import useAllCoursePublish from '../../hook/useAllCoursePublish';
import LoadingModal from '@/components/modal/loading-modal';
import { Categories } from '../components/categories';
import { CoursesList } from '@/components/courses-list';
import useAllTopicHome from '../../hook/useAllTopicHome';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Sparkle, Circle, Square } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
    const searchParams = useSearchParams();
    const currentTopic = searchParams.get('topic') || undefined;
    const currentTitle = searchParams.get('title') || undefined;

    const { data, isLoading } = useAllCoursePublish(currentTitle, currentTopic);
    const { data: topic = [] } = useAllTopicHome();

    if (isLoading) {
        return <LoadingModal />;
    }
    return (
        <>
            <div className="w-full h-full px-32 ">
                <div className="container grid h-full grid-cols-2 py-4 space-x-20">
                    <div className="container grid-rows-3 mt-10 space-y-4">
                        <div className="text-5xl font-bold ">Leadership and learning are indispensable to each other</div>
                        <div className="gap-4 space-y-4">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <div className="flex items-center justify-center gap-4 rounded-lg">
                                <Button>Join Course</Button>
                                <Button>Connect to mentor</Button>
                            </div>
                        </div>
                        <div className="gap-4 space-y-4">
                            <Separator className='h-1.5 rounded-lg' />
                            <div className="grid grid-cols-3 grid-rows-2 ">
                                <p>Best course for you</p>
                                <div className="grid col-span-2 row-span-2 gap-4 ">
                                    <div className="grid grid-cols-2 gap-4 ">
                                        <div className="flex items-center justify-center gap-4">
                                            <Button className='w-32'>UI/UX Design</Button>
                                            <Star color='#ffe871' />
                                        </div>
                                        <div className="flex items-center justify-center gap-4">
                                            <Button className='w-32'>Graphic Design</Button>
                                            <Sparkle color='#96a4f9' />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 ">
                                        <div className="flex items-center justify-center gap-4">
                                            <Button className='w-32'>Development</Button>
                                            <Circle color='#f58af7' />
                                        </div>
                                        <div className="flex items-center justify-center gap-4">
                                            <Button className='w-32'>Development</Button>
                                            <Square color='#a0f78a' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container grid-rows-2 p-4 space-y-4">
                        <Image
                            src="https://picsum.photos/600/200"
                            alt="description image"
                            width={600}
                            height={200}
                            className="object-cover w-auto h-auto transition-all rounded-lg hover:scale-105 aspect-video"
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 ">
                                <Image
                                    src="https://picsum.photos/500/325"
                                    alt="description image"
                                    width={500}
                                    height={325}
                                    className="object-cover w-auto h-auto transition-all rounded-lg hover:scale-105 "
                                />
                            </div>
                            <div className="col-span-1 ">
                                <Image
                                    src="https://picsum.photos/250/325"
                                    alt="description image"
                                    width={250}
                                    height={325}
                                    className="object-cover w-auto h-auto transition-all rounded-lg hover:scale-105 "
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}
