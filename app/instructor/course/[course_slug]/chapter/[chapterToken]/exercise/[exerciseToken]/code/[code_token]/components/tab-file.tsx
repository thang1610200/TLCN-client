import { Code, FileCode } from "@/app/types";
import { KeyedMutator } from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { EditorForm } from "./editor-form";

interface TabFileProps {
    initialData: Code;
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
    fileType: 'SOLUTION' | 'EVALUATION'
}

export const TabFile: React.FC<TabFileProps> = ({
    initialData,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token,
    fileType
}) => {
    return (
        <div>
            {
                fileType === 'SOLUTION' && (
                    <Tabs defaultValue={initialData.file[0]?.id}>
                        <TabsList>
                            {
                                initialData.file?.map((item, index) => (
                                    <TabsTrigger key={index} value={item.id}>{`${item.fileName}.${item.mime}`}</TabsTrigger>
                                ))
                            }
                        </TabsList>
                        {
                            initialData.file?.map((item, index) => (
                                <TabsContent key={index} value={item.id}>
                                    <EditorForm
                                        chapter_token={chapter_token}
                                        course_slug={course_slug}
                                        code_token={code_token}
                                        exercise_token={exercise_token}
                                        mutate={mutate}
                                        language={item.language}
                                        defaultValue={item.default_content}
                                        fileId={item.id}
                                        fileType={fileType}
                                    />
                                </TabsContent>
                            ))
                        }
                    </Tabs>
                )
            }

            {
                fileType === 'EVALUATION' && (
                    <Tabs defaultValue={initialData.fileTest.id}>
                        <TabsList>
                            <TabsTrigger value={initialData.fileTest.id}>{`${initialData.fileTest.fileName}.${initialData.fileTest.mime}`}</TabsTrigger>
                        </TabsList>
                        <TabsContent value={initialData.fileTest.id}>
                            <EditorForm
                                chapter_token={chapter_token}
                                course_slug={course_slug}
                                code_token={code_token}
                                exercise_token={exercise_token}
                                mutate={mutate}
                                language={initialData.fileTest.language}
                                defaultValue={initialData.fileTest.content}
                                fileId={initialData.fileTest.id}
                                fileType={fileType}
                            />
                        </TabsContent>
                    </Tabs>
                )
            }
        </div>
    );
}