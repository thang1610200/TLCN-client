'use client';

import { Button } from '@/components/ui/button';
import LoadingModal from '@/components/modal/loading-modal';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { map, flatten, findIndex } from 'lodash';
import { OverviewNavigation } from '@/app/(course)/component/overview-navigation';
import CourseSidebar from '@/app/(course)/component/course-sidebar';
import useLessonDetailUser from '@/app/hook/useLessonDetailUser';
import { useSession } from 'next-auth/react';
import CourseProgressButton from '@/app/(course)/component/course-progress-button';
import { Banner } from '@/components/banner';
import useCourseDetailAuth from '@/app/hook/useCourseDetailAuth';
import { useCallback, useMemo } from 'react';
import VideoReview from '@/app/(course)/component/video-review';
import QuizModal from '@/app/(course)/component/quiz';
import CodeModal from '@/app/(course)/component/code';
import BentoGridCoursePage from './lesson-bento-grid';
import { BentoGrid } from '@/components/ui/bento-grid';

export default function CourseAccessDetail({ params }: { params: { slug: string; token: string } }) {
    // const session = useSession();
    // const router = useRouter();
    // if(!session.data?.backendTokens.accessToken) {
	// 	return router.push('/login')
	// }

    return (
        <div className='w-screen h-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]'>
            <BentoGridCoursePage params={params} />
        </div>
    );
};

const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

const SkeletonGird = () => (
    <BentoGrid className="w-screen h-screen mx-auto duration-1000 md:auto-rows-min animate-pulse ">
        <div className="w-full h-[80vh] col-span-3 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
        <div className="md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
        <div className="md:col-span-1 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
    </BentoGrid>
)