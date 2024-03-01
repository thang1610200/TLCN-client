import qs from 'query-string';
import useSWRInfinite from 'swr/infinite';
import { useSocket } from '@/components/provider/socket-provider';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Message } from '../types';

interface ChatQueryProps {
    paramValue: string;
    token?: string
}

export const useChatQuery = ({
    paramValue,
    token
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

    const { data, isLoading, error, setSize, mutate, size } = useSWRInfinite((item, previousPageData) => {
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/message/pagination-message`,
            query: {
                channelToken: paramValue,
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
        size
    };
};
