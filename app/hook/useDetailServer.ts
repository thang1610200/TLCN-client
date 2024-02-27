import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Server } from '../types';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const useDetailServer = (serverToken?: string, token?: string, email?: string) => {
    const { data, error, isLoading, mutate} = useSwr<Server, AxiosError>(token ? [`${BACKEND_URL}/thread/detail-server?serverToken=${serverToken}&email=${email}`,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        server: data,
        error,
        isLoading,
        mutate
    }
}