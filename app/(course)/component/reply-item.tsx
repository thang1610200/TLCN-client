'use client';

import { Course, Review, ReviewReply } from '@/app/types';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2, MessageCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { KeyedMutator } from 'swr';
import { CopyToClipboard } from "react-copy-to-clipboard";

interface ReviewItemProps {
    reply: ReviewReply;
    mutate: KeyedMutator<any>;
    course?: Course
    review: Review
}

const ReplyItem: React.FC<ReviewItemProps> = ({ reply, mutate, course, review }) => {
    const [isLoading, setIsLoading] = useState(false);
    const session = useSession();
    const router = useRouter();

    const onDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(
                `${BACKEND_URL}/review/delete-reply?email=${session.data?.user.email}&reviewId=${review.id}&replyId=${reply.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success('Reply deleted');
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex mt-3 pl-8 pb-1 w-full">
                <div className="relative w-12 h-12 rounded-full focus:ring-0 focus:ring-offset-0 hover:bg-inherit">
                    <Avatar className="w-full h-fit">
                        <AvatarImage src={reply.user.image} alt="User Image" />
                    </Avatar>
                </div>
                <Card className="ml-4 w-full">
                    <CardHeader className="flex-row p-3">
                        <div className="basis-full items-center flex">
                            <CardTitle className="text-sm">
                                {reply.user.name}{' '}
                            </CardTitle>
                            <span className="text-gray-500 text-xs ml-2">
                                {' '}
                                •{' '}
                                {format(
                                    new Date(reply.create_at),
                                    "d 'thg' L yy"
                                )}
                            </span>
                        </div>
                        {reply.user.email === course?.owner.email && (
                            <div className="flex items-center justify-between">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost">
                                            <MoreHorizontal />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-30">
                                        <u className="list-none">
                                            <li>
                                                {reply.user.email ===
                                                    session.data?.user
                                                        .email && (
                                                    <ConfirmModal
                                                        onConfirm={onDelete}
                                                    >
                                                        <Button
                                                            disabled={isLoading}
                                                            variant="ghost"
                                                        >
                                                            <Trash2
                                                                size={20}
                                                                className="mr-3"
                                                            />{' '}
                                                            Delete
                                                        </Button>
                                                    </ConfirmModal>
                                                )}
                                            </li>
                                            <li>
                                            <CopyToClipboard text={reply.reply} onCopy={() => toast.success('Copied!')}>
                                                <Button
                                                    variant="ghost"
                                                >
                                                    <Copy
                                                        size={20}
                                                        className="mr-3"
                                                    />{' '}
                                                    Copy
                                                </Button>
                                            </CopyToClipboard>
                                        </li>
                                        </u>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="pt-0 p-3">
                        {reply.reply}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ReplyItem;
