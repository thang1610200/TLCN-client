import getSession from '@/app/actions/getSession';
import { BACKEND_URL } from '@/lib/constant';
import { redirect } from 'next/navigation';
import qs from 'query-string';


interface ServerIdPageProps {
    params: {
        serverToken: string;
    };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
    const session = await getSession();

    const url = qs.stringifyUrl({
        url: `${BACKEND_URL}/thread/access-channel-general`,
        query: {
            serverToken: params.serverToken,
            email: session?.user.email
        }
    });

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${session?.backendTokens.accessToken}`
        }
    })

    const channel = await response.json();

    if(!response.ok || !channel?.token){
        return redirect('/thread');
    }

    return redirect(`/thread/servers/${params.serverToken}/channels/${channel?.token}`)
};

export default ServerIdPage;
