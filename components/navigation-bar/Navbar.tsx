"use client"

import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,

} from '@/components/ui/navigation-menu';

import DetailsDialog from '../detail-dialog';
import LoginButton from './LoginButton';
import RoleUser from './RoleUser';
import Notification from './Notification';


export const Navbar = () => {

    return (
        <div>
            <NavigationMenu className="fixed z-10 flex items-center justify-between w-[calc(100%_-_2rem)] h-16 m-4 px-2 space-x-2 text-center bg-white max-w-none md:pl-10 md:pr-10 bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]">
                <h2 className="text-xl font-bold md:text-3xl">
                    LEARNER
                </h2>
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
                    <NavigationMenuItem>
                        <DetailsDialog />
                    </NavigationMenuItem>
                </NavigationMenuList>
                <div className="flex items-center justify-center gap-4">
                    <RoleUser/>
                    <Notification/>
                    <div className="flex justify-center space-x-2 cursor-pointer ">
                        <LoginButton/>
                    </div>
                </div>
            </NavigationMenu>
        </div>
    );
}
