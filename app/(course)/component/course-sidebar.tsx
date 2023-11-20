"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlaySquare } from "lucide-react";
import { sumBy } from 'lodash';
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@/app/types";

interface CourseSidebarProp {
    initdata?: Course
    course_slug: string;
    lesson_token: string;
}

const CourseSidebar: React.FC<CourseSidebarProp> = ({
    initdata,
    course_slug,
    lesson_token
}) => {
    const router = useRouter();

    function convertTime(second: number): string {
        let hour: number = Math.floor(second / 3600);

        if (hour > 0) {
            let minute: number = Math.floor((second % 3600) / 60);

            return `${hour} hour ${minute} minute`;
        } else {
            let minute: number = Math.floor(second / 60);

            return `${minute} minute`;
        }
    }

    return (
        <div className="row-span-2 p-4 pt-4 mt-4 ml-8 border-2 rounded-lg">
        <h1 className=" text-3xl font-Poppins font-[600] dark:text-white bg-purple-200 rounded-lg p-2 text-violet-700 ">
            Course Overview
        </h1>
        <div className="w-full">
            <div className="w-full mt-[20px] mx-auto bg-white rounded-2xl">
                {initdata?.chapters.map((item, index) => {
                    const sumTimeChapter = sumBy(
                        item.lessons,
                        'duration'
                    );

                    return (
                        <Disclosure
                            key={index}
                            as="div"
                            className="mb-3"
                        >
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="w-full px-4 py-2 text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                        <div className="flex items-center justify-between font-medium">
                                            <h2 className="text-[22px] text-black dark:text-white">
                                                {
                                                    item.title
                                                }
                                            </h2>
                                            <ChevronUpIcon
                                                size={
                                                    25
                                                }
                                                className={`${open
                                                    ? 'rotate-180 transform'
                                                    : ''
                                                    } text-purple-500`}
                                            />
                                        </div>
                                        <h5 className="text-black">
                                            {
                                                item
                                                    .lessons
                                                    .length
                                            }{' '}
                                            lesson •{' '}
                                            {convertTime(
                                                sumTimeChapter
                                            )}{' '}
                                        </h5>
                                    </Disclosure.Button>
                                    {item.lessons.map(
                                        (
                                            lesson,
                                            lesson_index
                                        ) => (
                                            <Disclosure.Panel
                                                onClick={() =>
                                                   router.push(`/course/${course_slug}/lesson/${lesson.token}`)     
                                                }
                                                key={
                                                    lesson_index
                                                }
                                                className={cn(
                                                    'w-full px-4 pt-4 pb-2 cursor-pointer transition-all rounded-lg',
                                                    (lesson_token === lesson.token &&
                                                    'bg-slate-300')
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
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
                                                        {convertTime(
                                                            lesson.duration
                                                        )}
                                                    </h5>
                                                </div>
                                            </Disclosure.Panel>
                                        )
                                    )}
                                </>
                            )}
                        </Disclosure>
                    );
                })}
            </div>
        </div>
    </div>
    );
}

export default CourseSidebar;