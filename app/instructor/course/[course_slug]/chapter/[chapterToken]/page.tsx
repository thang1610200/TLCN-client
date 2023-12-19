"use client";

import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs";
import { ChapterActions } from "./components/chapter-action";
import useChapterDetail from "@/app/hook/useChapterDetail";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LoadingModal from "@/components/modal/loading-modal";
import { IconBadge } from "@/components/icon-badge";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { ChapterTitleForm } from "./components/chapter-title-form";
import { ChapterDescriptionForm } from "./components/chapter-description-form";
import { LessonsForm } from "./components/lesson-form";
import { filter } from "lodash";
import useCourseDetail from "@/app/hook/useCourseDetail";


const ChapterToken = ({
    params
}: {
    params: {course_slug: string, chapterToken: string}
}) => {
    const session = useSession();
    const { data, isLoading, error, mutate } = useChapterDetail(params.course_slug, session.data?.user.email, session.data?.backendTokens.accessToken, params.chapterToken);
    const { data: course = {}, isLoading: courseLoading = false, error: courseError } = useCourseDetail(
        params.course_slug,
        session.data?.user.email,
        session.data?.backendTokens.accessToken
    );

    const lesson = filter(data?.lessons,{
        isPublished: true
    });

    const requiredFields = [
        data?.title,
        data?.description,
        lesson?.length > 0
    ];
    
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    
    const completionText = `(${completedFields}/${totalFields})`;
    
    const isComplete = requiredFields.every(Boolean);

    if (isLoading || courseLoading) {
        return <LoadingModal />;
    }

    if(error || courseError){
        return redirect('/');
    }

    return (
    <>
        <Tabs defaultValue="music" className="h-full space-y-6">
            <div className="flex items-center bg-black space-between">
            </div>
            <a
                href={`/instructor/course/${params.course_slug}`}
                className="flex items-center mb-6 text-sm transition hover:opacity-75"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Trở về trang thông tin khóa học
            </a>
            <TabsContent
                value="music"
                className="p-0 border-none outline-none"
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Thông tin chương
                        </h1>
                        <span className="text-sm text-slate-700">
                        Thông tin đã hoàn thành {completionText}
                        </span>
                    </div>
                    <ChapterActions
                        coursePublished={course?.isPublished}
                        disabled={!isComplete}
                        course_slug={params.course_slug}
                        chapter_token={params.chapterToken}
                        isPublished={data?.isPublished}
                        mutate={mutate}
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Chỉnh sửa chương
                            </h2>
                        </div>
                        <ChapterTitleForm
                            initialData={data}
                            course_slug={params.course_slug}
                            chapter_token={params.chapterToken}
                            mutate={mutate}
                        />
                        <ChapterDescriptionForm
                            initialData={data}
                            course_slug={params.course_slug}
                            chapter_token={params.chapterToken}
                            mutate={mutate}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Bài học trong chương
                                </h2>
                            </div>
                            <LessonsForm
                                coursePublished={course?.isPublished}
                                initialData={data}
                                course_slug={params.course_slug}
                                chapter_token={params.chapterToken}
                                mutate={mutate}
                            />
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </>
    );
}

export default ChapterToken;