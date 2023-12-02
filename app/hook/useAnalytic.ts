import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Course, UserProgress } from '../types';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const useCountCourse = (email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<number, AxiosError>(token ? [`${BACKEND_URL}/course/count-course?&email=${email}`,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        countCourse: data,
        errorCourse: error,
        isLoadingCourse: isLoading,
        mutate
    }
}

export const useCountUser = (email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<number, AxiosError>(token ? [`${BACKEND_URL}/course/count-user?&email=${email}`,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        count: data,
        errorUser: error,
        isLoadingUser: isLoading,
        mutate
    }
}

