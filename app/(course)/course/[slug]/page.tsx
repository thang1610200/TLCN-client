'use client';

import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import LoadingModal from '@/components/modal/loading-modal';
import { CheckIcon, ChevronUpIcon, PlaySquare, ClipboardPaste, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import VideoReview from '../../component/video-review';
import { cn } from '@/lib/utils';
import { map, flatten, sumBy, find, filter} from 'lodash';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';

const DetailCourse = ({ params }: { params: { slug: string } }) => {
    const session = useSession();
    const [ isSubmit, setIsSubmit ] = useState(false);
    const { data, isLoading, error, isValidating } = useCourseDetailHome(params.slug);
    const [tokenLesson, setTokenLesson] = useState<string>('');

    const router = useRouter();

    if (isLoading || isValidating) {
        return <LoadingModal />;
    }

    if (error) {
        return router.push("/");
    }

    const course_content = flatten(map(data?.chapters, 'contents'));

    const lesson = flatten(map(filter(course_content, function(o) {
        if(o.type === "LESSON") return o;
    }),'lesson'));

    function onClick (){
        if(session.status === "unauthenticated"){
            return router.push('/login');
        }else{
            const toastId = toast.loading('Loading...');
            setIsSubmit(true);
            axios.post(`${BACKEND_URL}/user-progress/add-user-progress`,{
                email: session.data?.user.email,
                course_slug: params.slug
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            .then(() => {
                toast.success('Welcome',{id: toastId});
                return router.push(`/course/${params.slug}/lesson/${data?.chapters[0].contents[0].token}`);
            })
            .catch(() => {
                toast.error('Something went wrong',{id: toastId});
            })
            .finally(() => setIsSubmit(false));
        }
    }

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
        <div>
            <div className="py-5 m-auto">
                <div className="flex w-full md:flex-row">
                    <div className="w-full">
                        <div className="grid grid-cols-2">
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
                                    <div className="top-[100px] left-0 z-50 w-full">
                                        {/* Video Course */}
                                        <VideoReview
                                            data={!tokenLesson ? find(lesson,"isPreview") : find(lesson, {token: tokenLesson})}
                                        />
                                    </div>
                                </div>
                                    <button
                                        type="button"
                                        disabled={isSubmit}
                                        onClick={onClick}
                                        className="relative inline-flex items-center justify-center p-4 px-5 py-3 mt-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                                    >
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                                        <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                                        <span className="relative text-white">
                                            Enter to course
                                        </span>
                                    </button>
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
                                        {data?.chapters.map(
                                            (
                                                item,
                                                index
                                            ) => {
                                                const sumTimeChapter = sumBy(item.contents, function(o) {
                                                    return o.lesson?.duration || 0;
                                                });

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
                                                                            className={`${
                                                                                open
                                                                                    ? 'rotate-180 transform'
                                                                                    : ''
                                                                            } text-purple-500`}
                                                                        />
                                                                    </div>
                                                                    <h5 className="text-black">
                                                                        {
                                                                            item.contents.length
                                                                        }{' '}
                                                                        lesson •{' '}
                                                                        {convertTime(
                                                                            sumTimeChapter
                                                                        )}{' '}
                                                                    </h5>
                                                                </Disclosure.Button>
                                                                {item.contents.map(
                                                                    (
                                                                        content,
                                                                        content_index
                                                                    ) => (
                                                                        <Disclosure.Panel
                                                                            onClick={useCallback(() => {
                                                                                    if(content.type === 'LESSON' && content.lesson?.isPreview) {
                                                                                        setTokenLesson(
                                                                                            content.lesson?.token || ""
                                                                                        )
                                                                                    }
                                                                                },[tokenLesson, content])
                                                                            }
                                                                            key={
                                                                                content_index
                                                                            }
                                                                            className={cn(
                                                                                'w-full px-4 pt-4 pb-2 transition-all rounded-lg',
                                                                                ((content.lesson?.token ===
                                                                                    tokenLesson) ||
                                                                                    (!tokenLesson && content.lesson?.token === find(lesson, "isPreview")?.token && content.type === 'LESSON')) &&
                                                                                    'bg-slate-300',
                                                                                (content.type === 'LESSON' && content.lesson?.isPreview) && 'cursor-pointer'
                                                                            )}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-start">
                                                                                    { 
                                                                                        content.type === "LESSON" ? (
                                                                                            <PlaySquare
                                                                                                size={
                                                                                                    25
                                                                                                }
                                                                                                className="mr-2"
                                                                                                color="#1cdada"
                                                                                            />
                                                                                        ) : (
                                                                                            <Lightbulb 
                                                                                                size={
                                                                                                    25
                                                                                                }
                                                                                                className="mr-2"
                                                                                                color="#1cdada"
                                                                                            />
                                                                                        )
                                                                                    }
                                                                                    <h1 className="text-[18px] inline-block break-words text-black">
                                                                                        {
                                                                                            content.lesson?.title || content.exercise?.title
                                                                                        }
                                                                                    </h1>
                                                                                </div>
                                                                                <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                                                    {
                                                                                        content.lesson?.isPreview && (
                                                                                            <Badge className="bg-sky-700">
                                                                                                Preview
                                                                                            </Badge>
                                                                                        )
                                                                                    }
                                                                                {
                                                                                    content.type === "LESSON" && (
                                                                                        <h5 className="text-black">
                                                                                        {convertTime(
                                                                                            content.lesson?.duration || 0
                                                                                        )}
                                                                                        </h5>
                                                                                    )
                                                                                }
                                                                                </div>
                                                                            </div>
                                                                        </Disclosure.Panel>
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                    </Disclosure>
                                                );
                                            }
                                        )}
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
