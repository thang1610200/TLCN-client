'use client';

import { Review } from '@/app/types';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface ReviewItemProps {
    review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
    const [openReply, setOpenReply] = useState(false);
    const session = useSession();

    return (
        <>
            <div className="flex mt-3 pb-1 w-full">
                <div className="relative w-12 h-12 rounded-full focus:ring-0 focus:ring-offset-0 hover:bg-inherit">
                    <Avatar className="w-full h-fit">
                        <AvatarImage src={review.user.image} alt="User Image" />
                    </Avatar>
                </div>
                <Card className="ml-4 w-full">
                    <CardHeader className="flex-row">
                        <div className="basis-full items-center flex">
                            <CardTitle className="text-sm">
                                {review.user.name}{' '}
                            </CardTitle>
                            <span className="text-gray-500 text-xs ml-2">
                                {' '}
                                •{' '}
                                {format(
                                    new Date(review.create_at),
                                    "d 'thg' L yy"
                                )}
                            </span>
                        </div>
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
                                            <Button variant="ghost">
                                                <Trash2
                                                    size={20}
                                                    className="mr-3"
                                                />{' '}
                                                Delete
                                            </Button>
                                        </li>
                                        {session.data?.user.role ===
                                            'INSTRUCTOR' && (
                                            <li>
                                                <Button variant="ghost">
                                                    <MessageCircle
                                                        size={20}
                                                        className="mr-3"
                                                    />{' '}
                                                    Reply
                                                </Button>
                                            </li>
                                        )}
                                    </u>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardHeader>
                    <CardContent>{review.content}</CardContent>
                </Card>
            </div>
        </>
    );
};

export default ReviewItem;
