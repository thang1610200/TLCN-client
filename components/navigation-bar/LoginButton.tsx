import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenuLink,
} from '@/components/ui/navigation-menu';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';


export default function LoginButton() {
    const session = useSession();
    if (session.status === 'unauthenticated') {
        return (
            <>
                <div className="flex p-3">
                    <Link rel="stylesheet" href="\login">
                        <Button className="">
                            Đăng nhập
                        </Button>
                    </Link>
                </div>
            </>
        )
    }
    if (session.status == 'loading') {
        return (
            <>
                <Avatar className="w-10 h-10">
                    <AvatarFallback>User</AvatarFallback>
                </Avatar>
            </>
        )
    }
    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="default"
                        className="relative flex items-center justify-center w-12 h-12 p-0 bg-black rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-inherit"
                    >
                        <Avatar className="w-full h-full">
                            <AvatarImage
                                src={session.data?.user.image}
                                alt="User Image"
                            />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56"
                    align="end"
                    forceMount
                >
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {session.data?.user.name}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {session.data?.user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link
                            href="/profile"
                            legacyBehavior
                            passHref
                        >
                            <DropdownMenuItem>
                                <NavigationMenuLink>
                                    Trang cá nhân
                                </NavigationMenuLink>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="hover:bg-inherit"
                        onClick={() => {
                            signOut({ callbackUrl: '/login' });
                        }}
                    >
                        Đăng xuất
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
