import useSwr from 'swr';
import { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import fetcher from '@/lib/fetcher';
import { Course } from '../types';

const useCourseDetailHome = (slug?: string) => {
    const { data, error, isLoading, mutate, isValidating} = useSwr<Course, AxiosError>(`${BACKEND_URL}/course/detail-course?slug=${slug}`, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
        //refreshInterval: 500
    })

    return {
        data,
        error,
        isLoading,
        mutate,
        isValidating
    }
}

export default useCourseDetailHome;