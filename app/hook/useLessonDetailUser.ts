import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Content } from '../types';
import qs from 'query-string';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useLessonDetailUser = (slug?: string, token?: string, contentToken?: string, email?: string) => {
    const url = qs.stringifyUrl({
        url: `${BACKEND_URL}/lesson/detail-lesson`,
        query: {
            course_slug: slug,
            content_token: contentToken,
            email
        }
    });

    const { data, error, isLoading, mutate, isValidating} = useSwr<Content, AxiosError>(token ? [url,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        content: data,
        errorContent: error,
        loadingContent: isLoading,
        mutate,
        isValidating
    }
}

export default useLessonDetailUser;