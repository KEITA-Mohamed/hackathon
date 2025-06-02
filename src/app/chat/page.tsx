'use client';

import './style.scss';
import {ReactNode, useState, useRef} from 'react';
import Archive from '../../components/archive/archive';
import Message from '../../components/message/message';
import Input from '../../components/input/input';
import UserInfo from '../../components/user-info/user-info';
import Settings from '../../components/settings/settings';
import Background from '../../components/background/background';
// import {aiModelUserChoice} from '@/signals/aiModelUserChoice';
import { useSignals} from '@preact/signals-react/runtime';
// import {currentModel} from "@/signals/chatSignals";

export default function Chat() {
    useSignals()
    const scrollContainer = useRef<HTMLDivElement>(null);
    const [messagesList, setMessagesList] = useState<ReactNode[]>([]);


    function getMessage(data: { name: string; text: string; user: boolean }): void {
        setMessagesList((prevState) => [
            ...prevState,
            <Message key={prevState.length} name={data.name} text={data.text} user={data.user} />,
        ]);

        setTimeout(() => {
            if (scrollContainer.current) {
                scrollContainer.current.scrollTo({
                    top: scrollContainer.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 100);
    }

    return (
        <div id="main-container">
            <Background />
            <Archive />
            <section id="chat-container">
                <div id="chat-header">
                    <UserInfo />
                    <Settings />
                </div>
                <div id="messages-container" ref={scrollContainer}>
                    {messagesList}
                </div>
                <Input userQuestion={getMessage} iaAnswer={getMessage} />
            </section>


        </div>
    );
}
