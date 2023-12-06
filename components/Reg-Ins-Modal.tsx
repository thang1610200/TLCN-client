'use client';

import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from "@/components/ui/button";


export default function RegisterInsModal() {

    let [isOpen, setIsOpen] = useState(false);
    const setLearnerToInstructor = () => {
        console.log("Set Learner to Instructor");
        setIsOpen(false);
        //set role = instructor
        //link to instructor page
    }
    return (
        <div>
            <div className="relative flex justify-center align-middle rounded-full w-fit h-fit hover:bg-slate-50 hover:bg-opacity-30 " onClick={() => setIsOpen(true)}>
                <p className="items-center justify-center hidden text-center md:flex">
                    Trở thành gia sư
                </p>
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { setIsOpen(false) }}>
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
                                        className="p-4 pb-0 text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Bạn muốn trở thành gia sư
                                    </Dialog.Title>
                                    <div className='p-4'>
                                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Etiam nisl dolor, egestas eu auctor ut, bibendum eget quam.
                                            Nam et suscipit purus. Fusce at tempor ipsum.
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-2 gap-10'>
                                        <Button onClick={() => setLearnerToInstructor()}>Chấp nhận</Button>
                                        <Button onClick={() => setIsOpen(false)}>Hủy bỏ</Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
