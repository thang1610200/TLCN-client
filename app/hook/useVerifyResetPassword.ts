import useSwr from 'swr';
import fetcher from '@/lib/fetcher';
import { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';

const useVerifyResetPassword = (token?: string, email?: string) => {
    const { data, error, isLoading } = useSwr<string, AxiosError>(`${BACKEND_URL}/auth/reset-password/click?token=${token}&email=${email}`, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
        refreshInterval: 5 * 60 * 1000
    })

    return {
        data,
        error,
        isLoading
    }
}

export default useVerifyResetPassword;