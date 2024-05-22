import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Course, Level, UserProgress } from '../types';
import fetcher from '@/lib/fetcher';
import qs from 'query-string';

const fetchers = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const useAllCourse = (email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<Course[], AxiosError>(token ? [`${BACKEND_URL}/course/all-course?&email=${email}`,token]: null, fetchers, {
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

export const useUserOfInstructor = (email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<UserProgress[], AxiosError>(token ? [`${BACKEND_URL}/course/user-instructor?&email=${email}`,token]: null, fetchers, {
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

export const useUserOfCourse = (email?: string, token?: string, course_slug?: string) => {
    const { data, error, isLoading, mutate} = useSwr<UserProgress[], AxiosError>(token ? [`${BACKEND_URL}/course/user-course?&email=${email}&course_slug=${course_slug}`,token]: null, fetchers, {
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

export const useAllLevel = (token?: string) => {
    const { data, error, isLoading} = useSwr<Level[], AxiosError>(token ? [`${BACKEND_URL}/course/get-level`,token]: null, fetchers, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    });

    return {
        data,
        errorLevel: error,
        isLoadingLevel: isLoading
    }
}

export const useCountCoursePublish = (title?: string, topic?:string[], level?: string[], page?: string) => {
    const url = qs.stringifyUrl(
        {
            url: `${BACKEND_URL}/course/count-course-publish`,
            query: {
                title,
                topic_slug: topic,
                level_slug: level,
                page
            },
        },
        { skipNull: true, skipEmptyString: true }
    );

    const { data, error, isLoading, mutate} = useSwr<any, AxiosError>(url, fetcher, {
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