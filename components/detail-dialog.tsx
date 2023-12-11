'use client';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Github, HelpCircle, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const DetailsDialog = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <h2 className="text-lg">Thông tin</h2>
            </DialogTrigger>
            <DialogContent className="w-[70vw] max-w-[100vw] md:w-[50vw]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Welcome to Learner!
                    </DialogTitle>
                    <DialogDescription>
                        {/* <div className="flex items-center gap-3 my-2">
              <p className="flex items-center">
                <Github className="w-5 h-5" />
                <Link
                  className="ml-1 underline"
                  href="https://github.com/elliott-chong/Quizzzy"
                >
                  GitHub
                </Link>
              </p>
              <p className="flex items-center">
                <Youtube className="w-5 h-5" />
                <Link
                  className="ml-1 underline"
                  href="https://youtube.com/@elliottchong"
                >
                  YouTube
                </Link>
              </p>
            </div> */}
                        <p className="my-2 mt-4">
                            Web học tập trực tuyến đang trở thành một xu hướng
                            phổ biến, mở ra những cơ hội học vô song cho mọi
                            người trên khắp thế giới. Với sự phát triển của công
                            nghệ, việc tiếp cận kiến thức không còn giới hạn bởi
                            địa lý hay thời gian. Những trang web học trực tuyến
                            không chỉ mang lại sự thuận tiện mà còn tạo ra môi
                            trường học tập đa dạng, linh hoạt, và tương tác. Đây
                            là nền tảng cho những người học muốn nâng cao kỹ
                            năng, kiến thức mà không phải rời khỏi nhà, từ đó
                            giúp họ tự chủ hơn trong việc quản lý thời gian và
                            đạt được mục tiêu học tập của mình.
                        </p>
                        <hr />
                        <div className="my-2 font-semibold">
                            <h4 className="text-base font-semibold">
                                Built with
                            </h4>
                            <div className="grid justify-around grid-cols-4 mt-2 gap-y-3">
                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="nestjs"
                                        src="/images/nestjs.png"
                                        width={35}
                                        height={35}
                                    />
                                    <span className="">Nest.js</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="nextjs"
                                        src="/images/nextjs.png"
                                        width={35}
                                        height={35}
                                    />
                                    <span className="">Next.js</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="tailwind"
                                        src="/images/tailwind.png"
                                        width={35}
                                        height={35}
                                    />
                                    <span className="">Tailwind</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="nextauth"
                                        src="/images/nextauth.png"
                                        width={30}
                                        height={30}
                                    />
                                    <span className="">NextAuth</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="openai"
                                        src="/images/openai.png"
                                        width={30}
                                        height={30}
                                    />
                                    <span className="">OpenAI</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="swr"
                                        src="/images/swr.png"
                                        width={30}
                                        height={30}
                                    />
                                    <span className="">SWR</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="primsa"
                                        src="/images/prisma.png"
                                        width={30}
                                        height={30}
                                    />
                                    <span className="">Prisma</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Image
                                        alt="typescript"
                                        src="/images/typescript.png"
                                        width={30}
                                        height={30}
                                    />
                                    <span className="">TypeScript</span>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DetailsDialog;
