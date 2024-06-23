'use client';

import { useCountCourseAccess } from '@/app/hook/use-course';
import ErrorModal from '@/components/error';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import qs from 'query-string';
import { useSession } from 'next-auth/react';

export function PaginationCourse() {
    const session = useSession();
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const currentTitle = searchParams.get('title') || undefined;
    const currentPage= searchParams.get('page');
    const currentTopic = searchParams.getAll('topic');
    const currentLevel = searchParams.getAll('level');
    const { data, error, isLoading } = useCountCourseAccess(
        session.data?.user.email,
        session.data?.backendTokens.accessToken,
        currentTitle,
        currentTopic,
        currentLevel
    );
    const router = useRouter();
    let pageTotal = 0;

    if (data % 6 === 0) {
        pageTotal = data / 6;
    } else {
        pageTotal = Math.floor(data / 6) + 1;
    }

    if (error) {
        return <ErrorModal status_code={500} status_name="Internal Server" />;
    }

    const onSelectPage = (page: number) => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    title: currentTitle,
                    topic: currentTopic,
                    level: currentLevel,
                    page
                },
            },
            { skipNull: true, skipEmptyString: true }
        );
        return router.push(url);
    }

    const pages = [];

    for (let i = 1; i <= pageTotal; i++) {
        pages.push(<PaginationItem key={i}>
            <PaginationLink className='cursor-pointer' onClick={() => {onSelectPage(i)}} isActive={Number(currentPage) === i || (!currentPage && i === 1)}>{i}</PaginationLink>
        </PaginationItem>);
    }

    return (
        <>
            {!isLoading && (
                <Pagination>
                    <PaginationContent>
                        {
                            (Number(currentPage) > 1 ) &&(
                                <PaginationItem>
                                    <PaginationPrevious className='cursor-pointer' onClick={() => {
                                        onSelectPage(Number(currentPage) - 1)
                                    }} />
                                </PaginationItem>
                            )
                        }
                        {
                            pages
                        }
                        {/* <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem> */}
                        {
                            ((Number(currentPage) < pageTotal) && pageTotal > 1) &&(
                                <PaginationItem>
                                    <PaginationNext className='cursor-pointer' onClick={() => {
                                        onSelectPage(Number(currentPage || 1) + 1)
                                    }} />
                                </PaginationItem>
                            )
                        }
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
}
