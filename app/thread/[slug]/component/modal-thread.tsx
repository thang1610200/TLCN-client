import React, { useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

import ModalComment from './modal-comment';

type UserComment = {
    username: string;
    avatar: string;
    comment: string;
}

interface ModalThreadProps {
    UserComment: UserComment[];
    image: string;
    caption: string;
}

export default function ModalThread(props: ModalThreadProps) {
    const UserComment = props.UserComment;
    const image = props.image;
    const caption = props.caption;
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src="/avatars/01.png" />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                                <p className="text-sm text-muted-foreground">m@example.com</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 ">
                    <div>{caption}</div>
                    <div className="rounded-lg w-fit max-w-[500px] max-h-[500px]">
                        <Image
                            src={image}
                            alt="description image"
                            width={500}
                            height={500}
                            className="object-cover w-auto h-auto transition-all hover:scale-105 aspect-square"
                        />
                    </div>
                    <ModalComment UserComment={UserComment}/>
                </CardContent>
            </Card>
        </div>
    )
}
