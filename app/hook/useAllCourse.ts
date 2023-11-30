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

export const useAllCourse = (email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<Course[], AxiosError>(token ? [`${BACKEND_URL}/course/all-course?&email=${email}`,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export const useUserOfCourse = (email?: string, token?: string, course_slug?: string) => {
    const { data, error, isLoading, mutate} = useSwr<Course, AxiosError>((token && course_slug) ? [`${BACKEND_URL}/course/user-course?&email=${email}&course_slug=${course_slug}`,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        errorUser: error,
        isLoadingUser: isLoading,
        mutate
    }
}
