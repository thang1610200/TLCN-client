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
import { map, flatten, sumBy, find, filter} from 'lodash';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import BentoGridIntroducePage from './introduce-bento-grid';

export default function DetailCourse({ params }: { params: { slug: string } }){


    const { data, isLoading, error, isValidating } = useCourseDetailHome(params.slug);
    const router = useRouter();

    if (isLoading || isValidating) {
        return <LoadingModal />;
    }

    if (error) {
        return router.push("/");
    }
    if(data){
        return (
            <div className='w-screen h-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]'>
                <BentoGridIntroducePage data={data} params={params}/>
            </div>
        );
    }
};

