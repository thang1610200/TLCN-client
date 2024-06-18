"use client"
import React, { useState } from 'react'
import Script from 'next/script';
import { Button } from '../ui/button';


export default function ChatBot() {
    // const [isOpen, setIsOpen] = useState(true)
    // function handleOnClick() {
    //     window.botpressWebChat.sendPayload({ type: "openchat"})
    //     console.log("send")
    // }
    return (
        <>
            <>
                <Script
                    src='https://cdn.botpress.cloud/webchat/v1/inject.js'
                    strategy='lazyOnload'
                    onLoad={() => {
                        window.botpressWebChat.init({
                            "composerPlaceholder": "Chat with bot",
                            "botConversationDescription": "This chatbot was built surprisingly fast with Botpress",
                            "botId": "014f8889-2098-46cf-9486-1ca9d791b129",
                            "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
                            "messagingUrl": "https://messaging.botpress.cloud",
                            "clientId": "014f8889-2098-46cf-9486-1ca9d791b129",
                            "webhookId": "83a924b6-dce9-4a30-a48a-f170c2795f91",
                            "lazySocket": true,
                            "themeName": "prism",
                            "stylesheet": "https://webchat-styler-css.botpress.app/prod/code/8759bae3-e82a-40e1-b05c-e0f0fcb9f10c/v73131/style.css",
                            "frontendVersion": "v1",
                            "enableConversationDeletion": true,
                            "theme": "prism",
                            "themeColor": "#2563eb",
                            "allowedOrigins": [],
                            "showCloseButton": true,
                        });
                        window.addEventListener('message', function (event) {
                            if (event.data.type === 'LIFECYCLE.READY') {
                                window.botpressWebChat.sendPayload({ type: 'text', text: 'Xin chào' })
                            }
                            // if (event.data.type === 'UI.OPENED') {
                            // }
                            // if (event.data.type === 'UI.CLOSED') {
                            //     window.botpressWebChat.mergeConfig({ hideWidget: true })
                            // }
                        })
                        // window.addEventListener('openchat', function (event){
                        //     if (event.type === 'openchat' ) {
                        //         window.botpressWebChat.mergeConfig({hideWidget: false })
                        //     }
                        //     console.log("openchat "+ event)
                        // })
                    }}
                />
            </>
            {/* <>
                {isOpen && <Button onClick={handleOnClick} className='absolute bg-red-500 size-7 bottom-5 right-10'>A</Button>}
            </> */}
        </>
    )
}
