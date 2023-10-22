import { Metadata } from "next"
import Image from "next/image"
import { BiPlusCircle } from "react-icons/bi"
import { BiStar } from "react-icons/bi";
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { AlbumArtwork } from "./components/album-artwork"
import { Menu } from "./components/menu"
import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder"
import { Sidebar } from "./components/sidebar"
import { listenNowAlbums, madeForYouAlbums } from "./data/albums"
import { playlists } from "./data/playlists"
import data from "@/public/data_course_example.json";


export const metadata: Metadata = {
    title: "Music App",
    description: "Example music app using the components.",
}

export default function InstructorPage() {
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
                {/* <Menu /> */}
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            {/* <Sidebar playlists={playlists} className="hidden lg:block" /> */}
                            <div className="col-span-3 lg:col-span-4 lg:border-l">
                                <div className="h-full px-4 py-6 lg:px-8">
                                    <Tabs defaultValue="music" className="h-full space-y-6">
                                        <div className="flex items-center space-between">
                                            {/* <TabsList>
                                                <TabsTrigger value="music" className="relative">
                                                    Music
                                                </TabsTrigger>
                                                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                                                <TabsTrigger value="live" disabled>
                                                    Live
                                                </TabsTrigger>
                                            </TabsList> */}
                                            <div className="ml-auto mr-4">
                                                <Button>
                                                    <BiPlusCircle className="w-4 h-4 mr-2" />
                                                    Add Course
                                                </Button>
                                            </div>
                                        </div>
                                        <TabsContent
                                            value="music"
                                            className="p-0 border-none outline-none"
                                        >
                                            {/* <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-semibold tracking-tight">
                                                        Listen Now
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Top picks for you. Updated daily.
                                                    </p>
                                                </div>
                                            </div> */}
                                            <Separator className="my-4" />
                                            {/* <div className="relative">
                                                <ScrollArea>
                                                    <div className="flex pb-4 space-x-4">
                                                        {listenNowAlbums.map((album) => (
                                                            <AlbumArtwork
                                                                key={album.name}
                                                                album={album}
                                                                className="w-[250px]"
                                                                aspectRatio="portrait"
                                                                width={250}
                                                                height={330}
                                                            />
                                                        ))}
                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                            </div> */}
                                            <div className="mt-6 space-y-1">
                                                <h2 className="text-2xl font-semibold tracking-tight">
                                                    Course
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Course your created
                                                </p>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="relative">
                                                <ScrollArea>
                                                    <div className="flex pb-4 space-x-4">
                                                        {data.map((item, i) => (
                                                            <div className="h-60 w-60" key={i}>
                                                                <div className="flex flex-col items-start space-y-[1px]">
                                                                    <img src="/images/learning.webp" alt="" className="w-full h-32" />
                                                                    <h2 className="pt-1 font-bold text-md">{item.title}</h2>
                                                                    <h2 className="text-xs text-gray-700">{item.username}</h2>
                                                                    <div className="flex space-x-1">
                                                                        <h3 className="text-sm font-bold text-orange-800">{item.vote}</h3>
                                                                        <div className="flex items-center">
                                                                            <BiStar className="w-4 text-orange-400" />
                                                                            <BiStar className="w-4 text-orange-400" />
                                                                            <BiStar className="w-4 text-orange-400" />
                                                                            <BiStar className="w-4 text-orange-400" />
                                                                            <BiStar className="w-4 text-orange-400" />
                                                                        </div>
                                                                        <h3 className="text-xs">{item.students}</h3>
                                                                    </div>
                                                                    {/* <div className="flex items-center space-x-4">
                                                                        <h3 className="font-bold text-black">{item.price}</h3>
                                                                        <h3 className="text-sm text-gray-800 line-through">{item.oldPrice}</h3>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                            </div>
                                        </TabsContent>
                                        {/* <TabsContent
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
                                        </TabsContent> */}
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}