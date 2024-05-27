"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { AnimatePresence, MotionValue, motion, useMotionValue } from "framer-motion";
import LoginButton from '@/components/navigation-bar/LoginButton';
import RoleUser from '@/components/navigation-bar/RoleUser';
import Notification from '@/components/navigation-bar/Notification';
import SideBar from './SideBar';
import { useSession } from 'next-auth/react';
import RegisterInsModal from '../Reg-Ins-Modal';

export const Navbar = () => {
    return (
        <div className='w-full h-20 border-2 '>
            {/* <SideBar/> */}
            <div className="container flex items-center justify-between w-full h-full ">
                <div className="relative flex items-center justify-center w-fit h-fit">
                    <h2 className="z-10 text-xl font-bold drop-shadow-2xl md:text-4xl">
                        LEARNER
                    </h2>
                </div>
                <HomeMenu />
                <div className="flex items-center justify-center gap-4">
                    {/* <RoleUser /> */}
                    {/* <Notification /> */}
                    <div className="flex justify-center space-x-2 cursor-pointer ">
                        <LoginButton />
                    </div>
                </div>
            </div>
        </div>
    )
}


function HomeMenu() {
    const links = [
        {
            path: "/",
            name: "Trang chính"
        },
        {
            path: "/about",
            name: "Thông tin"
        },
        {
            path: "/thread",
            name: "Phòng học tập"
        },
    ]
    const session = useSession();
    const role = session.data?.user.role;
    const instructor = {
        path: "/instructor/course",
        name: "Giảng viên"
    }
    return (
        <>
            <nav className='p-8'>
                <ul className='flex gap-12'>
                    <AnimatePresence>
                        {links.map((link) => {
                            return (
                                <MoveHomeMenu key={link.name} link={link} isRegister={false} />
                            )
                        })}
                        {role === 'LEARNER' && session.status === "authenticated" &&
                            <MoveHomeMenu link={instructor} isRegister={true} />
                        }
                        {role === "INSTRUCTOR" && session.status === "authenticated" &&
                            <MoveHomeMenu link={instructor} isRegister={false} />
                        }
                    </AnimatePresence>
                </ul>
            </nav>
        </>
    )
}

function MoveHomeMenu({ link, isRegister }: { link: { name: string, path: string }, isRegister: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const MotionLink = motion(Link)
    const mapRange = (
        inputLower: number,
        inputUpper: number,
        outputLower: number,
        outputUpper: number
    ) => {
        const INPUT_RANGE = inputUpper - inputLower
        const OUTPUT_RANGE = outputUpper - outputLower

        return (value: number) => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
    }

    const setTransform = (item: HTMLElement & EventTarget, event: React.PointerEvent, x: MotionValue, y: MotionValue) => {
        const bounds = item.getBoundingClientRect();
        const relativeX = event.clientX - bounds.left;
        const relativeY = event.clientY - bounds.top;
        const xRange = mapRange(0, bounds.width, -1, 1)(relativeX)
        const yRange = mapRange(0, bounds.height, -1, 1)(relativeY)
        x.set(xRange * 10)
        y.set(yRange * 10)
    }

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    return <>
        <motion.li onPointerMove={(event) => {
            const item = event.currentTarget;
            setTransform(item, event, x, y)
        }}
            key={link.path}
            onPointerLeave={(event) => {
                x.set(0)
                y.set(0)
            }}
            style={{ x, y }}>
            <motion.div className='px-4 py-2 font-medium transition-all duration-500 ease-out rounded-md hover:text-slate-100 hover:bg-slate-950'>
                {isRegister
                    ? <motion.button onClick={(event) => { setIsOpen(true), event.stopPropagation(); }} >
                        <motion.span>{link.name}</motion.span>
                    </motion.button>
                    : <MotionLink href={link.path} >
                        <motion.span>{link.name}</motion.span>
                        <RegisterInsModal isOpen={isOpen} setIsOpen={setIsOpen} />
                    </MotionLink>
                }

            </motion.div>
        </motion.li>
        {isRegister && <RegisterInsModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
}

