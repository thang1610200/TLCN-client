'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, DivideSquare, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TestCase } from '@/app/types';
import axios from 'axios';
import qs from 'query-string';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { useParams } from 'next/navigation';

export const columnsTestCase: ColumnDef<TestCase>[] = [
    {
        accessorKey: 'input',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Input
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'output',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Output
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const { id, codeId } = row.original;
            const session = useSession();
            const [isLoading, setIsLoading] = useState<boolean>(false);
            const { chapterToken, code_token, course_slug, exerciseToken } = useParams();

            const onDelete = async () => {
                const urlMutate = qs.stringifyUrl({
                    url: `${BACKEND_URL}/code/detail-code`,
                    query: {
                        email: session.data?.user.email,
                        code_token,
                        exercise_token: exerciseToken,
                        course_slug,
                        chapter_token: chapterToken
                    }
                });

                const url = qs.stringifyUrl({
                    url: `${BACKEND_URL}/code/delete-testcase`,
                    query: {
                        codeId,
                        testcaseId: id
                    }
                })

                try {
                    setIsLoading(true);
                    await axios.delete(url, {
                        headers: {
                            Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    mutate([urlMutate, session.data?.backendTokens.accessToken]);
                }
                catch {
                    toast.error('Something went wrong');
                }
                finally {
                    setIsLoading(false);
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-4 p-0">
                            <span className="sr-only">Action</span>
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <div onClick={onDelete}>
                            <DropdownMenuItem disabled={isLoading}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Xóa
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
