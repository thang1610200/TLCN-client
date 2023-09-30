"use client";

import React, { useEffect, useState } from "react";
import { BiCartAlt, BiSearch, BiGlobe, BiMenu } from "react-icons/bi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { signOut } from 'next-auth/react'





import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"





export default function Navbar() {
  const session = useSession();



  return (
    <>
      {session.data !== undefined ?
        <nav >
          <div className='flex space-x-2 bg-white h-[74px] shadow-lg text-center justify-between items-center fixed w-full z-10'>
            <BiMenu className="w-6 h-6 md:hidden" />
            <a href="/home"><h2 className='text-3xl font-bold'>Udemy</h2></a>
            <h3 className='hidden text-sm md:block'>Categories</h3>
            <form className='hidden bg-[#f8fafb] md:flex border border-black rounded-3xl flex-1 h-12 items-center'>
              <BiSearch className="w-5 h-5 mx-4 text-gray-400" />
              <input type="text" placeholder='Search for anything' className='w-full h-full text-sm bg-transparent focus:outline-none' />
            </form>
            <h3 className='hidden text-sm lg:block'>Udemy Business</h3>
            <h3 className='hidden text-sm lg:block md:hidden'>Teach on Udemy</h3>
            <div className="flex">
              <BiSearch className="w-6 h-6 text-gray-400 md:hidden" />
            </div>
            <div className="justify-end hidden pr-4 space-x-4 md:flex">
              {session.data ?
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative w-20 h-10 rounded-full focus:ring-0 focus:ring-offset-0 hover:bg-inherit">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={session.data?.user.image} alt="User Image" />
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.data?.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.data?.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-inherit" onClick={() => {
                      signOut();
                    }}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                : <div className="hidden md:flex">
                  <Link rel="stylesheet" href="\login" >
                    <button className='border border-black text-sm font-bold w-20 h-10 hover:bg-[#F5F5F5] rounded-full'>
                      Log In
                    </button>
                  </Link>
                </div>
              }
              <Link rel="stylesheet" href="\" >
                <button className="border border-black h-10 w-10 flex items-center justify-center hover:bg-[#F5F5F5]">
                  <BiGlobe className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </nav>
        :
        <nav >
          <div className='flex space-x-4 bg-white h-[74px] shadow-lg text-center justify-between items-center px-4 fixed w-full z-10'>
            <BiMenu className="w-6 h-6 md:hidden" />
            <a href="/home"><h2 className='text-3xl font-bold'>Udemy</h2></a>
            <h3 className='hidden text-sm md:block'>Categories</h3>
            <form className='hidden bg-[#f8fafb] md:flex border border-black rounded-3xl flex-1 h-12 items-center'>
              <BiSearch className="w-5 h-5 mx-4 text-gray-400" />
              <input type="text" placeholder='Search for anything' className='w-full h-full text-sm bg-transparent focus:outline-none' />
            </form>
            <h3 className='hidden text-sm lg:block'>Udemy Business</h3>
            <h3 className='hidden text-sm lg:block md:hidden'>Teach on Udemy</h3>
            <div className="flex">
              <BiSearch className="w-6 h-6 text-gray-400 md:hidden" />
            </div>
            <div className="justify-end hidden pr-4 space-x-4 md:flex">
              <div className="relative w-20 h-10"></div>
              <Link rel="stylesheet" href="\" >
                <button className="border border-black h-10 w-10 flex items-center justify-center hover:bg-[#F5F5F5]">
                  <BiGlobe className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </nav>}




      {/* <NavigationMenu className="fixed justify-around  w-[1525px] h-[74px] p-4 bg-white max-w-none ">
        <NavigationMenuList className="space-x-4">
          <NavigationMenuItem>
            <Link href="/home" legacyBehavior passHref>
              <NavigationMenuLink>
                <h2 className="text-3xl font-bold">Udemy</h2>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="">
            <NavigationMenuTrigger className="text-lg">Category</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
        <Input
          type="search"
          placeholder="Search..."
          className="md:w-min lg:w-[500px] bg-[#f8fafb] border border-black rounded-3xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
        />
        {session ? <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-10 h-10 pr-12 rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarImage src={session.data?.user.image} alt="User Image" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.data?.user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.data?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          :
          <div className="justify-end hidden pr-4 space-x-4 md:flex">
            <Link rel="stylesheet" href="\login" >
              <button className='border border-black h-10 text-sm font-bold w-20 hover:bg-[#F5F5F5]'>
                Log In
              </button>
            </Link>
            <Link rel="stylesheet" href="\" >
              <button className="border border-black h-10 w-10 flex items-center justify-center hover:bg-[#F5F5F5]">
                <BiGlobe className="w-5 h-5" />
              </button>
            </Link>

          </div>}
      </NavigationMenu> */}
    </>
  );
}
