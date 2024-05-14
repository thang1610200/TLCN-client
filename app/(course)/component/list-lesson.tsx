import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import { cn } from '@/lib/utils';
import { Disclosure } from '@headlessui/react';
import { find, sumBy,flatten,map,filter } from 'lodash';
import { ChevronUpIcon, Code, Lightbulb, PlaySquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useCallback, useState } from 'react'


export default function ListLesson() {
    const { data, isLoading, error, isValidating } = useCourseDetailHome("master-next-js-13-2023-for-busy-developers");
    
    const [tokenLesson, setTokenLesson] = useState<string>('');


    const course_content = flatten(map(data?.chapters, 'contents'));

    const lesson = flatten(map(filter(course_content, function(o) {
        if(o.type === "LESSON") return o;
    }),'lesson'));

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
        <div className="w-full h-full overflow-auto">
            {data?.chapters.map((item, index) => {
                const sumTimeChapter = sumBy(item.contents, function (o) {
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
                                            className={`${open
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
                                                if (content.type === 'LESSON' && content.lesson?.isPreview) {
                                                    setTokenLesson(
                                                        content.lesson?.token || ""
                                                    )
                                                }
                                            }, [tokenLesson, content])
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
                                                            content.exercise?.type === 'QUIZZ' ? (
                                                                <Lightbulb
                                                                    size={
                                                                        25
                                                                    }
                                                                    className="mr-2"
                                                                    color="#1cdada"
                                                                />
                                                            ) : (
                                                                <Code
                                                                    size={
                                                                        25
                                                                    }
                                                                    className="mr-2"
                                                                    color="#1cdada"
                                                                />
                                                            )
                                                        )
                                                    }
                                                    <h1 className="text-[18px] inline-block break-words text-black">
                                                        {
                                                            content.lesson?.title || content.exercise?.title
                                                        }
                                                    </h1>
                                                </div>
                                                <div className="flex items-center pr-2 ml-auto gap-x-2">
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
    )
}
