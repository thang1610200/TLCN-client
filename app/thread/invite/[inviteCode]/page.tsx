import getSession from "@/app/actions/getSession";
import { BACKEND_URL } from "@/lib/constant";
import axios from "axios";
import { redirect } from "next/navigation";

interface InvitePageProps {
    params: {
        inviteCode: string;
    };
}

const invitePage = async ({ params }: InvitePageProps) => {
    const session = await getSession();

    if(!params.inviteCode){
        return redirect('/thread');
    }

    try {
        var server = await axios.post(`${BACKEND_URL}/thread/join-server`, {
            email: session?.user.email,
            inviteCode: params.inviteCode
        },{
            headers: {
                Authorization: `Bearer ${session?.backendTokens.accessToken}`,
                "Content-Type": "application/json"
            }
        });
    }
    catch{
        return redirect('/thread');
    }

    redirect(`/thread/servers/${server.data?.token}`);
};

export default invitePage;
