import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Code, LabCode } from '../types';
import qs from 'query-string';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const useDetailCode = (email?: string, code_token?: string, exercise_token?: string, course_slug?: string, chapter_token?: string, token?: string) => {
    const url = qs.stringifyUrl({
        url: `${BACKEND_URL}/code/detail-code`,
        query: {
            email,
            code_token,
            exercise_token,
            course_slug,
            chapter_token
        }
    });

    const { data, error, isLoading, mutate, isValidating} = useSwr<Code, AxiosError>(token ? [url, token]: null, fetcher, {
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


export const useLanguageCode = (email?: string, token?: string) => {
    const url = qs.stringifyUrl({
        url: `${BACKEND_URL}/code/language-code`,
        query: {
            email
        }
    });

    const { data, error, isLoading, mutate, isValidating} = useSwr<LabCode[], AxiosError>(token ? [url, token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        languageCodeError: error,
        languageCodeLoading: isLoading,
        mutate
    }
}