'use client';

import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import LoadingModal from '@/components/modal/loading-modal';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DetailCourse = ({ params }: { params: { slug: string } }) => {
    const router = useRouter();
    const { data, isLoading, error } = useCourseDetailHome(params.slug);

    if (isLoading) {
        return <LoadingModal />;
    }

    if (error) {
        return router.back();
    }

    return (
        <div>
            <div className="w-[90%] 800px:w-[90%] m-auto py-5">
                <div className="w-full flex 800px:flex-row">
                    <div className="w-full 800px:w-[65%] 800px:pr-5">
                        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                            {data?.title}
                        </h1>
                        <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center">
                                <div className="flex 800px:mt-0 800px:ml-0 ">
                                    Create by{' '}
                                    <span className="ml-2 font-semibold">
                                        {data?.owner.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                            What you will learn from this course?
                        </h1>
                        <div>
                            {data?.learning_outcome.map((item, index) => (
                                <div
                                    key={index}
                                    className="w-full flex 800px:items-center py-2"
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
                        <br />
                        <br />
                        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                            What are the prerequisites for starting this course?
                        </h1>
                        {data?.requirement.map((item, index) => (
                            <div
                                key={index}
                                className="w-full flex 800px:items-center py-2"
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
                        <br />
                        <br />
                        <div>
                            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                Course Overview
                            </h1>
                            
                        </div>
                        <br />
                        <br />
                        <div className="w-full">
                            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                Course Details
                            </h1>
                            <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                                {data?.description}
                            </p>
                        </div>
                        <br />
                        <br />
                        {/* <div className="w-full">
                            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
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
                                    <div className="800px:block pl-2">
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
                        </div> */}
                    </div>
                    <div className="w-full 800px:w-[35%] relative pl-20">
                        <div className="sticky top-[100px] left-0 z-50 w-full">
                            {/* Video Course */}
                            <div
                                style={{
                                    paddingTop: '56.25%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <iframe
                                    src="https://www.youtube.com/watch?v=w1fkGHGZs1Q&t=23479s"
                                    style={{
                                        position: 'absolute',
                                        border: 0,
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                ></iframe>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href="/"
                                    className="bg-red-500 my-3 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                                >
                                    Enter to course
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailCourse;
