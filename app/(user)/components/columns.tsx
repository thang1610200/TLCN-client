'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, LogIn, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Course, UserProgress } from '@/app/types';
import Image from 'next/image';

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: 'picture',
        header: ({ column }) => {
            return (
                <span>Image</span>
            );
        },
        cell: ({ row }) => {
            const url_image: string = row.getValue('picture') || "";
            return (
                <div className="relative w-40 h-full aspect-video">
                    <Image
                        priority={true}
                        fill={true}
                        className="object-cover object-center aspect-video"
                        alt="image thumnail"
                        src={url_image}
                        sizes="10rem"
                    />
                </div>
            );
        },
    },
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Tiêu đề
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'owner_id',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Tác giả
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'userProgress',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Tiến độ
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const userProgress: UserProgress = row.getValue('userProgress');
            return <div></div>
        },
    },
    {
        accessorKey: 'create_at',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Ngày tham gia
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const create_date = new Date(row.getValue('create_at'));

            return <div>{create_date.toDateString()}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const { slug } = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-4 p-0">
                            <span className="sr-only">Mở danh sách</span>
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <LogIn className="w-4 h-4 mr-2" />
                            Truy cập khóa học
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa khóa học
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
