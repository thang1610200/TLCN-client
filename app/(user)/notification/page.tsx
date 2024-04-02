"use client"

import React, { useState } from 'react'
import { Bell, CheckCircle, Circle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button"

import data from "@/public/data_notification_example.json"
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';


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

export default function NotificationPage() {
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
    const [isShowMessage, setIsShowMessage] = useState(false);
    const [dataMessage, setDataMessage] = useState<Notification | null>(null)

    function handleShowMessage(isShowMessage: boolean, notification: Notification) {
        if (!isShowMessage) {
            setIsShowMessage(!isShowMessage)
            setDataMessage(notification)
        } else {
            setDataMessage(notification)
        }

    }

    return (
        <>
            <div className="flex items-center justify-center p-4 mb-4 space-y-2 border-b-4">
                <h4 className="text-3xl font-bold leading-none">Notification</h4>
            </div>
            <div className="grid grid-cols-2 p-0 space-x-4 ">
                <div className="grid border-2">
                    {notifications.map((notification, index) => ( //lúc get data thì lấy 5 cái gần nhất theo ngày nha, không được thì lấy hết rồi t sửa code này
                        <Card key={index} defaultValue={notification.id} className='rounded-none' onClick={() => { handleShowMessage(isShowMessage, notification) }}>
                            <CardContent className={cn(notification.isReaded ? "bg-slate-300" : "", "grid p-2")}>
                                <div className="flex items-center justify-start ">
                                    <div className="relative flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src="/avatars/01.png" />
                                            <AvatarFallback>OM</AvatarFallback>
                                        </Avatar>
                                        <div className='space-y-1'>
                                            <p className="text-sm font-medium leading-none line-clamp-1">{notification.UserSend_Name}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{notification.Message}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{notification.SendAt}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="flex items-center justify-around p-2 ">
                        <Button variant="ghost" className='font-bold'>Đánh dấu đã đọc</Button>
                        <Button variant="outline" className='font-bold border-4'>Xem tất cả</Button>
                    </div>
                </div>
                {isShowMessage && (
                    <div className="flex flex-col h-full border-2">
                        <Separator />
                        {isShowMessage ? (
                            <div className="flex flex-col flex-1">
                                <div className="flex items-start p-4">
                                    <div className="flex items-start gap-4 text-sm">
                                        <Avatar>
                                            <AvatarImage src={dataMessage?.UserSend_Image} />
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="font-semibold">{dataMessage?.UserSend_Name}</div>
                                        </div>
                                    </div>
                                    {dataMessage?.SendAt && (
                                        <div className="ml-auto text-xs text-muted-foreground">
                                            {dataMessage?.SendAt}
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                <div className="flex-1 p-4 text-sm whitespace-pre-wrap">
                                    {dataMessage?.Message}
                                </div>
                                <Separator className="mt-auto" />
                                <div className="p-4">
                                    <form>
                                        <div className="flex gap-4">
                                            <Textarea
                                                className="p-4"
                                                placeholder={`Reply ${dataMessage?.UserSend_Name}...`}
                                            />
                                            <div className="flex items-center">
                                                <Button
                                                    onClick={(e) => e.preventDefault()}
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    Send
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                Không có cuộc hội thoại được chọn
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
