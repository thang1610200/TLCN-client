import { useSocket } from '@/components/provider/socket-provider';
import { useEffect } from 'react';
import { Message } from '../types';
import { KeyedMutator } from 'swr';

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>
};

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey,
    size,
    setSize,
    mutate,
}: ChatSocketProps) => {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on(updateKey, (message: any) => {
            mutate();
        });

        socket.on(addKey, (message: any) => {
            mutate();
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };
    }, [addKey, queryKey, socket, updateKey]);
};
