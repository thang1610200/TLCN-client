"use client";

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { useSession } from 'next-auth/react';
import { useUserOfInstructor, useAllCourse } from '@/app/hook/useAllCourse';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';

export default function UserProgressPage() {
    const session = useSession()
    const router = useRouter();
    const { data: course = [], isLoading, error } = useAllCourse(session.data?.user.email, session.data?.backendTokens.accessToken);
    const { data = [], isLoadingUser, errorUser} = useUserOfInstructor(session.data?.user.email, session.data?.backendTokens.accessToken);

    if(isLoading || isLoadingUser){
        return (
            <LoadingModal />
        );
    }

    if(error || errorUser){
        console.log(errorUser)
        //router.back();
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
                        data={data}
                        course={course}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
}
