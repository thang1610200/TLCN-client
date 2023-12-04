"use client"

import React from 'react';
import ModalThread from './component/modal-thread';
import ModalCreateThread from './component/modal-create-thread';


type UserComment = {
    username: string;
    avatar: string;
    comment: string;
}

interface ThreadItem {
    id: number;
    image: string;
    caption: string;
    UserComment: UserComment[];
}

export default function HomePage() {
    const thread: ThreadItem[] = [{ "id": 1, "image": "https://picsum.photos/500/500", "caption": "I have a question for chapter 1", "UserComment": [{ "username": "User1", "avatar": "https://picsum.photos/40/40", "comment": "I think you should" }, { "username": "User2", "avatar": "https://picsum.photos/40/40", "comment": "I think you shouldn't" }] },
    { "id": 2, "image": "https://picsum.photos/500/500", "caption": "I have a question for this chapter 2", "UserComment": [{ "username": "User3", "avatar": "https://picsum.photos/40/40", "comment": "I think you should" }, { "username": "User4", "avatar": "https://picsum.photos/40/40", "comment": "I think you shouldn't" }] }]

    return (
        <>
            <div className="flex items-center justify-center w-screen h-full bg-slate-200">

                <div className="w-3/4 space-y-4 mt-28 h-fit">
                    <div className="flex items-center justify-center ">
                        <ModalCreateThread />
                    </div>
                    {thread.map((item) => (
                        <ModalThread key={item.id} UserComment={item.UserComment} image={item.image} caption={item.caption} />
                    ))}
                </div>
            </div>
        </>
    );
}
