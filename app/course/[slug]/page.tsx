'use client';

import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import LoadingModal from '@/components/modal/loading-modal';
import { CheckIcon, ChevronUpIcon, PlaySquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import VideoReview from '../component/video-review';
import { cn } from '@/lib/utils';

const DetailCourse = ({ params }: { params: { slug: string } }) => {
    const { data, isLoading, error } = useCourseDetailHome(params.slug);
    const [tokenLesson, setTokenLesson] = useState<string>("");

    const router = useRouter();

    if (isLoading) {
        return <LoadingModal />;
    }

    if (error) {
        return router.back();
    }

    return (
        <div>
            <div className="py-5 m-auto">
                <div className="flex w-full md:flex-row">
                    <div className="w-full">
                        <div className="grid grid-cols-2 grid-rows-2">
                            <div className="relative flex flex-col p-4">
                                <div className="p-2 bg-purple-200 rounded-lg text-violet-700">
                                    <h1 className="text-3xl font-Poppins font-[600] dark:text-white ">
                                        {data?.title}
                                    </h1>
                                    <div className="flex items-center justify-between ">
                                        <div className="flex items-center">
                                            <div className="flex 800px:mt-0 800px:ml-0 ">
                                                Create by{' '}
                                                <span className="ml-2 font-semibold">
                                                    {data?.owner.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 mt-3 border-2">
                                    <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                        What you will learn from this course?
                                    </h1>
                                    {data?.learning_outcome.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex w-full py-2 800px:items-center"
                                            >
                                                <div className="w-[15px] mr-1">
                                                    <CheckIcon
                                                        size={20}
                                                        className="text-black dark:text-white"
                                                    />
                                                </div>
                                                <p className="pl-2 text-black dark:text-white">
                                                    {item}
                                                </p>
                                            </div>
                                        )
                                    )}
                                    <br />
                                    <br />
                                    <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                        What are the prerequisites for starting
                                        this course?
                                    </h1>
                                    {data?.requirement.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex w-full py-2 800px:items-center"
                                        >
                                            <div className="w-[15px] mr-1">
                                                <CheckIcon
                                                    size={20}
                                                    className="text-black dark:text-white"
                                                />
                                            </div>
                                            <p className="pl-2 text-black dark:text-white">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 ml-8">
                                <div className="w-full 800px:w-[35%] relative">
                                    <div className="sticky top-[100px] left-0 z-50 w-full">
                                        {/* Video Course */}
                                        <VideoReview data={data?.chapters} tokenLesson={tokenLesson === "" ? data?.chapters[0].lessons[0].token : tokenLesson} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div>
                                    <h1 className="text-3xl font-Poppins font-[600] dark:text-white bg-purple-200 rounded-lg p-2 text-violet-700 ">
                                        Course Description
                                    </h1>
                                </div>
                                <div className="w-full">
                                    <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                                        {data?.description}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4 ml-8">
                                <h1 className=" text-3xl font-Poppins font-[600] dark:text-white bg-purple-200 rounded-lg p-2 text-violet-700 ">
                                    Course Overview
                                </h1>
                                <div className="w-full">
                                    <div className="w-full mt-[20px] mx-auto bg-white rounded-2xl">
                                        {data?.chapters.map((item, index) => (
                                            <Disclosure key={index} as="div" className="mb-3">
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
                                                                    onClick={() => setTokenLesson(lesson.token)}
                                                                    key={
                                                                        lesson_index
                                                                    }
                                                                    className={cn("w-full px-4 pt-4 pb-2 cursor-pointer transition-all rounded-lg",(lesson.token === tokenLesson || (tokenLesson === "" && lesson.position === 1)) && "bg-slate-300")}
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
                            {/* <div className="w-full col-span-1 p-4 ">
                                <h1 className="text-[25px] font-Poppins font-[600]  dark:text-white  bg-purple-200 rounded-lg p-2 text-violet-700">
                                    Course Reviews
                                </h1>
                                <br />
                                <div className="w-full pb-4">
                                    <div className="flex">
                                        <div className="w-[50px] h-[50px]">
                                            <img
                                                className="w-[50px] h-[50px] rounded-full object-cover"
                                                src="https://tlcn-upload.s3.ap-southeast-1.amazonaws.com/1698824755428_z4829239748115_73034f65f61b41e9a89f7572ba1c12a5.jpg"
                                            />
                                        </div>
                                        <div className="pl-2 800px:block">
                                            <div className="flex items-center">
                                                <h5 className="text-[18px] pr-2 text-black dark:text-white font-bold">
                                                    Manash Roy
                                                </h5>
                                            </div>
                                            <p className="text-black dark:text-white">
                                                Hello This is the best course
                                                ever I have seen
                                            </p>
                                            <small className="text-[#000000d1] dark:text-[#ffffff83]">
                                                5 days ago •
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailCourse;
