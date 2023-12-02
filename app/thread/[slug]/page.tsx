"use client"

import React from 'react';
import ModalThread from './component/modal-thread';

interface ThreadItem {
    id: number;
    comment: string[];
  }

export default function HomePage() {
    const thread:ThreadItem[] = [{"id":1, "comment":["I think you should", "I think you shouldn't"]}]

    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen p-6 mt-32">
                <div className="w-3/4 mt-32 h-fit">
                    {thread.map((item) => (
                        <ModalThread key={item.id} data={item.comment} image="https://picsum.photos/500/500"/>
                    ))}
                </div>
            </div>
        </>
    );
}
