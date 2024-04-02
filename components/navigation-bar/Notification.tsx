import { Bell, CheckCircle, Circle} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button"


import data from "@/public/data_notification_example.json"
import { cn } from '@/lib/utils';



interface Notification {
    id: number;
    UserSend_Id: string;
    UserSend_Name: string;
    UserSend_Image: string;
    UserGet_Id: string;
    UserGet_Name: string;
    Message: string;
    isReaded: boolean;
    SendAt: string;
}


export default function Notification() {
    const notifications: Notification[] = data.map((item) => ({
        id: item.id,
        UserSend_Id: item.UserSend_Id,
        UserSend_Name: item.UserSend_Name,
        UserSend_Image: item.UserSend_Image,
        UserGet_Id: item.UserGet_Id,
        UserGet_Name: item.UserGet_Name,
        Message: item.Message,
        isReaded: item.isReaded,
        SendAt: item.SendAt,
    }));
    const session = useSession();
    if (session.status === 'unauthenticated') {
        return (
            <></>
        )
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className='p-0'>
                    <Bell size={32} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-80 " align='end'>
                <div className="flex items-center justify-center p-4 space-y-2 border-b-4">
                    <h4 className="text-lg font-bold leading-none">Notification</h4>
                </div>
                <div className="grid p-0 ">
                    <div className="grid ">
                        {notifications.map((notification, index) => ( //lúc get data thì lấy 5 cái gần nhất theo ngày nha, không được thì lấy hết rồi t sửa code này
                            <Card key={index} className='rounded-none'>
                                <CardContent className={cn(notification.isReaded ? "bg-slate-300": "","grid p-2")}>
                                    <div className="flex items-center justify-start ">
                                        <div className="relative flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src="/avatars/01.png" />
                                                <AvatarFallback>OM</AvatarFallback>
                                            </Avatar>
                                            <div className='space-y-1'>
                                                <p className="text-sm font-medium leading-none line-clamp-1">{notification.UserGet_Name}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{notification.Message}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{notification.SendAt}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-around p-2 ">
                    <Button variant="ghost" className='font-bold'>Đánh dấu đã đọc</Button>
                    <Button variant="outline" className='font-bold border-4'>Xem tất cả</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
