'use client';

import { useEffect, useState } from 'react';
import { CreateServerModal } from '../modal/create-server-modal';
import { InviteModal } from '../modal/invite-modal';
import { EditServerModal } from '../modal/edit-server-modal';
import { MembersModal } from '../modal/member-modal';
import { CreateChannelModal } from '../modal/create-channel-modal';
import { LeaveServerModal } from '../modal/leave-server-modal';
import { DeleteServerModal } from '../modal/delete-server-modal';
import { EditChannelModal } from '../modal/edit-channel-modal';
import { DeleteChannelModal } from '../modal/delete-channel-modal';


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <EditChannelModal />
            <DeleteChannelModal />
            {/* <MessageFileModal />
            <DeleteMessageModal /> */}
        </>
    );
};
