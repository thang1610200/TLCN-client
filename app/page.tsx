"use client";
import FirstScreen from '@/components/landing-page/components/FirstScreen';
import SecondScreen from '@/components/landing-page/components/SecondScreen';
import Link from 'next/link';



export default function HomePage() {
    return (
        <div>
            <div className="w-full h-full"> {/*Chua dung lazy animation*/}
                <FirstScreen/> 
                <SecondScreen/>
                <div className="flex flex-col items-center justify-center bg-top bg-no-repeat w-dvw h-dvh bg-zinc-800" style={{ backgroundImage: 'url(//web-assets.ifttt.com/packs/media/prosumer/home-hero-a2644b8d67b6842e1bbf.svg)', backgroundSize: "115%", backgroundPositionX: "center", backgroundPositionY: "-10%" }}>
                    <div className="flex flex-col items-center justify-center h-56 max-w-4xl mt-20">
                        <div className="flex items-center justify-center h-56 max-w-4xl mt-20">
                            <h1 className="p-4 leading-normal text-center font-beauSans-extrabold text-7xl text-slate-50 line-clamp-2 ">LEARNER</h1>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xl text-slate-50">
                            <Link href="#" legacyBehavior passHref>About</Link>
                            <Link href="#" legacyBehavior passHref>Features</Link>
                            <Link href="#" legacyBehavior passHref>Works</Link>
                            <Link href="#" legacyBehavior passHref>Support</Link>
                            <Link href="#" legacyBehavior passHref>Help</Link>
                        </div>

                    </div>
                </div> 
            </div>
        </div>
    )
}