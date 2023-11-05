
import { Button } from "@/components/ui/button"

import { BiPlusCircle } from "react-icons/bi"

import data from "@/public/data_processing_example.json";
import Link from "next/link";

interface idProps {
    data: string
}

export default function Processing(props: idProps) {
    const id = props.data;
    return (
        <div>
            <div className="py-4 space-y-4">
                <Link href={{ pathname: 'course', query: { id: id } }}>
                    <div className="px-3">
                        <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                            Course Detail
                        </h2>
                    </div>
                </Link>
                {data.map((item, i) => (
                    <div className="px-3 py-2" key={i}>
                        <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                            {item.title}
                        </h2>
                        {item.lesson.map((item, i) => (
                            <div className="py-1 space-y-1" key={i}>
                                <Button variant="secondary" className="justify-start w-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-4 h-4 mr-2"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polygon points="10 8 16 12 10 16 10 8" />
                                    </svg>
                                    {item.title}
                                </Button>

                            </div>
                        ))}
                        <Button variant="ghost" className="justify-start w-full pt-1">
                            <BiPlusCircle className="w-4 h-4 mr-2 " />
                            Add Lesson
                        </Button>
                    </div>
                ))}




            </div>
        </div>
    )
}