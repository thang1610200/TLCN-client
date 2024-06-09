"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Bell, ChevronUpIcon, Home, LineChart, Menu, Package, Package2, ShoppingCart, Users, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, stagger } from "framer-motion"
import { Transition } from '@headlessui/react'
import RegisterInsModal from '../Reg-Ins-Modal'
import { useSession } from 'next-auth/react'


const items: { href: string, label: string }[] = [
    {
        href: "/",
        label: "Trang chính",
    },
    {
        href: "/about",
        label: "Thông tin",
    },
    {
        href: "/thread",
        label: "Phòng học tập",
    },
]

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const session = useSession();
    const role = session.data?.user.role;
    const animationVariants = {
        initial: {
            x: "-20vw",
            opacity: 0,
            scale: 0.3,
            filter: "blur(10px)"
        },
        animate: (index: number) => ({
            x: "0vw",
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                bound: 1,
                delay: 0.4 * index,
                ease: "easeInOut"
            }
        }),
    }

    return (
        <>
            <Button variant="outline" size="icon" className="m-8 rounded-full w-14 h-14 " onClick={() => (setIsOpen(!isOpen))}>
                <Avatar className="h-[48px] w-[48px]">
                    <AvatarImage
                        src={session.data?.user.image}
                        alt="User Image"
                    />
                    <AvatarFallback>User</AvatarFallback>
                </Avatar>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ x: "-20rem" }} animate={{ x: 0 }} exit={{ x: "-20rem" }} transition={{ duration: 1, ease: "easeInOut" }} className="absolute top-0 left-0 z-50 flex flex-col justify-between h-screen pt-10 text-white bg-black w-80">

                        <div className="hidden md:block">
                            <div className="flex flex-col h-full max-h-screen gap-2">
                                <div className="flex-1">
                                    <nav className="grid items-start gap-10 px-2 text-3xl font-medium tracking-wider font-beauSans lg:px-4">
                                        {items.map((item, index) => (
                                            <motion.div custom={index} variants={animationVariants} initial="initial" animate="animate" key={item.label} className="">
                                                <Link

                                                    href={item.href}
                                                    className=""
                                                >
                                                    {item.label}
                                                </Link>
                                            </motion.div>
                                        ))}
                                        {role === 'LEARNER' && session.status === "authenticated" && (
                                            <>
                                                <motion.div custom={3} variants={animationVariants} initial="initial" animate="animate" onClick={() => (setIsOpenModal(true))} >Giảng viên</motion.div>
                                                <RegisterInsModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
                                            </>

                                        )
                                        }
                                        {role === "INSTRUCTOR" && session.status === "authenticated" &&
                                            <motion.div variants={animationVariants} initial="initial" animate="animate" className="">
                                                <Link

                                                    href="/instructor/course"
                                                    className=""
                                                >
                                                    Giảng viên
                                                </Link>
                                            </motion.div>
                                        }
                                    </nav>
                                </div>
                            </div >
                        </div>
                        <Button variant="ghost" size="icon" className="mx-2 rounded-full my-14 w-14 h-14" onClick={() => (setIsOpen(!isOpen))}>
                            <X className="w-8 h-8" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </motion.div >
                )}
            </AnimatePresence>
        </>

    )
}
