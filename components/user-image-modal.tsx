import React, { useEffect } from 'react'
import { ProfileUser } from "@/app/types"
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button"
import { Dialog, Transition } from '@headlessui/react'
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

import Resizer from 'react-image-file-resizer';

interface UserProps {
    data: ProfileUser;
}



export default function UserImageModal(props: UserProps) {
    const user = props.data;
    const maxWidth = 600;
    const maxHeight = 600;
    // const [fileInput, setFileInput] = useState();
    const [isOpenChangeImage, setIsOpenChangeImage] = useState(false)
    const [imageUser, setImageUser] = useState(user.image);
    const [valueWH, setValueWH] = useState([500]);
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            // setFileInput(file);
            reader.onload = (e) => {
                if (e.target) {
                    setImageUser(e.target.result as string);
                }
            };

            reader.readAsDataURL(file);
            console.log(imageUser);
        }
    }
    // const resizeFile = (file: File) =>
    //     new Promise((resolve) => {
    //         Resizer.imageFileResizer(
    //             file,
    //             valueWH[0],
    //             valueWH[0],
    //             "WEBP",
    //             100,
    //             0,
    //             (uri) => {
    //                 resolve(uri);
    //             },
    //             "base64"
    //         );
    //     });
    // const handleSliderChange = async () =>{
    //     try {
    //         const file = 
    //         const image = await resizeFile(file);
    //         console.log(image);
    //       } catch (err) {
    //         console.log(err);
    //       }
    // }
    // const handleSubmit = () => {
    //     const file = event.target.files?.[0];
    //     console.log(file);
    //     console.log("Handle Submit");
    // }
    useEffect(() => {
        console.log(valueWH)
    }, [valueWH]);


    return (
        <>
            <div className="flex justify-center ">
                <div className="w-[150px] h-[150px] relative">
                    <img src={user.image.toString()} className="w-full rounded-full" />
                    <Button onClick={() => { setIsOpenChangeImage(true) }} className="absolute bottom-0 right-0 w-10 h-10 text-xl text-white rounded-full bg-slate-400">＋</Button>
                </div>
            </div>
            <Transition appear show={isOpenChangeImage} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { setIsOpenChangeImage(false) }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full gap-5 p-4 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Select image user
                                    </Dialog.Title>
                                    <div className='relative'>
                                        <img
                                            src={imageUser}
                                            alt="User image"
                                            className="relative justify-center object-contain p-4 bg-no-repeat opacity-30"
                                            width={valueWH[0]}
                                            height={valueWH[0]}
                                        />
                                        <img
                                            src={imageUser}
                                            alt="User image"
                                            className="absolute justify-center object-contain w-full h-full p-4 translate-x-1/2 -translate-y-1/2 bg-no-repeat rounded-full top-1/2 right-1/2"
                                            width={valueWH[0]}
                                            height={valueWH[0]}
                                        />

                                    </div>
                                    <Slider defaultValue={valueWH} max={600} min={400} step={10} className='py-4' onValueChange={setValueWH} />
                                    <Input onChange={handleOnChange} accept="image/*" type="file" />

                                    <div className="grid w-full grid-cols-2 gap-10 pt-6">
                                        <Button type="submit">Save</Button>
                                        <Button type="button" onClick={() => { setIsOpenChangeImage(false) }}>Cancel</Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
