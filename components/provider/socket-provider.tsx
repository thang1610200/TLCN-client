"use client";

import { BACKEND_URL, MESSAGE_NAMESPACE } from "@/lib/constant";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const socketIOUrl = `${BACKEND_URL}/${MESSAGE_NAMESPACE}`;

export const SocketProvider = ({ 
        children 
    }: { 
        children: React.ReactNode 
    }) => {
    
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const session = useSession();

    useEffect(() => {
        const socketInstance = new (io as any)(socketIOUrl,{
            auth: {
                token: `Bearer ${session.data?.backendTokens.accessToken}`
            },
            transports: ['websocket']
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }

    },[session.data?.backendTokens.accessToken]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
          {children}
        </SocketContext.Provider>
    )
}