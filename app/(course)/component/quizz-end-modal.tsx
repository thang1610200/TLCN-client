import React, { useState, Fragment } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/button';


export default function QuizzEndModal() {
    let [isOpen, setIsOpen] = useState(true);
    return (
        <>
            <div className="flex items-center justify-center">
                <Button type='button'
                        onClick={() => { setIsOpen(true) }}
                        className='w-40 text-base'
                >
                    Question
                </Button>
                {/* <button
                    type="button"
                    onClick={() => { setIsOpen(true) }}
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >

                </button> */}
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
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
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
                                        className="text-lg font-medium leading-6 text-left text-gray-900 indent-8"
                                    >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac est consequat, eleifend nulla eu, lacinia turpis. Praesent cursus interdum felis, eu porta diam rutrum eu.
                                    </Dialog.Title>
                                    <div className="mt-6 space-y-6">
                                        <div className='p-4 rounded-lg gird bg-slate-100'>
                                            <RadioGroup defaultValue="comfortable" className='relative grid justify-center mt-4 space-y-4'>
                                                <div className="flex items-center space-x-2 ">
                                                    <RadioGroupItem value="default" id="r1" />
                                                    <Label htmlFor="r1">A. Answer A</Label>
                                                </div>
                                                <div className="flex space-x-2 items- center">
                                                    <RadioGroupItem value="comfortable" id="r2" />
                                                    <Label htmlFor="r2">B. Answer B</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="compact" id="r3" />
                                                    <Label htmlFor="r3">C. Answer C</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="compress" id="r4" />
                                                    <Label htmlFor="r4">D. Answer D</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => { setIsOpen(false) }}
                                        >
                                            Submit
                                        </button>
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
