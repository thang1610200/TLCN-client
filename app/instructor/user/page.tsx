"use client";

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useUserOfCourse, useAllCourse } from '@/app/hook/useAllCourse';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { uniqBy } from 'lodash';

export default function UserProgressPage() {
    const session = useSession()
    const router = useRouter();
    const { data: course = [], isLoading, error } = useAllCourse(session.data?.user.email, session.data?.backendTokens.accessToken);
    const { data, isLoadingUser, errorUser} = useUserOfCourse(session.data?.user.email, session.data?.backendTokens.accessToken, course[0]?.slug)

    const user = useMemo(() => {
        if(!data?.userProgress) return [];
        return uniqBy(data?.userProgress, 'userId');
    },[data?.userProgress])

    const onSelectCourse = (slug: string) => {
        console.log(slug);
        return "dsd";
    };

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
                        columns={columns}
                        data={user}
                        course={course}
                        courseId={data?.id}
                        onSelectCourse={onSelectCourse}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
}
