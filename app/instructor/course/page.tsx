import { Metadata } from "next"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { AlbumArtwork } from "../components/album-artwork"
import { Menu } from "../components/menu"
import { PodcastEmptyPlaceholder } from "../components/podcast-empty-placeholder"
import { Sidebar } from "../components/sidebar"
import { listenNowAlbums, madeForYouAlbums } from "../data/albums"
import { playlists } from "../data/playlists"
import axios from 'axios';
import CreateCourseModal from "../components/create-modal"
import data from "@/public/data_course_example.json";
import { BACKEND_URL } from "@/lib/constant"
import getSession from "@/app/actions/getSession"

export const metadata: Metadata = {
    title: "Music App",
    description: "Example music app using the components.",
}

export default async function MusicPage() {
    const session = await getSession();
    const course = await axios.get(`${BACKEND_URL}/course/all-course?email=${session?.user.email}`, {
        headers: {
            Authorization: `Bearer ${session?.backendTokens.accessToken}`,
            "Content-Type": "application/json"
        }
    });

    return (
        <>
            <div className="md:hidden">
                <Image
                    src="/examples/music-light.png"
                    width={1280}
                    height={1114}
                    alt="Music"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/music-dark.png"
                    width={1280}
                    height={1114}
                    alt="Music"
                    className="hidden dark:block"
                />
            </div>
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Sidebar playlists={playlists} className="hidden lg:block" />
                            <div className="col-span-3 lg:col-span-4 lg:border-l">
                                <div className="h-full px-4 py-6 lg:px-8">
                                    <Tabs defaultValue="music" className="h-full space-y-6">
                                        <div className="flex items-center bg-black space-between">
                                            <CreateCourseModal />
                                        </div>
                                        <TabsContent
                                            value="music"
                                            className="p-0 border-none outline-none"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        Listen Now
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Top picks for you. Updated daily.
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="mt-6 space-y-1">
                                                <h2 className="text-2xl font-semibold tracking-tight">
                                                    Made for You
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Your personal playlists. Updated daily.
                                                </p>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="relative">
                                                <ScrollArea>
                                                    <div className="flex pb-4 space-x-4">
                                                        {data.map((course) => (
                                                            <AlbumArtwork
                                                                key={course.id}
                                                                course={course}
                                                                className="w-[150px]"
                                                                aspectRatio="square"
                                                                width={150}
                                                                height={150}
                                                            />
                                                        ))}
                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                            </div>
                                        </TabsContent>
                                        <TabsContent
                                            value="podcasts"
                                            className="h-full flex-col border-none p-0 data-[state=active]:flex"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        New Episodes
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Your favorite podcasts. Updated daily.
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <PodcastEmptyPlaceholder />
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}