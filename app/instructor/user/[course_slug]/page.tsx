"use client";

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { useUserOfCourse, useAllCourse } from '@/app/hook/useAllCourse';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { DataTable } from '../components/data-table';
import { columns } from '../components/columns';

export default function UserCoursePage({
    params,
}: {
    params: { course_slug: string;};
}) {
    const session = useSession()
    const router = useRouter();
    const { data: course = [], isLoading, error } = useAllCourse(session.data?.user.email, session.data?.backendTokens.accessToken);
    const { data = [], isLoadingUser, errorUser} = useUserOfCourse(session.data?.user.email, session.data?.backendTokens.accessToken, params.course_slug);

    if(isLoading || isLoadingUser){
        return (
            <LoadingModal />
        );
    }

    if(error || errorUser){
        router.back();
    }

    return (
        <>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <DataTable
                        course_slug={params.course_slug}
                        columns={columns}
                        data={data}
                        course={course}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
}
