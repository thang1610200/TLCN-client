'use client';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { BiSearch, BiGlobe, BiMenu, BiSolidGraduation } from 'react-icons/bi';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from '@/components/ui/navigation-menu';

import RegisterInsModal from '@/components/Reg-Ins-Modal';

import { useRouter } from 'next/navigation';
import SearchInput from './search-input';

const components: { title: string; href: string; description: string }[] = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description:
            'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description:
            'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description:
            'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description:
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
];

export default function Navbar() {
    const session = useSession();
    const router = useRouter();
    const roleLearner = 'LEARNER';
    const roleInstructor = 'INSTRUCTOR';
    const role = roleInstructor;
    const navRef = useRef();
    const handleBecomeInstructor = () => { };
    const handleSearch = () => { };
    return (
        <div className='fixed z-10 flex items-center justify-between w-[calc(100%_-_2rem)] h-16 m-4 px-2 space-x-2 text-center bg-white max-w-none md:pl-10 md:pr-10 bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]'>
            <h2 className="text-xl font-bold md:text-3xl">
                LEARNER
            </h2>
            <NavigationMenu className="">
                <NavigationMenuList className="flex space-x-8 ">
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink>
                                <h2 className="text-lg">
                                    Trang chính
                                </h2>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hidden md:flex">
                        <NavigationMenuTrigger className="text-lg bg-transparent hover:bg-transparent">
                            Danh mục
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {components.map((components) => (
                                    <ListItem
                                        key={components.title}
                                        title={components.title}
                                        href={components.href}
                                    >
                                        {components.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink>
                                <h2 className="text-lg">
                                    Khóa học
                                </h2>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink>
                                <h2 className="text-lg">
                                    Người Hướng Dẫn
                                </h2>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className=''>
                                <h2 className="text-lg">
                                    Liên hệ
                                </h2>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
                {/* <div className="w-full h-2/3">
                    <SearchInput />
                </div> */}
            </NavigationMenu>
            <div className="flex">
                {role.toString() === 'INSTRUCTOR' ? (
                    <div className="relative flex items-center justify-center rounded-full hover:bg-slate-50 hover:bg-opacity-30 ">
                        <Link
                            href="/instructor/course"
                            legacyBehavior
                            passHref
                            className="justify-center align-middle "
                        >
                            <Button className="">
                                Gia sư
                            </Button>
                        </Link>
                    </div>
                ) : session.status == 'authenticated' ? (
                    <RegisterInsModal />
                ) : (
                    <div></div>
                )}
                <div className="flex justify-end space-x-2 cursor-pointer ">
                    {session.status == 'authenticated' && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative w-16 h-16 pr-0 rounded-full focus:ring-0 focus:ring-offset-0 hover:bg-inherit"
                                >
                                    <Avatar className="w-full h-fit">
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
                                    <DropdownMenuItem>
                                        Chỉnh sửa
                                    </DropdownMenuItem>
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
                    )}
                    {session.status == 'unauthenticated' && (
                        <div className="flex p-3">
                            <Link rel="stylesheet" href="\login">
                                <Button className="border border-black text-sm font-bold w-20 h-10 hover:bg-[#F5F5F5] rounded-full">
                                    Đăng nhập
                                </Button>
                            </Link>
                        </div>
                    )}
                    {session.status == 'loading' && (
                        <div className="flex w-20 h-10"></div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
