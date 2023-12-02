"use client";

import { useSession } from 'next-auth/react';
import { DataCard } from './components/data-card';
import { Chart } from './components/chart';
import { useCountCourse, useCountUser } from '@/app/hook/useAnalytic';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/modal/loading-modal';
import { useAllCourse } from '@/app/hook/useAllCourse';
import { uniqBy } from 'lodash';

const AnalyticsPage = () => {
    const session = useSession();
    const router = useRouter();
    const { data: course = [], isLoading, error } = useAllCourse(session.data?.user.email, session.data?.backendTokens.accessToken);
    const { countCourse, isLoadingCourse, errorCourse } = useCountCourse(session.data?.user.email ,session.data?.backendTokens.accessToken);
    const { count, errorUser, isLoadingUser } = useCountUser(session.data?.user.email ,session.data?.backendTokens.accessToken);

    if(isLoadingCourse || isLoadingUser || isLoading){
        return (
            <LoadingModal />
        )
    }

    if(errorCourse || errorUser || error){
        return router.back();
    }

    const chart = course.map((item) => ({
        name: item.title,
        total: uniqBy(item.userProgress, 'userId').length
    }));

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Total Users"
                    value={count}
                />
                <DataCard label="Total Courses" value={countCourse} />
            </div>
            <Chart data={chart} />
        </div>
    );
};

export default AnalyticsPage;
