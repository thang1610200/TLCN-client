import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { RegisterInstructor } from '../types';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useRegisterInstructor = (email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<RegisterInstructor, AxiosError>(token ? [`${BACKEND_URL}/register-instructor/find?email=${email}`,token]: null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error,
        isLoadingRegister: isLoading,
        mutate
    }
}

export default useRegisterInstructor;