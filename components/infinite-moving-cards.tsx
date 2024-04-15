"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";


interface CardCourseProps {
    description: string;
    author: string | null;
    title: string;
    image: string;
    href: string;
    rating: number | null;
}

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "slow",
    pauseOnHover = true,
    className,
}: {
    items: CardCourseProps[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    });
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards"
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse"
                );
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    " flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap",
                    start && "animate-scroll ",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="dark:bg-black bg-slate-100  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex justify-center items-center w-[350px] max-w-full relative rounded-2xl   flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
                        key={item.title}
                    >
                        <blockquote className="flex flex-row items-center justify-center flex-1 gap-6">
                            <Image src={item.image} alt='image course' width={150} height={150} className='bg-center bg-contain aspect-square' />
                            <div className="max-h-[200px]">
                                <div
                                    aria-hidden="true"
                                    className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                                ></div>
                                <div className="relative z-20 flex flex-row items-start">
                                    <span className="flex flex-col gap-1">
                                        <span className=" text-xl leading-[1.6] text-slate-200 font-normal">
                                            {item.title}
                                        </span>
                                    </span>
                                </div>
                                <span className="relative z-20 text-sm font-normal text-gray-500 text-balance">
                                    {item.description}
                                </span>

                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};
