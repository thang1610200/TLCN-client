import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import fetcher from '@/lib/fetcher';
import { Topic } from '../types';

const fetchers = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const useAllTopicHome = () => {
    const { data, error, isLoading, mutate} = useSwr<Topic[], AxiosError>(`${BACKEND_URL}/course/all-topic-home`, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error,
        loadingTopic: isLoading,
        mutate
    }
}

export const useTopic = (token?: string) => {
    const { data, error, isLoading } = useSwr<Topic[], AxiosError>(token ? [`${BACKEND_URL}/course/findall-topic`,token]: null, fetchers, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error,
        isLoading
    }
}