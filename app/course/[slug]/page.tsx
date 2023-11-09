'use client';

import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import LoadingModal from '@/components/modal/loading-modal';
import { CheckIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useCourseDetail from '@/app/hook/useCourseDetail';
import { Disclosure } from '@headlessui/react'

const DetailCourse = ({ params }: { params: { slug: string } }) => {
    // const { data, isLoading, error } = useCourseDetailHome(params.slug);

    // if(isLoading){
    //     return (
    //         <LoadingModal />
    //     )
    // }

    // if(error){
    //     return (
    //         <div>{ error.code }</div>
    //     );
    // }


    return (
        <div>
            <div className="w-screen py-5 m-auto ">
                <div className="flex w-full md:flex-row">
                    <div className="w-full">
                        <div className='grid grid-cols-2 grid-rows-3 '>
                            <div className='relative flex flex-col justify-center p-4 '>
                                <div className='p-2 bg-purple-200 rounded-lg text-violet-700'>
                                    <h1 className="text-3xl font-Poppins font-[600] dark:text-white ">
                                        Course Name
                                    </h1>
                                    <div className="flex items-center justify-between ">
                                        <div className="flex items-center">
                                            <div className="flex 800px:mt-0 800px:ml-0 ">
                                                Create by <span className='ml-2 font-semibold'>Instructor</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-2">
                                    <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                        What you will learn from this course?
                                    </h1>
                                    <div className="flex w-full py-2 800px:items-center">
                                        <div className="w-[15px] mr-1">
                                            <CheckIcon
                                                size={20}
                                                className="text-black dark:text-white"
                                            />
                                        </div>
                                        <p className="pl-2 text-black dark:text-white">
                                            You will be able to build a full stack LMS
                                            Platform
                                        </p>
                                    </div>
                                    <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                        What are the prerequisites for starting this course?
                                    </h1>
                                    <div className="flex w-full py-2 800px:items-center">
                                        <div className="w-[15px] mr-1">
                                            <CheckIcon
                                                size={20}
                                                className="text-black dark:text-white"
                                            />
                                        </div>
                                        <p className="pl-2 text-black dark:text-white">
                                            You will be able to build a full stack LMS
                                            Platform
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 ">
                                <div className="relative w-full ">
                                    <div className="sticky top-[100px] left-0 z-5 w-full">
                                        {/* Video Course */}
                                        <div className='pt-[50%] relative overflow-hidden'>
                                            <iframe
                                                src="https://www.youtube.com/embed/w1fkGHGZs1Q&t=23479s"
                                                className='absolute top-0 left-0 w-full h-full border-0 rounded-lg'
                                                allowFullScreen>
                                            </iframe>
                                        </div>
                                        {/* <div className="flex items-center justify-center">
                                            <Link href="/" className="px-4 py-2 my-3 font-bold text-white bg-red-500 rounded-full hover:bg-red-700">
                                                Enter to course
                                            </Link>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 ">
                                <div className=''>
                                    <h1 className=" text-3xl font-Poppins font-[600] dark:text-white bg-purple-200 rounded-lg p-2 text-violet-700 ">
                                        Course Overview
                                    </h1>
                                </div>
                                <div className="w-full">
                                    <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                        Course Details
                                    </h1>
                                    <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                                        Welcome to the MERN stack Multi Vendor Ecommerce
                                        startup series. In this series, you will learn
                                        how to build a startup project with the power of
                                        MERN and other latest technologies like tailwind
                                        CSS, socket io, redux toolkit, etc. This is a
                                        free MERN stack startup series that you will not
                                        find on youtube and Udemy right now.
                                    </p>
                                </div>
                            </div>
                            <div className="row-span-2 p-4 ">
                                <h2 className='w-full p-2 mb-8 text-3xl bg-purple-200 rounded-lg text-violet-700'>Course Roadmap</h2>
                                <div className="w-full">
                                    <div className="w-full max-w-md p-2 mx-auto bg-white rounded-2xl">
                                        <Disclosure>
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                                        <span>Chapter 1</span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 1
                                                    </Disclosure.Panel>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 2
                                                    </Disclosure.Panel>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 3
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                        <Disclosure as="div" className="mt-2">
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                                        <span>Chapter 2</span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 1
                                                    </Disclosure.Panel>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 2
                                                    </Disclosure.Panel>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 3
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                        <Disclosure as="div" className="mt-2">
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                                        <span>Chapter 3</span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 1
                                                    </Disclosure.Panel>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 2
                                                    </Disclosure.Panel>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 rounded-lg bg-purple-50">
                                                        Lesson 3
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full col-span-1 p-4 ">
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
                                                Hello This is the best course ever I
                                                have seen
                                            </p>
                                            <small className="text-[#000000d1] dark:text-[#ffffff83]">
                                                5 days ago •
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailCourse;
