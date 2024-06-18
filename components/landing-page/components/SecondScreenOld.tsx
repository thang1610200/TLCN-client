import React from 'react'
import { InfiniteMovingCards } from "@/components/infinite-moving-cards";

export default function SecondScreenOld() {
    return (
        <div className='w-screen h-screen flex flex-col dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]'>
            <div className="h-[42rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>
            <div className="h-[42rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={courses}
                    direction="left"
                    speed="slow"
                />
            </div>
        </div>
    )
}

const testimonials = [
    {
        description:
            "Nextjs là framework React mã nguồn mở, giúp xây dựng ứng dụng web hiệu suất cao, tối ưu SEO, trải nghiệm người dùng với render đa dạng (SSR, SSG, ISR)",
        author: null,
        title: "NextJS",
        image: "/images/nextjs.png",
        href: "/home",
        rating: null,
    },
    {
        description:
            "Nestjs là framework Node.js mã nguồn mở, giúp xây dựng ứng dụng server-side hiệu quả, dễ mở rộng, bảo trì bằng TypeScript, tích hợp sẵn nhiều thư viện hữu ích.",
        author: null,
        title: "NestJS",
        image: "/images/nestjs.png",
        href: "/home",
        rating: null,
    },
    {
        description: "Prisma là ORM mã nguồn mở giúp truy cập dữ liệu từ nhiều nguồn (MySQL, PostgreSQL, MongoDB...) một cách đơn giản, hiệu quả, với cú pháp truy vấn trực quan, dễ sử dụng",
        author: "Prisma",
        title: "Prisma",
        image: "/images/prisma.png",
        href: "/home",
        rating: null,
    },
    {
        description:
            "TailwindCSS là framework CSS mã nguồn mở cung cấp bộ class tiện ích, giúp xây dựng giao diện web nhanh chóng, dễ dàng tùy chỉnh và bảo trì, tối ưu hóa hiệu suất.",
        author: null,
        title: "TailwindCSS",
        image: "/images/tailwind.png",
        href: "/home",
        rating: null,
    },
    {
        description:
            "TypeScript là ngôn ngữ lập trình mã nguồn mở, mở rộng từ JavaScript, bổ sung hệ thống kiểu dữ liệu mạnh mẽ giúp phát triển ứng dụng lớn, phức tạp, đảm bảo tính bảo trì, dễ đọc hiểu.",
        author: null,
        title: "TypeScript",
        image: "/images/typescript.png",
        href: "/home",
        rating: null,
    },
];
const courses = [
    {
        description: "Tìm hiểu NextJS 14 từ đầu và xây dựng các ứng dụng ReactJS + NextJS đầy đủ với App Router hoặc Pages Router!",
        author: "Khánh Nguyễn",
        title: "Next.js 14 & React - The Complete Guide",
        image: "/images/nextjs.png",
        href: "/home",
        rating: 4.7,
    },
    {
        description: "Build full featured backend APIs incredibly quickly with Nest, TypeORM, and Typescript. Includes testing and deployment!",
        author: "Stephen Grider",
        title: "NestJS: The Complete Developer's Guide",
        image: "/images/nestjs.png",
        href: "/home",
        rating: 4.7,
    },
    {
        description: "Master Prisma for Node.js - From Concept to Deployment",
        author: "Naimish Verma",
        title: "Building Production-Ready Apps with Prisma Client for NodeJs",
        image: "/images/prisma.png",
        href: "/home",
        rating: 4.6,
    },
    {
        description: "Build great looking layouts fast and efficiently using Tailwind CSS utility classes",
        author: "Brad Traversy",
        title: "Tailwind CSS From Scratch | Learn By Building Projects",
        image: "/images/tailwind.png",
        href: "/home",
        rating: 4.6,
    },
    {
        description: "Khóa học Nextjs 14, ReactJS, Typescript từ cơ bản đến thực chiến cho ngườii mới bắt đầu 2024 PRO - Lập trình thật dễ",
        author: "Khánh Nguyễn",
        title: "Khóa học NextJS 14-ReactJS-Typescript thực chiến 2024 PRO",
        image: "/images/typescript.png",
        href: "/home",
        rating: 5.0,
    },
];
