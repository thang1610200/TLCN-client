'use client';

import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import { Button } from '@/components/ui/button';
import LoadingModal from '@/components/modal/loading-modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import VideoReview from '../../component/video-review';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, PlaySquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { map, flatten, findIndex } from 'lodash';
import { OverviewNavigation } from '../../component/overview-navigation';

const CourseAccessDetail = ({ params }: { params: { slug: string } }) => {
    const { data, isLoading, error } = useCourseDetailHome(params.slug);
    const [tokenLesson, setTokenLesson] = useState<string>('');
    const router = useRouter();

    if (isLoading) {
        return <LoadingModal />;
    }

    if (error) {
        return router.back();
    }

    const lesson = flatten(map(data?.chapters, 'lessons'));

    function onNextLesson() {
        let index =
            findIndex(lesson, { token: tokenLesson }) === -1
                ? 0
                : findIndex(lesson, { token: tokenLesson });

        index = index === lesson.length - 1 ? 0 : index + 1;

        setTokenLesson(lesson[index].token);
    }

    function onPrevLesson() {
        let index =
            findIndex(lesson, { token: tokenLesson }) === -1
                ? 0
                : findIndex(lesson, { token: tokenLesson });

        index = index === 0 ? lesson.length - 1 : index - 1;

        setTokenLesson(lesson[index].token);
    }

    return (
        <div>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-3 grid-rows-2 mt-4">
                            <div className="col-span-2 p-4 aspect-video">
                                <div className="w-full h-full mb-4 border-2 rounded-lg">
                                    <VideoReview
                                        data={lesson}
                                        tokenLesson={
                                            tokenLesson === ''
                                                ? data?.chapters[0].lessons[0]
                                                      .token
                                                : tokenLesson
                                        }
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <Button onClick={onPrevLesson}>
                                        <ArrowLeft className="mr-2" /> Prev
                                        Lesson
                                    </Button>
                                    <Button onClick={onNextLesson}>
                                        Next Lesson{' '}
                                        <ArrowRight className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                            <div className="row-span-2 p-4 pt-4 ml-8 mt-4 border-2 rounded-lg">
                                <h1 className=" text-3xl font-Poppins font-[600] dark:text-white bg-purple-200 rounded-lg p-2 text-violet-700 ">
                                    Course Overview
                                </h1>
                                <div className="w-full">
                                    <div className="w-full mt-[20px] mx-auto bg-white rounded-2xl">
                                        {data?.chapters.map((item, index) => (
                                            <Disclosure
                                                key={index}
                                                as="div"
                                                className="mb-3"
                                            >
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
                                                                        open
                                                                            ? 'rotate-180 transform'
                                                                            : ''
                                                                    } text-purple-500`}
                                                                />
                                                            </div>
                                                            <h5 className="text-black">
                                                                {
                                                                    item.lessons
                                                                        .length
                                                                }{' '}
                                                                lesson • 18
                                                                minutes
                                                            </h5>
                                                        </Disclosure.Button>
                                                        {item.lessons.map(
                                                            (
                                                                lesson,
                                                                lesson_index
                                                            ) => (
                                                                <Disclosure.Panel
                                                                    onClick={() =>
                                                                        setTokenLesson(
                                                                            lesson.token
                                                                        )
                                                                    }
                                                                    key={
                                                                        lesson_index
                                                                    }
                                                                    className={cn(
                                                                        'w-full px-4 pt-4 pb-2 cursor-pointer transition-all rounded-lg',
                                                                        (lesson.token ===
                                                                            tokenLesson ||
                                                                            (tokenLesson ===
                                                                                '' &&
                                                                                lesson.position ===
                                                                                    1 &&
                                                                                item.position ===
                                                                                    1)) &&
                                                                            'bg-slate-300'
                                                                    )}
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <div className="flex items-start">
                                                                            <PlaySquare
                                                                                size={
                                                                                    25
                                                                                }
                                                                                className="mr-2"
                                                                                color="#1cdada"
                                                                            />
                                                                            <h1 className="text-[18px] inline-block break-words text-black">
                                                                                {
                                                                                    lesson.title
                                                                                }
                                                                            </h1>
                                                                        </div>
                                                                        <h5 className="text-black">
                                                                            18
                                                                            minutes
                                                                        </h5>
                                                                    </div>
                                                                </Disclosure.Panel>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </Disclosure>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="h-full col-span-2 p-4">
                                <OverviewNavigation
                                    data={lesson}
                                    tokenLesson={
                                        tokenLesson === ''
                                            ? data?.chapters[0].lessons[0].token
                                            : tokenLesson
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAccessDetail;
