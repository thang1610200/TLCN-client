import getSession from "@/app/actions/getSession";
import { BACKEND_URL } from "@/lib/constant";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

interface InvitePageProps {
    params: {
        inviteCode: string;
    };
}

const invitePage = async ({ params }: InvitePageProps) => {
    // const session = useSession();
    // const router = useRouter();

    // if(!params.inviteCode){
    //     return router.push('/thread');
    // }

    // useEffect(() => {
    //     if(session.status === 'authenticated') {
    //         axios.patch(`${BACKEND_URL}/thread/join-server`, {
    //             email: session.data?.user.email,
    //             inviteCode: params.inviteCode
    //         },{
    //             headers: {
    //                 Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
    //                 "Content-Type": "application/json"
    //             }
    //         })
    //         .then((response) => {
    //             return router.push(`/thread/servers/${response.data?.token}`);
    //         })
    //         .catch(() => {
    //             return router.push('/thread');
    //         })
    //     }
    // },[session, params.inviteCode]);

    // return null;

    const session = await getSession();

    if(!params.inviteCode){
        return redirect('/thread');
    }

    const response = await axios.patch(`${BACKEND_URL}/thread/join-server`, {
        email: session?.user.email,
        inviteCode: params.inviteCode
    },{
        headers: {
            Authorization: `Bearer ${session?.backendTokens.accessToken}`,
            "Content-Type": "application/json"
        }
    });

    if(response.data){
        return redirect(`/thread/servers/${response.data?.token}`);
    }else{
        return redirect('/thread');
    }
};

export default invitePage;
