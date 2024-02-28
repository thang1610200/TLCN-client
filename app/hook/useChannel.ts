import axios, { AxiosError } from "axios";
import useSwr from 'swr';
import { Channel } from "../types";
import { BACKEND_URL } from "@/lib/constant";
import qs from 'query-string';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const useDetailChannel = (channelToken?: string,token?: string) => {
    const url = qs.stringifyUrl({
        url: `${BACKEND_URL}/thread/detail-channel`,
        query: {
            channelToken
        }
    })

    const { data, error, isLoading, mutate} = useSwr<Channel, AxiosError>(token ? [url, token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        channel: data,
        error,
        isLoading,
        mutate
    }
}