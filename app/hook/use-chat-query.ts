import qs from 'query-string';
import useSWRInfinite from 'swr/infinite';
import { useSocket } from '@/components/provider/socket-provider';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';

interface ChatQueryProps {
    paramValue: string;
    token?: string;
    paramKey: "channelToken" | "conversationId";
    apiUrl: string;
}

export const useChatQuery = ({
    paramValue,
    token,
    apiUrl,
    paramKey
}: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetcher = async ([url, token]: [string, string]) => {
        const res = await axios.get(url,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    };

    const { data, isLoading, error, setSize, mutate, size, isValidating } = useSWRInfinite((item, previousPageData) => {
        //console.log(previousPageData);
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/${apiUrl}`,
            query: {
                //channelToken: paramValue,
                [paramKey]: paramValue,
                cursor: previousPageData?.nextCursor
            }
        })
        return token ? [url,token]: null
    }, fetcher, {
        refreshInterval: isConnected ? 0 : 1000
    });

    return {
        data,
        isLoading,
        error,
        setSize,
        mutate,
        size,
        isValidating
    };
};
