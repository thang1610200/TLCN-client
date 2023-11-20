import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Course } from '../types';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useUserProgressCourse = (slug?: string, token?: string, email?: string) => {
    const { data, error, isLoading, mutate} = useSwr<Course, AxiosError>(token ? [`${BACKEND_URL}/course/progress-course?course_slug=${slug}&email=${email}`,token]: null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        progress: data,
        errorProgress: error,
        loadingProgress: isLoading,
        mutate
    }
}

export default useUserProgressCourse;