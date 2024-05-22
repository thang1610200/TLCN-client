'use client';

import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Actions } from '../component/action';
import useCourseDetail from '@/app/hook/useCourseDetail';
import LoadingModal from '@/components/modal/loading-modal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard, ListChecks } from 'lucide-react';
import { TitleForm } from '../component/title-form';
import { DescriptionForm } from '../component/description-form';
import { LearningOutcomeForm } from '../component/learning-outcome-form';
import { ImageForm } from '../component/image-form';
import { CategoryForm } from '../component/category-form';
import { ChaptersForm } from '../component/chapter-form';
import { RequirementForm } from '../component/requirement-form';
import { filter } from 'lodash';
import { useTopic } from '@/app/hook/use-topic';
import { LevelForm } from '../component/level-form';
import { useAllLevel } from '@/app/hook/use-course';

const CourseDetail = ({ params }: { params: { course_slug: string } }) => {
    const session = useSession();
    const router = useRouter();
    const { data, isLoading, error, mutate, isValidating } = useCourseDetail(
        params.course_slug,
        session.data?.user.email,
        session.data?.backendTokens.accessToken
    );

    const { data: topics = [] } = useTopic(
        session.data?.backendTokens.accessToken
    );

    const { data: levels = [], isLoadingLevel } = useAllLevel(session.data?.backendTokens.accessToken);

    const chapters = filter(data?.chapters,{isPublished: true});

    const requiredFields = [
        data?.title,
        data?.description,
        data?.picture,
        data?.learning_outcome.length > 0,
        data?.requirement.length > 0,
        data?.topic_id,
        chapters?.length > 0,
        data?.level_id
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    if (isLoading || isValidating || isLoadingLevel) {
        return <LoadingModal />;
    }

    if (error) {
        return router.push("/instructor/course");
    }

    return (
        <>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <div className="flex items-center bg-black space-between"></div>
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Thông tin khóa học
                            </h1>
                            <span className="text-sm text-slate-700">
                                Thông tin đã hoàn thành {completionText}
                            </span>
                        </div>
                        <Actions
                            disabled={!isComplete}
                            slug={params.course_slug}
                            isPublished={data?.isPublished}
                            mutate={mutate}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Chỉnh sửa khóa học
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
                            <RequirementForm
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
                                    <h2 className="text-xl">Các chương trong khóa học</h2>
                                </div>
                                <ChaptersForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    mutate={mutate}
                                />
                                <LevelForm
                                    initialData={data}
                                    course_slug={data?.slug}
                                    options={levels.map((level) => ({
                                        label: level.name,
                                        value: level.id,
                                    }))}
                                    mutate={mutate}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default CourseDetail;
