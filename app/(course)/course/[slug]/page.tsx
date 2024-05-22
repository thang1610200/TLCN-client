'use client';

import useCourseDetailHome from '@/app/hook/useCourseDetailHome';
import LoadingModal from '@/components/modal/loading-modal';
import { CheckIcon, ChevronUpIcon, PlaySquare, ClipboardPaste, Lightbulb, Code } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import VideoReview from '../../component/video-review';
import { cn } from '@/lib/utils';
import { map, flatten, sumBy, find, filter } from 'lodash';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import BentoGridIntroducePage from './introduce-bento-grid';
import { BentoGrid } from '@/components/ui/bento-grid';

export default function DetailCourse({ params }: { params: { slug: string } }) {


    const { data, isLoading, error, isValidating } = useCourseDetailHome(params.slug);
    const router = useRouter();

    if (isLoading || isValidating) {
        return (
            <SkeletonGird/>
        )
    }

    if (error) {
        return router.push("/");
    }
    if (data) {
        return (
            <div className='w-screen h-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]'>
                <BentoGridIntroducePage data={data} params={params} />
            </div>
        );
    }
};


const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

const SkeletonGird = () => (
    <BentoGrid className="w-screen h-screen mx-auto duration-[1500] md:auto-rows-min animate-pulse">
        <div className="w-full h-[30rem] md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
        <div className="md:col-span-1 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
        <div className="md:col-span-1 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4">
            <Skeleton />
        </div>
        <div className="md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-slate-200 border  justify-between flex flex-col space-y-4 ">
            <Skeleton />
        </div>
    </BentoGrid>
)