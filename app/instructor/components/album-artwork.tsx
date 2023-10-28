import Image from "next/image"
import { BiPlusCircle } from "react-icons/bi"

import { cn } from "@/lib/utils"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Album } from "../data/albums"
import { playlists } from "../data/playlists"
import { course } from "@/types";
import { BiStar } from "react-icons/bi";


interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    course: course
    aspectRatio?: "portrait" | "square"
    width?: number
    height?: number
}

export function AlbumArtwork({
    course,
    aspectRatio = "portrait",
    width,
    height,
    className,
    ...props
}: AlbumArtworkProps) {
    return (
        <div className={cn("space-y-3", className)} {...props}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="rounded-md ">
                        <Image
                            src="/images/learning.webp"
                            alt={course.title}
                            width={width}
                            height={height}
                            className={cn(
                                "h-auto w-auto object-cover transition-all hover:scale-105",
                                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                            )}
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                    <ContextMenuItem>Add to Library</ContextMenuItem>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                            <ContextMenuItem>
                                <BiPlusCircle className="w-4 h-4 mr-2" />
                                New Playlist
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            {playlists.map((playlist) => (
                                <ContextMenuItem key={playlist}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="w-4 h-4 mr-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                                    </svg>
                                    {playlist}
                                </ContextMenuItem>
                            ))}
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Play Next</ContextMenuItem>
                    <ContextMenuItem>Play Later</ContextMenuItem>
                    <ContextMenuItem>Create Station</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Like</ContextMenuItem>
                    <ContextMenuItem>Share</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <div className="space-y-1 text-sm">
                <div className="flex items-center">
                    <BiStar className="w-4 text-orange-400" />
                    <BiStar className="w-4 text-orange-400" />
                    <BiStar className="w-4 text-orange-400" />
                    <BiStar className="w-4 text-orange-400" />
                    <BiStar className="w-4 text-orange-400" />
                </div>
                <h3 className="font-medium leading-none">{course.title}</h3>
                <p className="text-xs text-muted-foreground">{course.students}</p>
            </div>
        </div>
    )
}