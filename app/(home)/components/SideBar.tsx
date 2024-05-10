"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Bell, ChevronUpIcon, Home, LineChart, Menu, Package, Package2, ShoppingCart, Users, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { motion, AnimatePresence, stagger } from "framer-motion"
import { Transition } from '@headlessui/react'


const items : {href: string, label: string}[] = [
    {
        href: "/",
        label: "Trang chính",
    },
    {
        href: "/about",
        label: "Thông tin",
    },
    {
        href: "#",
        label: "Studio", 
    },
    {
        href: "#",
        label: "Projects",
    },
    {
        href: "#",
        label: "Products",
    }
]

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false)
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
            <Button variant="ghost" size="icon" className="m-8 w-14 h-14" onClick={() => (setIsOpen(!isOpen))}>
                <Menu className="w-8 h-8" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ x: "-20vw" }} animate={{ x: 0 }} exit={{ x: "-20vw" }} transition={{ duration: 1, ease: "easeInOut" }} className="absolute z-50 flex flex-col h-screen text-white bg-black border-r-4 -top-4 -left-6 w-72">
                        <Button variant="ghost" size="icon" className="m-8 w-14 h-14" onClick={() => (setIsOpen(!isOpen))}>
                            <X className="w-8 h-8" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                        <div className="hidden md:block">
                            <div className="flex flex-col h-full max-h-screen gap-2">
                                <div className="flex-1">
                                    <nav className="grid items-start gap-6 px-2 text-3xl font-medium tracking-wider font-beauSans lg:px-4">
                                        {items.map((item, index) => (
                                            <motion.div custom={index} variants={animationVariants} initial="initial" animate="animate" key={item.label} className="">
                                                <Link

                                                    href={item.href}
                                                    className="flex items-center gap-3 px-3 py-2 text-white transition-all rounded-lg"
                                                >
                                                    {item.label}
                                                </Link>
                                            </motion.div>
                                        ))}

                                    </nav>
                                </div>
                            </div >
                        </div>
                    </motion.div >
                )}
            </AnimatePresence>
        </>

    )
}
