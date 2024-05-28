import { useSession } from 'next-auth/react';
import React from 'react'
import RegisterInsModal from '../Reg-Ins-Modal';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function RoleUser() {
    const session = useSession();
    const role = session.data?.user.role;
    if (role === 'LEARNER' && session.status === "authenticated") {
        return (
            <>
                <div className='relative flex items-center justify-end '>
                    {/* <RegisterInsModal /> */}
                </div>
            </>
        )
    }
    if (role === "INSTRUCTOR" && session.status === "authenticated") {
        return (
            <>
                <div className="relative flex items-center justify-center rounded-full hover:bg-slate-50 hover:bg-opacity-30 ">
                    <Link
                        href="/instructor/course"
                        legacyBehavior
                        passHref
                        className="justify-center align-middle "
                    >
                        <Button variant="default">
                            Giảng viên
                        </Button>
                    </Link>
                </div>
            </>
        )
    }
    return (
        <></>
    )
}
