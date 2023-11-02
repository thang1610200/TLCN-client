"use client";

import { Metadata } from "next"
import React, { useState } from 'react';
import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs"
import { Actions } from "../component/action";
import useCourseDetail from "@/app/hook/useCourseDetail";
import LoadingModal from "@/components/loading-modal";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "../component/title-form";
import { DescriptionForm } from "../component/description-form";
import { LearningOutcomeForm } from "../component/learning-outcome-form";
import { ImageForm } from "../component/image-form";
import { CategoryForm } from "../component/category-form";
import useTopic from "@/app/hook/useTopic";
import { ChaptersForm } from "../component/chapter-form";

export const metadata: Metadata = {
    title: "Course"
}

const CourseDetail = ({
    params
}: {
    params: { course_slug: string }
}) => {
    const session = useSession();
    const { data, isLoading, error, mutate } = useCourseDetail(params.course_slug, session.data?.user.email, session.data?.backendTokens.accessToken);
    const { data: topics = [] } = useTopic(session.data?.backendTokens.accessToken);
    const requiredFields = [
        data?.title,
        data?.description,
        data?.picture,
        data?.learning_outcome,
        data?.topic_id
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
  
    const completionText = `(${completedFields}/${totalFields})`;
  
    const isComplete = requiredFields.every(Boolean);

    if (isLoading) {
        return <LoadingModal />;
    }

    if(error){
        redirect('/home');
    }

    return (
        <>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="flex items-center bg-black space-between">

                </div>
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Course setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        <Actions
                            disabled={!isComplete}
                            slug={params.course_slug}
                            isPublished={data?.isPublished}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your course
                                </h2>
                            </div>
                                <TitleForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    mutate={mutate}
                                />
                                <DescriptionForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    mutate={mutate}
                                />
                                <LearningOutcomeForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    mutate={mutate}
                                />
                                <ImageForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    mutate={mutate}
                                />
                                <CategoryForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    options={topics.map((topic) => ({
                                                    label: topic.title,
                                                    value: topic.id,
                                            }))}
                                    mutate={mutate}
                                />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={ListChecks} />
                                    <h2 className="text-xl">
                                    Course chapters
                                    </h2>
                                </div>
                                <ChaptersForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    mutate={mutate}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default CourseDetail;