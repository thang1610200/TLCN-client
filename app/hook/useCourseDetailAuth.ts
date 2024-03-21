import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Course } from '../types';
import qs from 'query-string';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useCourseDetailAuth = (slug?: string, email?: string, token?: string) => {
    const url = qs.stringifyUrl({
        url: `${BACKEND_URL}/course/detail-course-auth`,
        query: {
            course_slug: slug,
            email
        }
    });

    const { data, error, isLoading, mutate} = useSwr<Course, AxiosError>(token ? [url, token]: null, fetcher, {
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
        mutate
    }
}

export default useCourseDetailAuth;