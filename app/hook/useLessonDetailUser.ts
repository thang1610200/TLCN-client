import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Lesson } from '../types';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useLessonDetailUser = (slug?: string, token?: string, lessonToken?: string, email?: string) => {
    const { data, error, isLoading, mutate} = useSwr<Lesson, AxiosError>(token ? [`${BACKEND_URL}/lesson/detail-lesson?course_slug=${slug}&lesson_token=${lessonToken}&email=${email}`,token]: null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        lesson: data,
        errorLesson: error,
        loadingLesson: isLoading,
        mutate
    }
}

export default useLessonDetailUser;