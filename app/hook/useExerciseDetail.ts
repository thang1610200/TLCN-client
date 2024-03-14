import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import qs from 'query-string';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useExerciseDetail = (email?: string, token?: string, exercise_token?:string, course_slug?: string, chapter_token?: string) => {
    const url = qs.stringifyUrl({
        url: `${BACKEND_URL}/exercise/detail-exercise`,
        query: {
            email,
            token: exercise_token,
            course_slug,
            chapter_token
        }
    })

    const { data, error, isLoading, mutate, isValidating} = useSwr<any, AxiosError>(token ? [url,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error,
        isLoading,
        mutate,
        isValidating
    }
}

export default useExerciseDetail;